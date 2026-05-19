function AlertBadge({ count, variant = "default" }) {
  if (!count) return null;
  const styles = {
    default: "bg-blue-600 text-white",
    critical: "bg-red-600 text-white animate-pulse",
    warning: "bg-orange-500 text-white"
  };
  return (
    <span
      className={`absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold ${styles[variant] || styles.default}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default AlertBadge;
