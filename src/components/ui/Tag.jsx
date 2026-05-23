const variants = {
  default: "bg-accent/10 text-accent border-accent-dim",
  hot: "bg-hot/10 text-hot border-hot/40",
  cool: "bg-cool/10 text-cool border-cool/40",
  safe: "bg-safe/10 text-safe border-safe/40",
  ghost: "bg-transparent text-dim border-line-bright",
};

export default function Tag({ children, variant = "default", className = "" }) {
  return (
    <span
      className={`inline-block font-mono text-[10px] leading-none tracking-[0.1em] uppercase px-2 py-1 border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
