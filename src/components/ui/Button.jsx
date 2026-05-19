import { btnPrimary, btnSecondary, btnDanger } from "./uiClasses.js";

const variants = {
  primary: btnPrimary,
  secondary: btnSecondary,
  danger: btnDanger
};

function Button({
  children,
  variant = "primary",
  type = "button",
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <button type={type} className={`${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={17} strokeWidth={2} />}
      {children}
    </button>
  );
}

export default Button;
