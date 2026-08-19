import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-xl border border-[color:var(--border-soft)] bg-[color:var(--surface)] px-4 py-3 font-sans text-sm text-[color:var(--ink)] outline-none transition-colors focus:border-[color:var(--gold)]";

export function FormField({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="font-sans text-xs uppercase tracking-wide text-[color:var(--ink-muted)]">
        {label}
        {required && <span className="ml-1 text-[color:var(--gold)]">*</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClasses, props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldClasses, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldClasses, "resize-none", props.className)} />;
}
