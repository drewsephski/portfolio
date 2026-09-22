import { NextRequest, NextResponse } from "next/server";
import { isDrewsCloneAuthorized, unauthorized } from "../_lib/auth";
import {
  buildWeatherSummary,
  isWeatherToolName,
  parseWeatherRequest,
} from "../_lib/weather";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ToolCall = {
  id?: string;
  toolCallId?: string;
  name?: string;
  function?: {
    name?: string;
    arguments?: string | Record<string, unknown>;
    parameters?: string | Record<string, unknown>;
  };
  arguments?: string | Record<string, unknown>;
  parameters?: string | Record<string, unknown>;
};

function parseArgSource(value: unknown): Record<string, unknown> {
  if (value == null) {
    return {};
  }
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
      return {};
    } catch {
      return { raw: value };
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function isNonEmptyObject(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length > 0;
}

function extractToolCallArgs(tc: ToolCall): Record<string, unknown> {
  const fn = tc.function ?? {};
  const sources = [
    parseArgSource(fn.arguments),
    parseArgSource(tc.arguments),
    parseArgSource(tc.parameters),
    parseArgSource(fn.parameters),
  ];

  let merged: Record<string, unknown> = {};
  for (const source of sources) {
    if (isNonEmptyObject(source)) {
      merged = { ...merged, ...source };
    }
  }
  if (isNonEmptyObject(merged)) {
    return merged;
  }
  return sources.find((s) => typeof s === "object") ?? {};
}

function extractToolCalls(data: Record<string, unknown>): ToolCall[] {
  const message =
    data?.message && typeof data.message === "object"
      ? (data.message as Record<string, unknown>)
      : data;
  let toolCalls: ToolCall[] =
    (message?.toolCalls as ToolCall[]) ||
    (message?.toolCallList as ToolCall[]) ||
    (message?.toolCall ? [message.toolCall as ToolCall] : []) ||
    [];
  if (
    (!toolCalls || toolCalls.length === 0) &&
    Array.isArray(data?.toolWithToolCallList)
  ) {
    toolCalls = (data.toolWithToolCallList as Array<{ toolCall?: ToolCall }>)
      .map((item) => item?.toolCall)
      .filter(Boolean) as ToolCall[];
  }
  return toolCalls || [];
}

async function summarizeFromSource(
  source: Record<string, unknown>,
): Promise<string> {
  const request = parseWeatherRequest(source);
  if (!request) {
    return "I need a location to check the weather. Please provide a city, harbor, or place name.";
  }
  try {
    return await buildWeatherSummary(request);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("drews_clone_weather_failed", message);
    return "Weather data is temporarily unavailable. Please try again in a moment.";
  }
}

export async function GET(req: NextRequest) {
  const locationParam = req.nextUrl.searchParams.get("location");
  const whenParam = req.nextUrl.searchParams.get("when");
  const includeMarineParam = req.nextUrl.searchParams.get("includeMarine");
  const fishableParam = req.nextUrl.searchParams.get("fishable");

  if (!locationParam) {
    return NextResponse.json({ ok: true, service: "drews-clone-weather" });
  }

  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  const source: Record<string, unknown> = {
    location: locationParam,
  };
  if (whenParam) {
    source.when = whenParam;
  }
  if (includeMarineParam != null) {
    source.includeMarine = includeMarineParam;
  }
  if (fishableParam != null) {
    source.fishable = fishableParam;
  }

  const summary = await summarizeFromSource(source);
  return NextResponse.json({ ok: true, summary });
}

export async function POST(req: NextRequest) {
  if (!isDrewsCloneAuthorized(req)) {
    return unauthorized();
  }

  let data: Record<string, unknown> = {};
  try {
    const parsed: unknown = await req.json();
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      data = parsed as Record<string, unknown>;
    }
  } catch {
    data = {};
  }

  const toolCalls = extractToolCalls(data);

  if (toolCalls.length > 0) {
    const results: Array<{ toolCallId: string; result: string }> = [];
    for (const tc of toolCalls) {
      const tcid = tc.id || tc.toolCallId || "unknown";
      const fn = tc.function ?? {};
      const name = fn.name || tc.name;
      const args = extractToolCallArgs(tc);
      const merged = { ...data, ...args };

      if (!isWeatherToolName(name)) {
        results.push({
          toolCallId: tcid,
          result: `Unknown tool "${name ?? "unknown"}". This endpoint handles get_weather.`,
        });
        continue;
      }

      const summary = await summarizeFromSource(merged);
      results.push({ toolCallId: tcid, result: summary });
    }
    return NextResponse.json({ results });
  }

  const summary = await summarizeFromSource(data);
  return NextResponse.json({ results: [{ toolCallId: "unknown", result: summary }] });
}
