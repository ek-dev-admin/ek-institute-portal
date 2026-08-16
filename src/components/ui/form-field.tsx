import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: ReactNode;
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-white/75">
        {label}
      </label>

      {children}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
