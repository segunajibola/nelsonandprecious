import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline-light" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--gold)] text-[#fffef6] hover:bg-[color:var(--ink)] shadow-[0_8px_24px_-8px_rgba(28,40,65,0.6)]",
  secondary:
    "border border-[color:var(--gold)] text-[color:var(--ink)] hover:bg-[color:var(--gold)] hover:text-[#fffef6]",
  "outline-light": "border border-white/70 text-white hover:bg-white hover:text-[color:var(--ink)]",
  ghost: "text-[color:var(--ink)] hover:text-[color:var(--gold)]",
};

interface BaseProps {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps & { href: string; target?: string; rel?: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, children } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--gold)] disabled:pointer-events-none disabled:opacity-60",
    variantStyles[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
