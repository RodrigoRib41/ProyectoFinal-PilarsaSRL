import type { ReactNode } from "react";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AdminPage({
  eyebrow,
  title,
  description,
  children,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-[1.6rem] border border-white/20 bg-slate-950 px-4 py-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.28)] sm:rounded-[2rem] sm:px-6 sm:py-8 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              {eyebrow}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">{description}</p>
          </div>
          {actions ? <div className="w-full shrink-0 sm:w-auto">{actions}</div> : null}
        </div>
      </section>
      {children}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] sm:rounded-[1.75rem] sm:p-5",
        className,
      )}
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function AdminMetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const tones = {
    default: "border-slate-200 bg-white text-slate-950",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold sm:text-2xl">{value}</p>
    </div>
  );
}
