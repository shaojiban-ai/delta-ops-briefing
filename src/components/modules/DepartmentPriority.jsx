import { useState } from "react";
import Section from "../ui/Section";
import Tag from "../ui/Tag";
import Modal, { ModalBlock } from "../ui/Modal";
import RefNotice from "../ui/RefNotice";
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

function FacilityDetail({ f }) {
  const d = f.detail;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-[11px] text-accent">{f.level}</span>
        <span className="font-mono text-[10px] text-faint uppercase tracking-wider">优先级</span>
        <PriorityBars level={f.priority} />
        <span className="font-mono text-[11px] text-text">{f.priority}</span>
      </div>

      <p className="text-sm text-text leading-relaxed">{d.summary}</p>

      <ModalBlock label="升级阶梯">
        <div className="space-y-3">
          {d.tiers.map((t) => (
            <div key={t.lv} className="bg-card2 border border-line p-4">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <span className="font-display text-base uppercase tracking-wide text-text">{t.lv}</span>
                <span className="font-mono text-[11px] text-accent">耗时 {t.time}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[12px]">
                <div>
                  <div className="text-faint text-[10px] uppercase tracking-wider mb-1">花费</div>
                  <div className="text-text">{t.cost}</div>
                </div>
                <div>
                  <div className="text-faint text-[10px] uppercase tracking-wider mb-1">材料</div>
                  <div className="text-text">{t.mats}</div>
                </div>
                <div>
                  <div className="text-faint text-[10px] uppercase tracking-wider mb-1">解锁</div>
                  <div className="text-cool">{t.unlock}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ModalBlock>

      <div className="bg-accent/[0.06] border border-accent-dim px-4 py-3">
        <span className="font-mono text-[10px] text-accent uppercase tracking-wider mr-2">建议</span>
        <span className="text-[13px] text-text">{d.tip}</span>
      </div>
    </div>
  );
}

export default function DepartmentPriority() {
  const [open, setOpen] = useState(null);
  const active = departmentPriority.find((f) => f.name === open);

  return (
    <Section
      id="dept"
      index="// 04 — 特勤处 / SAFEHOUSE"
      title="特勤处升级优先级"
      action={<span className="font-mono text-[11px] text-dim tracking-[0.15em] uppercase">海外开荒期推荐</span>}
    >
      <RefNotice>
        升级优先级与花费/材料为社区经验<b className="text-cool">示例</b>，官方未公布可核实的结构化数据；具体数值以游戏内为准。
      </RefNotice>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {departmentPriority.map((f) => {
          const meta = priorityMeta[f.priority] || priorityMeta["中"];
          return (
            <button
              key={f.name}
              type="button"
              onClick={() => setOpen(f.name)}
              className="text-left bg-card border border-line hover:border-accent transition-colors p-5 flex flex-col group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="font-display text-xl font-semibold uppercase tracking-wide leading-none group-hover:text-accent transition-colors">{f.name}</h4>
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
              <span className="font-mono text-[10px] text-faint group-hover:text-accent transition-colors mt-3 self-end">
                升级阶梯 →
              </span>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setOpen(null)}
        index={active ? `// ${active.type} · 升级详情` : ""}
        title={active?.name || ""}
        action={
          active ? (
            <span className="hidden sm:inline">
              <Tag variant={priorityMeta[active.priority]?.variant}>{active.priority}优先</Tag>
            </span>
          ) : null
        }
      >
        {active ? <FacilityDetail f={active} /> : null}
      </Modal>
    </Section>
  );
}
