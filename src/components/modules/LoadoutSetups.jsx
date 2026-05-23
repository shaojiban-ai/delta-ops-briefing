import Section from "../ui/Section";
import { loadoutSetups } from "../../data/mock";

const accentMap = {
  accent: { ring: "hover:border-accent", chip: "text-accent border-accent", bar: "bg-accent" },
  cool: { ring: "hover:border-cool", chip: "text-cool border-cool", bar: "bg-cool" },
};

export default function LoadoutSetups() {
  return (
    <Section id="loadouts" index="// 03 — 卡战备 / LOADOUTS" title="战备配装推荐">
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        {loadoutSetups.map((set) => {
          const c = accentMap[set.accent] || accentMap.accent;
          return (
            <div
              key={set.id}
              className={`bg-card border border-line ${c.ring} transition-colors hud-corner flex flex-col`}
            >
              <div className="p-5 border-b border-line flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-2xl font-bold uppercase tracking-wide leading-none">
                    {set.tier}
                  </h4>
                  <div className="font-mono text-[11px] text-dim tracking-[0.2em] mt-1.5">{set.en}</div>
                  <p className="text-sm text-dim mt-3 max-w-sm">{set.summary}</p>
                </div>
                <span className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border ${c.chip} shrink-0`}>
                  {set.tier === "满配起装" ? "META" : "BUDGET"}
                </span>
              </div>

              <ul className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 flex-1">
                {set.gear.map((g) => (
                  <li key={g.slot} className="flex items-baseline gap-3 border-b border-dashed border-line pb-2">
                    <span className="font-mono text-[10px] text-faint uppercase tracking-wider w-12 shrink-0">
                      {g.slot}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-text font-medium">{g.value}</span>
                      <span className="block font-mono text-[10px] text-dim">{g.note}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 border-t border-line flex items-center justify-between font-mono text-xs text-dim">
                <span>{set.priceLabel}</span>
                <span className={`${set.accent === "cool" ? "text-cool" : "text-accent"} text-base`}>
                  ¤ {set.price}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
