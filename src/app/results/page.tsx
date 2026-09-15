import Link from "next/link";
import { getSupabaseAdmin, type Submission } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ResultsPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, created_at, name, answers")
    .order("created_at", { ascending: false });

  const submissions = (data ?? []) as Submission[];

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">Test results</h1>
        <form action="/api/admin-logout" method="POST">
          <button type="submit" className="text-sm text-stone-500 underline hover:text-stone-700">
            Log out
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Couldn&apos;t load results: {error.message}
        </p>
      )}

      {!error && submissions.length === 0 && (
        <p className="mt-6 text-stone-500">No submissions yet.</p>
      )}

      <ul className="mt-6 flex flex-col gap-3">
        {submissions.map((s) => (
          <li key={s.id}>
            <Link
              href={`/results/${s.id}`}
              className="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3.5 transition hover:border-stone-400"
            >
              <div>
                <p className="font-medium text-stone-900">{s.name}</p>
                <p className="text-sm text-stone-500">{formatDate(s.created_at)}</p>
              </div>
              <span className="text-sm text-stone-400">
                {Object.keys(s.answers ?? {}).length} answers
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
