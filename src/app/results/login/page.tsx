export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold text-stone-900">Results access</h1>
      <p className="mt-2 text-sm text-stone-500">
        Enter the admin password to view Bariu&apos;s skincare test results.
      </p>

      <form action="/api/admin-login" method="POST" className="mt-8 flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          required
          className="rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-stone-500"
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            That password isn&apos;t right. Try again.
          </p>
        )}
        <button
          type="submit"
          className="rounded-xl bg-stone-900 px-4 py-3 font-medium text-white transition hover:bg-stone-700"
        >
          View results
        </button>
      </form>
    </main>
  );
}
