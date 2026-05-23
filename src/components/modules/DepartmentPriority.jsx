import Section from "../ui/Section";
import Tag from "../ui/Tag";
import { departmentPriority } from "../../data/mock";

const priorityMeta = {
  高: { variant: "hot", bars: 3 },
  中: { variant: "default", bars: 2 },
  低: { variant: "cool", bars: 1 },
};

function PriorityBars({ level }) {
  const meta = priorityMeta[level] || priorityMeta["中"];
  const color = level === "高" ? "bg-hot" : level === "中" ? "bg-accent" : "bg-safe";
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`w-4 h-1 ${i < meta.bars ? color : "bg-line-bright"}`} />
      ))}
    </span>
  );
}

export default function DepartmentPriority() {
  return (
    <Section
      id="dept"
      index="// 04 — 特勤处 / SAFEHOUSE"
      title="特勤处升级优先级"
      action={<span className="font-mono text-[11px] text-dim tracking-[0.15em] uppercase">海外开荒期推荐</span>}
    >
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {departmentPriority.map((f) => {
          const meta = priorityMeta[f.priority] || priorityMeta["中"];
          return (
            <div key={f.name} className="bg-card border border-line hover:border-accent transition-colors p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-display text-xl font-semibold uppercase tracking-wide leading-none">{f.name}</h4>
                  <div className="font-mono text-[11px] text-accent mt-1.5">{f.level}</div>
                </div>
                <Tag variant={meta.variant}>{f.type}</Tag>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] text-faint uppercase tracking-wider">优先级</span>
                <PriorityBars level={f.priority} />
                <span className="font-mono text-[11px] text-text">{f.priority}</span>
              </div>

              <p className="text-sm text-text mb-2">{f.desc}</p>
              <p className="text-[13px] text-dim leading-relaxed border-t border-dashed border-line pt-2 mt-auto">
                <span className="text-accent font-mono text-[10px] uppercase tracking-wider mr-1">理由</span>
                {f.why}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
