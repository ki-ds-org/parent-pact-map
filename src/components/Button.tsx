import classNames from "classnames";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary" | "tertiary";
  type?: "button" | "submit" | "reset";
  size?: "sm" | "lg";
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
  disabled?: boolean;
}

function Button({
  children,
  onClick,
  variant,
  type = "button",
  size = "lg",
  fullWidth = false,
  as = "button",
  href,
  disabled = false,
}: ButtonProps) {
  const buttonClass = classNames(
    "border-none cursor-pointer transition-colors rounded-3xl font-semibold",
    variant === "primary" && "bg-primary text-on-primary hover:bg-primary/80",
    variant === "secondary" && "bg-secondary text-white", // TODO: Change to background-secondary
    variant === "tertiary" &&
      "bg-gray-200 text-primary border border-primary hover:bg-primary !hover:text-white",
    {
      "px-4 py-2 text-base": size === "lg",
      "px-4 py-1 text-sm": size === "sm",
      "w-full": fullWidth,
    }
  );

  if (as === "a") {
    return (
      <a
        href={href}
        onClick={onClick}
        className={buttonClass}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClass} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
