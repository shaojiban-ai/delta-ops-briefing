const NAV = [
  { id: "maps", label: "房间密码" },
  { id: "missions", label: "当前赛季" },
  { id: "loadouts", label: "卡战备" },
  { id: "dept", label: "特勤处" },
  { id: "items", label: "活动物品" },
  { id: "news", label: "官方资讯" },
];

export default function Header() {
  return (
    <header className="border-b border-line px-5 sm:px-8 md:px-12 pt-5 md:pt-8 pb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-11 h-11 md:w-14 md:h-14 border-2 border-accent rotate-45 bg-accent/[0.08] relative shrink-0">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-0.5 bg-accent" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[70%] w-0.5 bg-accent" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl md:text-[28px] leading-none tracking-wide text-text">
              DELTA OPS <span className="text-accent">//</span> 作战简报
            </h1>
            <div className="font-mono text-[10px] md:text-[11px] text-accent tracking-[0.2em] mt-1.5 uppercase">
              三角洲行动 · 国际服攻略站
            </div>
          </div>
        </div>

        <nav className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-1 px-1">
          <ul className="flex gap-5 md:gap-7 min-w-max">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="font-display text-sm font-medium tracking-wide uppercase text-dim hover:text-accent border-b-2 border-transparent hover:border-accent pb-1.5 transition-colors whitespace-nowrap"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
