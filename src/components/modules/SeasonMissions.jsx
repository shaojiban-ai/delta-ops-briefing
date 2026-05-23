import Section from "../ui/Section";
import Tag from "../ui/Tag";
import { seasonInfo, seasonMissions } from "../../data/mock";

const statusMeta = {
  done: { label: "已完成", cls: "text-safe border-safe", bar: "bg-safe" },
  active: { label: "进行中", cls: "text-accent border-accent", bar: "bg-accent" },
  locked: { label: "未解锁", cls: "text-faint border-line-bright", bar: "bg-line-bright" },
};

export default function SeasonMissions() {
  const tierPct = Math.round((seasonInfo.currentTier / seasonInfo.totalTier) * 100);

  return (
    <Section
      id="missions"
      index="// 02 — 赛季任务 / SEASON PASS"
      title="当前赛季任务"
      action={
        <div className="text-right">
          <div className="font-display text-lg text-accent uppercase tracking-wide">{seasonInfo.season}</div>
          <div className="font-mono text-[11px] text-dim">{seasonInfo.cycle}</div>
        </div>
      }
    >
      {/* 赛季总进度 */}
      <div className="bg-card border border-line p-4 md:p-5 mb-6 hud-corner">
        <div className="flex items-center justify-between mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
          <span>赛季等级进度</span>
          <span className="text-accent">
            TIER {seasonInfo.currentTier} / {seasonInfo.totalTier}
          </span>
        </div>
        <div className="h-2 bg-line overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cool to-accent" style={{ width: `${tierPct}%` }} />
        </div>
      </div>

      {/* 阶段任务列表 */}
      <div className="flex flex-col gap-3">
        {seasonMissions.map((m) => {
          const meta = statusMeta[m.status];
          return (
            <div
              key={m.stage}
              className={`bg-card border border-line ${m.status === "active" ? "border-l-2 border-l-accent" : ""} p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4`}
            >
              <div className="md:w-44 shrink-0">
                <div className="font-mono text-[11px] text-faint tracking-[0.15em] mb-1">{m.stage}</div>
                <div className="font-display text-lg font-semibold uppercase tracking-wide leading-none">
                  {m.title}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-text mb-1">{m.objective}</p>
                <p className="font-mono text-[11px] text-dim">
                  奖励 · <span className="text-accent">{m.reward}</span>
                </p>
                <div className="h-1.5 bg-line overflow-hidden mt-3">
                  <div className={`h-full ${meta.bar}`} style={{ width: `${m.progress}%` }} />
                </div>
              </div>

              <div className="md:w-24 shrink-0 flex md:flex-col items-center md:items-end justify-between gap-2">
                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-1 border ${meta.cls}`}>
                  {meta.label}
                </span>
                <span className="font-mono text-sm text-text">{m.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
