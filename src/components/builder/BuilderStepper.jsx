import { Check } from "lucide-react";

export default function BuilderStepper({ steps, current, onStepClick }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <button
            key={step.id}
            onClick={() => onStepClick(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : done
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {done ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-xs">
                {i + 1}
              </span>
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}