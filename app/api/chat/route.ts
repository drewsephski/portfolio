import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { OpenRouterProviderOptions } from "@openrouter/ai-sdk-provider";
import { describeCurrentPage } from "@/lib/portfolio-ai/context";
import { defaultChatModel, maxOutputTokens, maxRequestCharacters } from "@/lib/portfolio-ai/limits";
import { prepareChatMessages } from "@/lib/portfolio-ai/messages";
import { consumeChatRateLimit } from "@/lib/portfolio-ai/rate-limit";
import { buildPortfolioInstructions } from "@/lib/portfolio-ai/system-prompt";

export const maxDuration = 30;

const modelPattern = /^[a-z0-9][a-z0-9._:/-]{0,118}$/i;

const openRouterOptions = {
  reasoning: { effort: "minimal" },
} satisfies OpenRouterProviderOptions;

function resolveModel() {
  const configured = process.env.OPENROUTER_MODEL?.trim();
  if (configured && modelPattern.test(configured)) return configured;
  return defaultChatModel;
}

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded && forwarded.length <= 80) return forwarded;
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && realIp.length <= 80) return realIp;
  return null;
}

function chatError(status: number, retryAfterSeconds?: number) {
  const headers = new Headers();
  if (retryAfterSeconds) headers.set("Retry-After", String(retryAfterSeconds));
  return Response.json(
    { error: "I couldn't answer that just now. Try again in a moment." },
    { status, headers },
  );
}

export async function POST(request: Request) {
  const address = clientAddress(request);
  if (address) {
    const limit = consumeChatRateLimit(address);
    if (!limit.allowed) return chatError(429, limit.retryAfterSeconds);
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > maxRequestCharacters) return chatError(413);
    payload = JSON.parse(raw) as unknown;
  } catch {
    return chatError(400);
  }

  if (!payload || typeof payload !== "object") return chatError(400);

  const body = payload as { messages?: unknown; page?: unknown };
  const prepared = prepareChatMessages(body.messages);
  if (!prepared.ok) return chatError(400);

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("Portfolio chat is not configured.");
    return chatError(503);
  }

  const pageNote = describeCurrentPage(typeof body.page === "string" ? body.page : "/");

  try {
    const openrouter = createOpenRouter({
      apiKey,
      appName: "Pontail",
      appUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    });

    const result = streamText({
      model: openrouter(resolveModel()),
      instructions: buildPortfolioInstructions(pageNote),
      messages: await convertToModelMessages(prepared.messages),
      maxOutputTokens,
      temperature: 0.3,
      providerOptions: {
        openrouter: openRouterOptions,
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        sendReasoning: false,
        onError: () => "I couldn't answer that just now.",
      }),
    });
  } catch (error) {
    console.error("Portfolio chat failed.", error instanceof Error ? error.name : "Error");
    return chatError(502);
  }
}
