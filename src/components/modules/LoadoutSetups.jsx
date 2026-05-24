import { useEffect, useState } from "react";
import Section from "../ui/Section";
import Modal, { ModalBlock } from "../ui/Modal";
import RefNotice from "../ui/RefNotice";

const DATA_URL = `${import.meta.env.BASE_URL}data/loadouts.json`;

const accentMap = {
  accent: { ring: "hover:border-accent", chip: "text-accent border-accent", text: "text-accent" },
  cool: { ring: "hover:border-cool", chip: "text-cool border-cool", text: "text-cool" },
  hot: { ring: "hover:border-hot", chip: "text-hot border-hot", text: "text-hot" },
};
const money = (n) => "¤ " + Number(n || 0).toLocaleString();

function LoadoutDetail({ set }) {
  const c = accentMap[set.accent] || accentMap.accent;
  const d = set.detail || {};
  return (
    <div className="space-y-7">
      {/* 概览 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
        {[
          ["定位", set.role],
          ["TTK", d.ttk],
          ["参考总价", money(set.total)],
          ["弹药", "见下"],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-3 py-2.5">
            <div className="font-mono text-[10px] text-faint uppercase tracking-wider">{k}</div>
            <div className={`text-sm mt-0.5 ${k === "参考总价" ? c.text : "text-text"}`}>{v}</div>
          </div>
        ))}
      </div>

      {/* 逐项价格明细 */}
      <ModalBlock label="配装明细 · 参考价">
        <div className="border border-line divide-y divide-line">
          {set.gear.map((g, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
              <span className="font-mono text-[10px] text-faint uppercase tracking-wider w-12 shrink-0">{g.slot}</span>
              <span className="flex-1 min-w-0">
                <span className="text-text">{g.name}</span>
                {g.qty > 1 ? <span className="font-mono text-[11px] text-accent"> ×{g.qty}</span> : null}
                {g.note ? <span className="block font-mono text-[10px] text-dim">{g.note}</span> : null}
              </span>
              <span className="font-mono text-[12px] text-dim shrink-0">
                {g.unit == null ? "—" : money(g.priced)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2.5 bg-card2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-dim">参考总价</span>
            <span className={`font-mono text-base ${c.text}`}>{money(set.total)}</span>
          </div>
        </div>
      </ModalBlock>

      {d.playstyle ? (
        <ModalBlock label="打法思路">
          <p className="text-sm text-text leading-relaxed">{d.playstyle}</p>
        </ModalBlock>
      ) : null}

      {d.ammo ? (
        <ModalBlock label="弹药建议">
          <p className="text-sm text-dim leading-relaxed border-l-2 border-accent-dim pl-3">{d.ammo}</p>
        </ModalBlock>
      ) : null}

      {(d.pros || d.cons) && (
        <div className="grid sm:grid-cols-2 gap-5">
          {d.pros ? (
            <ModalBlock label="优势">
              <ul className="space-y-1.5">
                {d.pros.map((p) => (
                  <li key={p} className="text-[13px] text-text flex gap-2"><span className="text-safe font-mono">+</span><span>{p}</span></li>
                ))}
              </ul>
            </ModalBlock>
          ) : null}
          {d.cons ? (
            <ModalBlock label="短板">
              <ul className="space-y-1.5">
                {d.cons.map((p) => (
                  <li key={p} className="text-[13px] text-dim flex gap-2"><span className="text-hot font-mono">−</span><span>{p}</span></li>
                ))}
              </ul>
            </ModalBlock>
          ) : null}
        </div>
      )}

      {d.alts?.length ? (
        <ModalBlock label="替代方案">
          <div className="space-y-2">
            {d.alts.map((a) => (
              <div key={a.label} className="bg-card2 border border-line px-4 py-2.5 flex items-baseline gap-3 flex-wrap">
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${c.chip} shrink-0`}>{a.label}</span>
                <span className="text-sm text-text">{a.value}</span>
                <span className="font-mono text-[11px] text-faint">— {a.note}</span>
              </div>
            ))}
          </div>
        </ModalBlock>
      ) : null}

      {d.tips?.length ? (
        <ModalBlock label="实战提示">
          <ul className="space-y-1.5">
            {d.tips.map((t) => (
              <li key={t} className="text-[13px] text-dim flex gap-2"><span className="text-accent font-mono shrink-0">▸</span><span>{t}</span></li>
            ))}
          </ul>
        </ModalBlock>
      ) : null}
    </div>
  );
}

export default function LoadoutSetups() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(DATA_URL, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => alive && setState({ loading: false, data, error: null }))
      .catch((e) => alive && setState({ loading: false, data: null, error: e.message }));
    return () => {
      alive = false;
    };
  }, []);

  const loadouts = state.data?.loadouts || [];
  const active = loadouts.find((s) => s.id === open);
  const pricesUpdated = state.data?.pricesUpdated || "—";

  return (
    <Section
      id="loadouts"
      index="// 03 — 卡战备 / LOADOUTS"
      title="战备配装推荐"
      action={
        <div className="text-right font-mono text-[11px] text-dim">
          <div>参考价 · 更新于 <span className="text-accent">{pricesUpdated}</span></div>
          <div className="text-faint">单位：{state.data?.currency || "哈弗币"}</div>
        </div>
      }
    >
      <RefNotice>
        配装为社区经验整理的<b className="text-cool">示例方案</b>，价格为<b className="text-cool">参考价/估算</b>（非官方实时）；每周校准、随版本平衡变动，请以游戏内实际为准。
      </RefNotice>

      {state.loading ? (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-line h-64 animate-pulse" />
          ))}
        </div>
      ) : state.error || loadouts.length === 0 ? (
        <div className="bg-card border border-accent-dim hud-corner p-8 text-center">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-3">// NO DATA</div>
          <p className="text-sm text-dim">
            {state.error
              ? `配装数据加载失败（${state.error}）。请运行 npm run build:loadouts 生成 data/loadouts.json。`
              : "暂无配装数据。"}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
          {loadouts.map((set) => {
            const c = accentMap[set.accent] || accentMap.accent;
            return (
              <button
                key={set.id}
                type="button"
                onClick={() => setOpen(set.id)}
                className={`text-left bg-card border ${set.weeklyPick ? "border-accent" : "border-line"} ${c.ring} transition-colors hud-corner flex flex-col group relative`}
              >
                {set.weeklyPick ? (
                  <span className="absolute -top-px right-3 -translate-y-1/2 bg-accent text-bg font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                    ★ 本周推荐
                  </span>
                ) : null}
                <div className="p-5 border-b border-line flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-display text-2xl font-bold uppercase tracking-wide leading-none">{set.tier}</h4>
                    <div className="font-mono text-[11px] text-dim tracking-[0.2em] mt-1.5">{set.en} · {set.role}</div>
                    <p className="text-sm text-dim mt-3 max-w-sm">{set.summary}</p>
                  </div>
                  <span className={`font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border ${c.chip} shrink-0`}>
                    {set.en}
                  </span>
                </div>

                <ul className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 flex-1">
                  {set.gear.filter((g) => g.slot !== "药品" && g.slot !== "弹药").map((g, i) => (
                    <li key={i} className="flex items-baseline gap-3 border-b border-dashed border-line pb-2">
                      <span className="font-mono text-[10px] text-faint uppercase tracking-wider w-12 shrink-0">{g.slot}</span>
                      <span className="text-sm text-text font-medium min-w-0">{g.name}</span>
                    </li>
                  ))}
                </ul>

                <div className="px-5 py-4 border-t border-line flex items-center justify-between font-mono text-xs text-dim">
                  <span className="group-hover:text-accent transition-colors">查看明细与打法 →</span>
                  <span className={`${c.text} text-base`}>{money(set.total)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Modal
        open={!!active}
        onClose={() => setOpen(null)}
        index={active ? `// ${active.en} · 完整配装` : ""}
        title={active?.tier || ""}
        action={
          active ? (
            <span className={`hidden sm:inline font-mono text-sm ${accentMap[active.accent]?.text}`}>{money(active.total)}</span>
          ) : null
        }
      >
        {active ? <LoadoutDetail set={active} /> : null}
      </Modal>
    </Section>
  );
}
