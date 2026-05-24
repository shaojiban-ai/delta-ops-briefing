import { useState } from "react";
import Section from "../ui/Section";
import Tag from "../ui/Tag";
import Modal, { ModalBlock } from "../ui/Modal";
import { currentSeason, seasonEvents } from "../../data/mock";

const statusMeta = {
  live: { label: "进行中", cls: "text-safe border-safe", dot: "bg-safe" },
  upcoming: { label: "即将开启", cls: "text-accent border-accent", dot: "bg-accent" },
  ended: { label: "已结束", cls: "text-faint border-line-bright", dot: "bg-line-bright" },
};
const tagVariant = { 通行证: "default", 新武器: "hot", 新模式: "cool", 抽奖: "default" };

function EventDetail({ e }) {
  const meta = statusMeta[e.status] || statusMeta.live;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Tag variant={tagVariant[e.tag] || "default"}>{e.tag}</Tag>
        <span className="font-mono text-[12px] text-accent">{e.window}</span>
        <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${meta.cls}`}>{meta.label}</span>
      </div>
      <p className="text-sm text-text leading-relaxed">{e.desc}</p>
      {e.rewards?.length ? (
        <ModalBlock label="奖励 / 内容">
          <ul className="space-y-1.5">
            {e.rewards.map((r) => (
              <li key={r} className="text-[13px] text-text flex gap-2">
                <span className="text-accent font-mono shrink-0">◆</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </ModalBlock>
      ) : null}
      <a
        href={e.source}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-accent/[0.08] border border-accent text-accent font-mono text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-accent hover:text-bg transition-colors"
      >
        官方公告原文 ↗
      </a>
    </div>
  );
}

export default function SeasonMissions() {
  const [open, setOpen] = useState(null);
  const active = seasonEvents.find((e) => e.name === open);

  return (
    <Section
      id="missions"
      index="// 02 — 当前赛季 / SEASON"
      title="当前赛季与活动"
      action={
        <div className="text-right">
          <div className="font-display text-lg text-accent uppercase tracking-wide">{currentSeason.name}</div>
          <div className="font-mono text-[11px] text-dim">{currentSeason.phase}</div>
        </div>
      }
    >
      {/* 赛季概览（真实，附官方源） */}
      <div className="bg-card border border-line p-4 md:p-5 mb-6 hud-corner flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim mb-1">当前赛季</div>
          <div className="font-display text-2xl uppercase tracking-wide text-text leading-none">
            {currentSeason.name} <span className="text-accent text-base">// {currentSeason.phase}</span>
          </div>
          <p className="text-[12px] text-dim mt-2 max-w-xl">{currentSeason.note}</p>
        </div>
        <a
          href={currentSeason.source}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] tracking-[0.1em] uppercase text-dim border-b border-line-bright hover:text-accent hover:border-accent pb-0.5 shrink-0"
        >
          官方公告 ↗
        </a>
      </div>

      {/* 进行中 / 即将 / 已结束 活动 */}
      <div className="flex flex-col gap-3">
        {seasonEvents.map((e) => {
          const meta = statusMeta[e.status] || statusMeta.live;
          return (
            <button
              key={e.name}
              type="button"
              onClick={() => setOpen(e.name)}
              className={`text-left w-full bg-card border border-line hover:border-accent ${e.status === "live" ? "border-l-2 border-l-safe" : ""} p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4 transition-colors group`}
            >
              <div className="md:w-56 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                  <span className="font-mono text-[11px] text-faint tracking-[0.12em]">{e.window}</span>
                </div>
                <div className="font-display text-lg font-semibold uppercase tracking-wide leading-tight group-hover:text-accent transition-colors">
                  {e.name}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-text">{e.desc}</p>
                {e.rewards?.length ? (
                  <p className="font-mono text-[11px] text-dim mt-1.5 truncate">
                    奖励 · <span className="text-accent">{e.rewards.join(" · ")}</span>
                  </p>
                ) : null}
              </div>

              <div className="md:w-28 shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2">
                <Tag variant={tagVariant[e.tag] || "default"}>{e.tag}</Tag>
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 border ${meta.cls}`}>
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setOpen(null)}
        index={active ? `// ${currentSeason.name} · 活动` : ""}
        title={active?.name || ""}
      >
        {active ? <EventDetail e={active} /> : null}
      </Modal>
    </Section>
  );
}
