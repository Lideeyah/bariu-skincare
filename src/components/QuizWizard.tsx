"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { allQuestions, type QuizOption, type QuizQuestion } from "@/data/quiz";

type AnswerEntry = {
  selected: string[];
  otherText?: string;
};

type AnswerState = Record<string, AnswerEntry>;

type Step =
  | { kind: "name" }
  | { kind: "question"; question: QuizQuestion; sectionTitle: string; isFollowUp?: boolean };

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: "name" }];
  for (const q of allQuestions) {
    steps.push({ kind: "question", question: q, sectionTitle: q.sectionTitle });
    if (q.followUp) {
      steps.push({
        kind: "question",
        question: {
          id: q.followUp.id,
          prompt: q.followUp.prompt,
          options: q.followUp.options,
        },
        sectionTitle: q.sectionTitle,
        isFollowUp: true,
      });
    }
  }
  return steps;
}

const allSteps = buildSteps();

function isFollowUpHidden(step: Step, answers: AnswerState): boolean {
  if (step.kind !== "question" || !step.isFollowUp) return false;
  const parent = allQuestions.find((q) => q.followUp?.id === step.question.id);
  if (!parent?.followUp) return false;
  const parentAnswer = answers[parent.id]?.selected ?? [];
  if (parentAnswer.length === 0) return true;
  return parentAnswer.some((v) => parent.followUp!.hideWhenAnswerIncludesAny.includes(v));
}

function OptionRow({
  option,
  checked,
  onToggle,
}: {
  option: QuizOption;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
        checked
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-[#faf8f4] text-stone-800 hover:border-stone-400"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked ? "border-white" : "border-stone-300"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.793-6.793a1 1 0 011.411-.003z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      <span>{option.label}</span>
    </button>
  );
}

export default function QuizWizard() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("Bariu");
  const [answers, setAnswers] = useState<AnswerState>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const visibleSteps = useMemo(
    () => allSteps.filter((step) => !isFollowUpHidden(step, answers)),
    [answers],
  );

  const current = visibleSteps[stepIndex];
  const isLastStep = stepIndex === visibleSteps.length - 1;

  function toggleOption(questionId: string, option: QuizOption) {
    setAnswers((prev) => {
      const existing = prev[questionId]?.selected ?? [];
      const isSelected = existing.includes(option.value);
      const nextSelected = isSelected
        ? existing.filter((v) => v !== option.value)
        : [...existing, option.value];
      const next: AnswerEntry = { selected: nextSelected };
      const prevOtherText = prev[questionId]?.otherText;
      if (prevOtherText && nextSelected.some((v) => v === option.value || option.isOther)) {
        next.otherText = prevOtherText;
      }
      return { ...prev, [questionId]: next };
    });
  }

  function setOtherText(questionId: string, text: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: prev[questionId]?.selected ?? [], otherText: text },
    }));
  }

  function canProceedFromCurrent(): boolean {
    if (current.kind === "name") return name.trim().length > 0;
    const entry = answers[current.question.id];
    if (!entry || entry.selected.length === 0) return false;
    const selectedOtherOption = current.question.options.find(
      (o) => o.isOther && entry.selected.includes(o.value),
    );
    if (selectedOtherOption && !entry.otherText?.trim()) return false;
    return true;
  }

  async function handleNext() {
    if (!canProceedFromCurrent()) return;
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, answers }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Submit failed (${res.status})`);
      }
      router.push("/test/submitted");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const progress = Math.round(((stepIndex + 1) / visibleSteps.length) * 100);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
        <div
          className="h-full rounded-full bg-stone-900 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-10 flex-1">
        {current.kind === "name" ? (
          <>
            <h1 className="text-2xl font-semibold text-stone-900">Who&apos;s taking this test?</h1>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-6 w-full rounded-xl border border-stone-300 px-4 py-3.5 text-stone-900 outline-none focus:border-stone-500"
            />
          </>
        ) : (
          <>
            <p className="text-sm font-medium uppercase tracking-wide text-stone-400">
              {current.sectionTitle}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-stone-900">
              {current.question.prompt}
            </h1>
            <div className="mt-6 flex flex-col gap-3">
              {current.question.options.map((option) => {
                const entry = answers[current.question.id];
                const checked = entry?.selected.includes(option.value) ?? false;
                return (
                  <div key={option.value}>
                    <OptionRow
                      option={option}
                      checked={checked}
                      onToggle={() => toggleOption(current.question.id, option)}
                    />
                    {option.isOther && checked && (
                      <input
                        type="text"
                        autoFocus
                        value={entry?.otherText ?? ""}
                        onChange={(e) => setOtherText(current.question.id, e.target.value)}
                        placeholder="Please specify"
                        className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 outline-none focus:border-stone-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {submitError && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {submitError}
          </p>
        )}
      </div>

      <div className="mt-10 flex items-center gap-3">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="rounded-xl border border-stone-300 px-5 py-3.5 font-medium text-stone-700 transition hover:border-stone-400 disabled:opacity-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceedFromCurrent() || submitting}
          className="flex-1 rounded-xl bg-stone-900 px-5 py-3.5 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Submitting..." : isLastStep ? "Submit" : "Next"}
        </button>
      </div>
    </main>
  );
}
