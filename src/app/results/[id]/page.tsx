import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin, type Submission } from "@/lib/supabase";
import { orderedQuestionIds, questionById } from "@/data/quiz";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, created_at, name, answers")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const submission = data as Submission;
  const answers = submission.answers as Record<string, { selected: string[]; otherText?: string }>;

  const answeredIds = orderedQuestionIds.filter((qid) => answers[qid]);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <Link href="/results" className="text-sm text-stone-500 underline hover:text-stone-700">
        &larr; All results
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-stone-900">{submission.name}</h1>
      <p className="text-sm text-stone-500">{formatDate(submission.created_at)}</p>

      <div className="mt-8 flex flex-col gap-6">
        {answeredIds.map((qid) => {
          const question = questionById[qid];
          const entry = answers[qid];
          if (!question || !entry) return null;

          const labels = entry.selected.map((value) => {
            const option = question.options.find((o) => o.value === value);
            if (option?.isOther) {
              return entry.otherText ? `${option.label}: ${entry.otherText}` : option.label;
            }
            return option?.label ?? value;
          });

          return (
            <div key={qid} className="border-b border-stone-100 pb-6">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {question.sectionTitle}
              </p>
              <p className="mt-1 font-medium text-stone-900">{question.prompt}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {labels.map((label, i) => (
                  <li
                    key={i}
                    className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}
