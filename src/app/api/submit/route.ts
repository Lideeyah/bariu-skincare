import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { allQuestions } from "@/data/quiz";

type AnswerEntry = {
  selected: string[];
  otherText?: string;
};

const knownQuestionIds = new Set<string>();
for (const q of allQuestions) {
  knownQuestionIds.add(q.id);
  if (q.followUp) knownQuestionIds.add(q.followUp.id);
}

function isAnswerEntry(value: unknown): value is AnswerEntry {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.selected)) return false;
  if (!record.selected.every((v) => typeof v === "string")) return false;
  if (record.otherText !== undefined && typeof record.otherText !== "string") return false;
  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, answers } = body as { name?: unknown; answers?: unknown };

  const cleanName = typeof name === "string" && name.trim() ? name.trim().slice(0, 100) : "Bariu";

  if (typeof answers !== "object" || answers === null) {
    return NextResponse.json({ error: "Missing answers." }, { status: 400 });
  }

  const cleanAnswers: Record<string, AnswerEntry> = {};
  for (const [questionId, entry] of Object.entries(answers as Record<string, unknown>)) {
    if (!knownQuestionIds.has(questionId)) continue;
    if (!isAnswerEntry(entry)) continue;
    if (entry.selected.length === 0) continue;
    cleanAnswers[questionId] = {
      selected: entry.selected,
      ...(entry.otherText ? { otherText: entry.otherText.slice(0, 500) } : {}),
    };
  }

  if (Object.keys(cleanAnswers).length === 0) {
    return NextResponse.json({ error: "No answers provided." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "Server is not configured yet. Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const { error } = await supabase
    .from("submissions")
    .insert({ name: cleanName, answers: cleanAnswers });

  if (error) {
    return NextResponse.json(
      { error: `Could not save your answers: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
