export type WhenOption = "now" | "today" | "tomorrow" | "weekend";

export type WeatherRequest = {
  location: string;
  when: WhenOption;
  includeMarine: boolean;
  fishable: boolean;
};

export type FishabilityLevel = "stay_ashore" | "marginal" | "ok";

type GeocodeResult = {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type DailySlice = {
  date: string;
  weatherCode: number;
  tempMaxF: number;
  tempMinF: number;
  precipProbMax: number | null;
  windSpeedMaxMph: number | null;
  windGustsMaxMph: number | null;
  sunrise: string | null;
  sunset: string | null;
};

type CurrentSlice = {
  temperatureF: number | null;
  weatherCode: number | null;
  windSpeedMph: number | null;
  windDirectionDeg: number | null;
  windGustsMph: number | null;
  precipProb: number | null;
};

type MarineSlice = {
  waveHeightFt: number | null;
  wavePeriodSec: number | null;
  windWaveHeightFt: number | null;
};

const MARINE_KEYWORDS =
  /\b(lake|fishing|harbor|harbour|michigan|marina|pier|offshore|beach)\b/i;

/** Common Lake Michigan harbor / shore queries (Illinois & nearby) for marine + fishable defaults. */
const LAKE_MICHIGAN_SHORE =
  /\b(waukegan|chicago|evanston|winthrop\s*harbor|kenosha|racine|milwaukee|port\s*washington|sheboygan|manitowoc|michigan\s*city|new\s*buffalo|st\.?\s*joseph|south\s*haven|holland|grand\s*haven|muskegon)\b/i;

const TOOL_GET_WEATHER = "get_weather";

export function defaultIncludeMarine(location: string): boolean {
  return MARINE_KEYWORDS.test(location) || LAKE_MICHIGAN_SHORE.test(location);
}

function parseBooleanArg(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (lowered === "true" || lowered === "1" || lowered === "yes") {
      return true;
    }
    if (lowered === "false" || lowered === "0" || lowered === "no") {
      return false;
    }
  }
  return undefined;
}

export function parseFishable(
  value: unknown,
  includeMarine: boolean,
): boolean {
  const parsed = parseBooleanArg(value);
  if (parsed !== undefined) {
    return parsed;
  }
  return includeMarine;
}

export function parseWhen(value: unknown): WhenOption {
  if (typeof value !== "string") {
    return "now";
  }
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "today" ||
    normalized === "tomorrow" ||
    normalized === "weekend" ||
    normalized === "now"
  ) {
    return normalized;
  }
  return "now";
}

export function parseIncludeMarine(
  value: unknown,
  location: string,
): boolean {
  const parsed = parseBooleanArg(value);
  if (parsed !== undefined) {
    return parsed;
  }
  return defaultIncludeMarine(location);
}

export function parseWeatherRequest(
  source: Record<string, unknown>,
): WeatherRequest | null {
  const locationRaw =
    (typeof source.location === "string" ? source.location : undefined) ??
    (typeof source.Location === "string" ? source.Location : undefined);
  if (!locationRaw?.trim()) {
    return null;
  }
  const location = locationRaw.trim();
  const includeMarine = parseIncludeMarine(
    source.includeMarine ?? source.include_marine ?? source.IncludeMarine,
    location,
  );
  return {
    location,
    when: parseWhen(source.when ?? source.When),
    includeMarine,
    fishable: parseFishable(
      source.fishable ?? source.Fishable,
      includeMarine,
    ),
  };
}

export function isWeatherToolName(name: string | undefined): boolean {
  if (!name) {
    return true;
  }
  const normalized = name.trim().toLowerCase();
  return normalized === TOOL_GET_WEATHER || normalized === "getweather";
}

function wmoDescription(code: number | null | undefined): string {
  if (code == null) {
    return "conditions unavailable";
  }
  const map: Record<number, string> = {
    0: "clear skies",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "foggy",
    48: "fog with rime",
    51: "light drizzle",
    53: "drizzle",
    55: "heavy drizzle",
    61: "light rain",
    63: "rain",
    65: "heavy rain",
    66: "freezing rain",
    67: "heavy freezing rain",
    71: "light snow",
    73: "snow",
    75: "heavy snow",
    77: "snow grains",
    80: "light showers",
    81: "showers",
    82: "heavy showers",
    85: "light snow showers",
    86: "heavy snow showers",
    95: "thunderstorms",
    96: "thunderstorms with hail",
    99: "severe thunderstorms with hail",
  };
  return map[code] ?? "mixed conditions";
}

function windDirLabel(degrees: number | null | undefined): string | null {
  if (degrees == null || Number.isNaN(degrees)) {
    return null;
  }
  const dirs = [
    "north",
    "northeast",
    "east",
    "southeast",
    "south",
    "southwest",
    "west",
    "northwest",
  ];
  const idx = Math.round(degrees / 45) % 8;
  return dirs[idx];
}

function formatWind(
  speedMph: number | null | undefined,
  directionDeg: number | null | undefined,
  gustsMph: number | null | undefined,
): string | null {
  if (speedMph == null && gustsMph == null) {
    return null;
  }
  const parts: string[] = [];
  if (speedMph != null) {
    const dir = windDirLabel(directionDeg);
    parts.push(
      dir
        ? `winds ${Math.round(speedMph)} miles per hour from the ${dir}`
        : `winds ${Math.round(speedMph)} miles per hour`,
    );
  }
  if (gustsMph != null) {
    parts.push(`gusts to ${Math.round(gustsMph)}`);
  }
  return parts.join(", ");
}

function formatPlace(place: GeocodeResult): string {
  const bits = [place.name];
  if (place.admin1) {
    bits.push(place.admin1);
  }
  if (place.country && place.country !== "United States") {
    bits.push(place.country);
  }
  return bits.join(", ");
}

async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "drews-clone-weather/vercel" },
  });
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    results?: Array<{
      name: string;
      admin1?: string;
      country?: string;
      latitude: number;
      longitude: number;
    }>;
  };
  const hit = data.results?.[0];
  if (!hit) {
    return null;
  }
  return {
    name: hit.name,
    admin1: hit.admin1,
    country: hit.country,
    latitude: hit.latitude,
    longitude: hit.longitude,
  };
}

function offshoreCoords(
  lat: number,
  lon: number,
): { latitude: number; longitude: number } {
  return { latitude: lat + 0.03, longitude: lon - 0.05 };
}

async function fetchForecast(
  latitude: number,
  longitude: number,
): Promise<{ current: CurrentSlice; daily: DailySlice[] }> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("timezone", "America/Chicago");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("precipitation_unit", "inch");
  url.searchParams.set("forecast_days", "3");
  url.searchParams.set(
    "current",
    "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation_probability",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,sunrise,sunset",
  );

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "drews-clone-weather/vercel" },
  });
  if (!response.ok) {
    throw new Error("Forecast request failed");
  }

  const data = (await response.json()) as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      wind_speed_10m?: number;
      wind_direction_10m?: number;
      wind_gusts_10m?: number;
      precipitation_probability?: number;
    };
    daily?: {
      time?: string[];
      weather_code?: number[];
      temperature_2m_max?: number[];
      temperature_2m_min?: number[];
      precipitation_probability_max?: number[];
      wind_speed_10m_max?: number[];
      wind_gusts_10m_max?: number[];
      sunrise?: string[];
      sunset?: string[];
    };
  };

  const daily: DailySlice[] = [];
  const d = data.daily;
  if (d?.time) {
    for (let i = 0; i < d.time.length; i += 1) {
      daily.push({
        date: d.time[i] ?? "",
        weatherCode: d.weather_code?.[i] ?? 0,
        tempMaxF: d.temperature_2m_max?.[i] ?? 0,
        tempMinF: d.temperature_2m_min?.[i] ?? 0,
        precipProbMax: d.precipitation_probability_max?.[i] ?? null,
        windSpeedMaxMph: d.wind_speed_10m_max?.[i] ?? null,
        windGustsMaxMph: d.wind_gusts_10m_max?.[i] ?? null,
        sunrise: d.sunrise?.[i] ?? null,
        sunset: d.sunset?.[i] ?? null,
      });
    }
  }

  const c = data.current;
  return {
    current: {
      temperatureF: c?.temperature_2m ?? null,
      weatherCode: c?.weather_code ?? null,
      windSpeedMph: c?.wind_speed_10m ?? null,
      windDirectionDeg: c?.wind_direction_10m ?? null,
      windGustsMph: c?.wind_gusts_10m ?? null,
      precipProb: c?.precipitation_probability ?? null,
    },
    daily,
  };
}

async function fetchMarine(
  latitude: number,
  longitude: number,
): Promise<MarineSlice | null> {
  const coords = offshoreCoords(latitude, longitude);
  const url = new URL("https://marine-api.open-meteo.com/v1/marine");
  url.searchParams.set("latitude", String(coords.latitude));
  url.searchParams.set("longitude", String(coords.longitude));
  url.searchParams.set("timezone", "America/Chicago");
  url.searchParams.set("length_unit", "imperial");
  url.searchParams.set("current", "wave_height,wave_period,wind_wave_height");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "drews-clone-weather/vercel" },
  });
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    current?: {
      wave_height?: number;
      wave_period?: number;
      wind_wave_height?: number;
    };
  };
  const current = data.current;
  if (!current) {
    return null;
  }
  return {
    waveHeightFt: current.wave_height ?? null,
    wavePeriodSec: current.wave_period ?? null,
    windWaveHeightFt: current.wind_wave_height ?? null,
  };
}

function dayLabel(dateIso: string, when: WhenOption): string {
  if (when === "tomorrow") {
    return "Tomorrow";
  }
  if (when === "weekend") {
    const day = new Date(`${dateIso}T12:00:00`);
    const dow = day.getUTCDay();
    if (dow === 6) {
      return "Saturday";
    }
    if (dow === 0) {
      return "Sunday";
    }
    return dateIso;
  }
  return "Today";
}

function pickDaily(daily: DailySlice[], when: WhenOption): DailySlice[] {
  if (daily.length === 0) {
    return [];
  }
  if (when === "now" || when === "today") {
    return [daily[0]];
  }
  if (when === "tomorrow") {
    return daily[1] ? [daily[1]] : [];
  }
  const weekendDays = daily.filter((d) => {
    const dow = new Date(`${d.date}T12:00:00`).getUTCDay();
    return dow === 0 || dow === 6;
  });
  return weekendDays.length > 0 ? weekendDays : daily.slice(-2);
}

function formatMarine(marine: MarineSlice | null): string | null {
  if (!marine) {
    return null;
  }
  const parts: string[] = [];
  if (marine.waveHeightFt != null) {
    parts.push(`waves around ${marine.waveHeightFt.toFixed(1)} feet`);
  }
  if (marine.wavePeriodSec != null) {
    parts.push(`period about ${Math.round(marine.wavePeriodSec)} seconds`);
  }
  if (marine.windWaveHeightFt != null && marine.windWaveHeightFt > 0) {
    parts.push(`wind waves near ${marine.windWaveHeightFt.toFixed(1)} feet`);
  }
  if (parts.length === 0) {
    return null;
  }
  return parts.join(", ");
}

const FISHABILITY_DISCLAIMER =
  "This is a rough recreational guide, not marine safety advice.";

type FishabilityInputs = {
  weatherCode: number | null;
  windSustainedMph: number | null;
  windGustsMph: number | null;
  waveHeightFt: number | null;
};

export function assessFishabilityLevel(
  input: FishabilityInputs,
): FishabilityLevel {
  const { weatherCode, windSustainedMph, windGustsMph, waveHeightFt } = input;

  if (weatherCode != null && weatherCode >= 95) {
    return "stay_ashore";
  }
  if (waveHeightFt != null && waveHeightFt >= 4.0) {
    return "stay_ashore";
  }
  if (windSustainedMph != null && windSustainedMph >= 25) {
    return "stay_ashore";
  }
  if (windGustsMph != null && windGustsMph >= 35) {
    return "stay_ashore";
  }

  if (weatherCode === 65 || weatherCode === 82) {
    return "marginal";
  }
  if (
    waveHeightFt != null &&
    waveHeightFt >= 3.0 &&
    waveHeightFt < 4.0
  ) {
    return "marginal";
  }
  if (
    windSustainedMph != null &&
    windSustainedMph >= 18 &&
    windSustainedMph < 25
  ) {
    return "marginal";
  }
  if (windGustsMph != null && windGustsMph >= 28 && windGustsMph < 35) {
    return "marginal";
  }

  return "ok";
}

function worseFishability(
  a: FishabilityLevel,
  b: FishabilityLevel,
): FishabilityLevel {
  const rank: Record<FishabilityLevel, number> = {
    ok: 0,
    marginal: 1,
    stay_ashore: 2,
  };
  return rank[a] >= rank[b] ? a : b;
}

export function formatFishabilityVerdict(
  level: FishabilityLevel,
  wavesKnown: boolean,
): string {
  const windOnlyNote = wavesKnown
    ? ""
    : " Wave data unavailable; wind-only call.";

  switch (level) {
    case "stay_ashore":
      return `Fishable call: stay ashore — waves or wind are up past a comfortable recreational cutoff (this is a rough guide, not a safety briefing). ${FISHABILITY_DISCLAIMER}${windOnlyNote}`;
    case "marginal":
      return `Fishable call: marginal — choppy / windy; fine for experienced anglers, rough for a leisurely trip.${windOnlyNote} ${FISHABILITY_DISCLAIMER}`;
    case "ok": {
      const windPhrase = wavesKnown
        ? "nothing extreme on wind or waves"
        : "nothing extreme on wind";
      return `Fishable call: looks OK for a casual shore/boat day — ${windPhrase}.${windOnlyNote} ${FISHABILITY_DISCLAIMER}`;
    }
  }
}

function fishabilityFromCurrent(
  current: CurrentSlice,
  marine: MarineSlice | null,
  marineRequested: boolean,
): string {
  const wavesKnown =
    marine != null && marine.waveHeightFt != null;
  const level = assessFishabilityLevel({
    weatherCode: current.weatherCode,
    windSustainedMph: current.windSpeedMph,
    windGustsMph: current.windGustsMph,
    waveHeightFt: marine?.waveHeightFt ?? null,
  });
  const showWavesUnavailable = marineRequested && !wavesKnown;
  return formatFishabilityVerdict(level, !showWavesUnavailable);
}

function fishabilityFromDaily(
  slices: DailySlice[],
  marine: MarineSlice | null,
  marineRequested: boolean,
): string {
  const wavesKnown =
    marine != null && marine.waveHeightFt != null;
  let level: FishabilityLevel = "ok";
  for (const slice of slices) {
    const sliceLevel = assessFishabilityLevel({
      weatherCode: slice.weatherCode,
      windSustainedMph: slice.windSpeedMaxMph,
      windGustsMph: slice.windGustsMaxMph,
      waveHeightFt: marine?.waveHeightFt ?? null,
    });
    level = worseFishability(level, sliceLevel);
  }
  const showWavesUnavailable = marineRequested && !wavesKnown;
  return formatFishabilityVerdict(level, !showWavesUnavailable);
}

function appendFishabilityIfNeeded(
  summary: string,
  request: WeatherRequest,
  current: CurrentSlice,
  dailySlices: DailySlice[],
  marine: MarineSlice | null,
): string {
  if (!request.fishable) {
    return summary;
  }
  const verdict =
    request.when === "now"
      ? fishabilityFromCurrent(current, marine, request.includeMarine)
      : fishabilityFromDaily(dailySlices, marine, request.includeMarine);
  return `${summary} ${verdict}`;
}

function summarizeDaySlice(slice: DailySlice, label: string): string {
  const conditions = wmoDescription(slice.weatherCode);
  const wind = formatWind(slice.windSpeedMaxMph, null, slice.windGustsMaxMph);
  const precip =
    slice.precipProbMax != null
      ? `${Math.round(slice.precipProbMax)}% chance of precipitation`
      : null;
  const temps = `high ${Math.round(slice.tempMaxF)} and low ${Math.round(slice.tempMinF)}`;
  const chunks = [`${label}: ${conditions}, ${temps}`];
  if (wind) {
    chunks.push(wind);
  }
  if (precip) {
    chunks.push(precip);
  }
  return chunks.join(". ");
}

export async function buildWeatherSummary(
  request: WeatherRequest,
): Promise<string> {
  const place = await geocodeLocation(request.location);
  if (!place) {
    return `I could not find weather for "${request.location}". Try a nearby city or harbor name.`;
  }

  const placeLabel = formatPlace(place);
  const { current, daily } = await fetchForecast(
    place.latitude,
    place.longitude,
  );

  let marine: MarineSlice | null = null;
  if (request.includeMarine) {
    marine = await fetchMarine(place.latitude, place.longitude);
  }

  const sentences: string[] = [];

  if (request.when === "now") {
    const temp =
      current.temperatureF != null
        ? `${Math.round(current.temperatureF)} degrees`
        : "temperature unavailable";
    const conditions = wmoDescription(current.weatherCode);
    const wind = formatWind(
      current.windSpeedMph,
      current.windDirectionDeg,
      current.windGustsMph,
    );
    const precip =
      current.precipProb != null
        ? `${Math.round(current.precipProb)}% chance of precipitation`
        : null;

    let line = `Near ${placeLabel}, it is ${temp} with ${conditions}.`;
    if (wind) {
      line += ` ${wind}.`;
    }
    if (precip) {
      line += ` ${precip}.`;
    }
    sentences.push(line.trim());

    const marineText = formatMarine(marine);
    if (marineText) {
      sentences.push(`On the water: ${marineText}.`);
    }
    const summary = sentences.join(" ");
    const dailyNow = daily[0] ? [daily[0]] : [];
    return appendFishabilityIfNeeded(
      summary,
      request,
      current,
      dailyNow,
      marine,
    );
  }

  const slices = pickDaily(daily, request.when);
  if (slices.length === 0) {
    return `I found ${placeLabel}, but the forecast for that time is not available yet.`;
  }

  sentences.push(`Forecast for ${placeLabel}.`);
  for (const slice of slices) {
    const label = dayLabel(slice.date, request.when);
    sentences.push(summarizeDaySlice(slice, label));
  }

  const marineText = formatMarine(marine);
  if (request.includeMarine && marineText) {
    sentences.push(`Marine conditions now: ${marineText}.`);
  }

  const summary = sentences.join(" ");
  return appendFishabilityIfNeeded(
    summary,
    request,
    current,
    slices,
    marine,
  );
}
