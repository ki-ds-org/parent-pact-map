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
    "c-button",
    `c-button--${variant}`,
    {
      "c-button--large": size === "lg",
      "c-button--small": size === "sm",
      "c-button--full-width": fullWidth,
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
