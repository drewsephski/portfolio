import { getSql, normalizePhone, strField } from "./db";

type BumpLeadInput = {
  phone: string;
  callerName?: string;
  callerEmail?: string;
  summary?: string;
  lastCallAt: Date | null;
};

export async function bumpLeadFromCall(input: BumpLeadInput): Promise<boolean> {
  const phone = normalizePhone(input.phone);
  if (!phone) {
    return false;
  }

  const sql = getSql();
  if (!sql) {
    throw new Error("DREWS_CLONE_DATABASE_URL is not configured");
  }

  const lastCallAt = input.lastCallAt ?? new Date();
  const summary = strField(input.summary);
  const name = strField(input.callerName);
  const email = strField(input.callerEmail);

  const existingRows = await sql`
    SELECT phone, name, email, last_purpose
    FROM drews_clone_leads
    WHERE phone = ${phone}
  `;

  if (existingRows.length > 0) {
    const existing = existingRows[0] as {
      name: string;
      email: string;
      last_purpose: string;
    };
    const nextName = name ?? existing.name;
    const nextEmail = email ?? existing.email;
    const nextPurpose = summary ?? existing.last_purpose;

    await sql`
      UPDATE drews_clone_leads
      SET
        name = ${nextName},
        email = ${nextEmail},
        last_purpose = ${nextPurpose},
        last_call_at = ${lastCallAt.toISOString()}::timestamptz,
        call_count = call_count + 1,
        updated_at = NOW()
      WHERE phone = ${phone}
    `;
    return true;
  }

  await sql`
    INSERT INTO drews_clone_leads (
      phone, name, email, last_purpose, last_call_at, notes, call_count
    ) VALUES (
      ${phone},
      ${name ?? ""},
      ${email ?? ""},
      ${summary ?? ""},
      ${lastCallAt.toISOString()}::timestamptz,
      ${""},
      1
    )
  `;
  return true;
}
