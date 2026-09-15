export default function SubmittedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-900">
        <svg viewBox="0 0 20 20" fill="none" className="h-8 w-8 text-white">
          <path
            d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.793-6.793a1 1 0 011.411-.003z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-stone-900">
        Your test has been submitted
      </h1>
      <p className="mt-3 text-stone-600">
        Thanks for taking the time to go through it. Your answers have been sent
        through — no further action needed.
      </p>
    </main>
  );
}
