import { useState } from "react";
import Section from "../ui/Section";
import Modal, { ModalBlock } from "../ui/Modal";
import RefNotice from "../ui/RefNotice";
import { loadoutSetups } from "../../data/mock";

const accentMap = {
  accent: { ring: "hover:border-accent", chip: "text-accent border-accent", bar: "bg-accent", text: "text-accent" },
  cool: { ring: "hover:border-cool", chip: "text-cool border-cool", bar: "bg-cool", text: "text-cool" },
};

function LoadoutDetail({ set }) {
  const c = accentMap[set.accent] || accentMap.accent;
  const d = set.detail;
  return (
    <div className="space-y-7">
      {/* 定位概览 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
        {[
          ["定位", d.role],
          ["TTK", d.ttk],
          ["单套成本", `¤ ${set.price}`],
          ["弹药", "见下方"],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-3 py-2.5">
            <div className="font-mono text-[10px] text-faint uppercase tracking-wider">{k}</div>
            <div className={`text-sm mt-0.5 ${k === "单套成本" ? c.text : "text-text"}`}>{v}</div>
          </div>
        ))}
      </div>

      <ModalBlock label="打法思路">
        <p className="text-sm text-text leading-relaxed">{d.playstyle}</p>
      </ModalBlock>

      <ModalBlock label="弹药建议">
        <p className="text-sm text-dim leading-relaxed border-l-2 border-accent-dim pl-3">{d.ammo}</p>
      </ModalBlock>

      <div className="grid sm:grid-cols-2 gap-5">
        <ModalBlock label="优势">
          <ul className="space-y-1.5">
            {d.pros.map((p) => (
              <li key={p} className="text-[13px] text-text flex gap-2">
                <span className="text-safe font-mono">+</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </ModalBlock>
        <ModalBlock label="短板">
          <ul className="space-y-1.5">
            {d.cons.map((p) => (
              <li key={p} className="text-[13px] text-dim flex gap-2">
                <span className="text-hot font-mono">−</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </ModalBlock>
      </div>

      <ModalBlock label="替代方案">
        <div className="space-y-2">
          {d.alts.map((a) => (
            <div key={a.label} className="bg-card2 border border-line px-4 py-2.5 flex items-baseline gap-3 flex-wrap">
              <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${c.chip} shrink-0`}>
                {a.label}
              </span>
              <span className="text-sm text-text">{a.value}</span>
              <span className="font-mono text-[11px] text-faint">— {a.note}</span>
            </div>
          ))}
        </div>
      </ModalBlock>

      <ModalBlock label="实战提示">
        <ul className="space-y-1.5">
          {d.tips.map((t) => (
            <li key={t} className="text-[13px] text-dim flex gap-2">
              <span className="text-accent font-mono shrink-0">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </ModalBlock>
    </div>
  );
}

export default function LoadoutSetups() {
  const [open, setOpen] = useState(null);
  const active = loadoutSetups.find((s) => s.id === open);

  return (
    <Section id="loadouts" index="// 03 — 卡战备 / LOADOUTS" title="战备配装推荐">
      <RefNotice>
        配装为社区经验整理的<b className="text-cool">示例方案</b>，官方不发布此类数据；价格、改装与版本强度会随平衡补丁变动，请以游戏内实际为准。
      </RefNotice>
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        {loadoutSetups.map((set) => {
          const c = accentMap[set.accent] || accentMap.accent;
          return (
            <button
              key={set.id}
              type="button"
              onClick={() => setOpen(set.id)}
              className={`text-left bg-card border border-line ${c.ring} transition-colors hud-corner flex flex-col group`}
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
                <span className="group-hover:text-accent transition-colors">查看完整打法 →</span>
                <span className={`${c.text} text-base`}>¤ {set.price}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setOpen(null)}
        index={active ? `// ${active.en} · 完整配装` : ""}
        title={active?.tier || ""}
        action={
          active ? (
            <span className={`hidden sm:inline font-mono text-sm ${accentMap[active.accent]?.text}`}>
              ¤ {active.price}
            </span>
          ) : null
        }
      >
        {active ? <LoadoutDetail set={active} /> : null}
      </Modal>
    </Section>
  );
}
