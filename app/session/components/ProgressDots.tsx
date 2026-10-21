export function ProgressDots({ total, currentIndex }: { total: number; currentIndex: number }) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={currentIndex + 1}
      aria-label={`Step ${currentIndex + 1} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-2 rounded-full transition-all ${
            i === currentIndex
              ? "w-6 bg-amber-600"
              : i < currentIndex
                ? "w-2 bg-amber-300"
                : "w-2 bg-stone-200 dark:bg-stone-700"
          }`}
        />
      ))}
    </div>
  );
}
