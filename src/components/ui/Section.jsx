export default function Section({ id, index, title, action, children, className = "" }) {
  return (
    <section id={id} className={`border-b border-line px-5 sm:px-8 md:px-12 py-12 md:py-16 ${className}`}>
      <div className="flex items-end justify-between gap-4 flex-wrap mb-8 md:mb-10">
        <div>
          <div className="font-mono text-[11px] text-accent tracking-[0.25em] mb-2">{index}</div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wide text-text leading-none">
            {title}
          </h3>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function SeeAll({ children = "查看全部 →" }) {
  return (
    <a
      href="#"
      className="font-mono text-xs tracking-[0.15em] uppercase text-dim border-b border-line-bright hover:text-accent hover:border-accent pb-0.5 transition-colors"
    >
      {children}
    </a>
  );
}
