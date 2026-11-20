import classNames from "classnames";

interface PillProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

function Pill({ children, variant = "primary" }: PillProps) {
  const pillClass = classNames("c-pill", `c-pill--${variant}`);
  return <span className={pillClass}>{children}</span>;
}

export default Pill;
