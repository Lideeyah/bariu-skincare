import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
        Bariu Skincare
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-stone-900">
        Let&apos;s figure out what your skin actually needs.
      </h1>
      <p className="mt-4 text-stone-600">
        This is a short test about your skin, sweat, and how it reacts to heat and
        humidity. There&apos;s no right or wrong answer — just pick whatever feels
        true for you. It only takes a few minutes.
      </p>

      <Link
        href="/test"
        className="mt-10 inline-flex items-center justify-center rounded-xl bg-stone-900 px-6 py-3.5 text-center font-medium text-white transition hover:bg-stone-700"
      >
        Start the test
      </Link>
    </main>
  );
}
