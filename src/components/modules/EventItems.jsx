import { useState } from "react";
import Section from "../ui/Section";
import Modal, { ModalBlock } from "../ui/Modal";
import { eventItems } from "../../data/mock";

const rarityMeta = {
  legendary: { ring: "border-accent", glow: "shadow-[0_0_12px_rgba(245,166,35,0.25)]", text: "text-accent" },
  epic: { ring: "border-hot/50", glow: "", text: "text-hot" },
  rare: { ring: "border-cool/50", glow: "", text: "text-cool" },
  common: { ring: "border-line-bright", glow: "", text: "text-dim" },
};
const rarityLabel = { legendary: "传说", epic: "史诗", rare: "稀有", common: "普通" };
const typeIcon = { 武器: "▤", 枪械外观: "◈", 外观: "✦", 代币: "◉", 外观系列: "❖" };
const statusMeta = {
  live: { label: "进行中", cls: "text-safe border-safe" },
  upcoming: { label: "即将", cls: "text-accent border-accent" },
  ended: { label: "已结束", cls: "text-faint border-line-bright" },
};

function ItemDetail({ item }) {
  const r = rarityMeta[item.rarity] || rarityMeta.common;
  const d = item.detail;
  const st = statusMeta[item.status] || statusMeta.live;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className={`text-4xl ${r.text} leading-none w-16 h-16 grid place-items-center border ${r.ring} ${r.glow} bg-card2 shrink-0`}>
          {typeIcon[item.type] || "◇"}
        </div>
        <div>
          <div className={`font-mono text-[11px] uppercase tracking-wider ${r.text}`}>
            {rarityLabel[item.rarity]} · {item.type}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono text-sm text-text">{d.window}</span>
            <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${st.cls}`}>{st.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
        <div className="bg-card px-3 py-2.5">
          <div className="font-mono text-[10px] text-faint uppercase tracking-wider">所属活动</div>
          <div className="text-[13px] text-text mt-0.5">{d.event}</div>
        </div>
        <div className="bg-card px-3 py-2.5">
          <div className="font-mono text-[10px] text-faint uppercase tracking-wider">活动时间</div>
          <div className="text-[13px] text-text mt-0.5">{d.window}</div>
        </div>
      </div>

      <ModalBlock label="获取方式">
        <p className="text-sm text-text leading-relaxed border-l-2 border-accent-dim pl-3">{d.howto}</p>
      </ModalBlock>

      <a
        href={d.source}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-accent/[0.08] border border-accent text-accent font-mono text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-accent hover:text-bg transition-colors"
      >
        官方公告原文 ↗
      </a>
    </div>
  );
}

export default function EventItems() {
  const [open, setOpen] = useState(null);
  const active = eventItems.find((i) => i.name === open);

  return (
    <Section
      id="items"
      index="// 05 — 活动物品 / EVENT ITEMS"
      title="赛季活动奖励"
      action={
        <span className="font-mono text-[11px] text-dim tracking-[0.1em] uppercase">
          来源 · 官方资讯
        </span>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {eventItems.map((item) => {
          const r = rarityMeta[item.rarity] || rarityMeta.common;
          const st = statusMeta[item.status] || statusMeta.live;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setOpen(item.name)}
              className={`group bg-card border ${r.ring} ${r.glow} p-3 flex flex-col items-center text-center hover:bg-card2 transition-colors`}
            >
              <div className={`text-3xl md:text-4xl mb-2 ${r.text} leading-none`}>{typeIcon[item.type] || "◇"}</div>
              <div className="text-[13px] text-text font-medium leading-tight">{item.name}</div>
              <div className={`font-mono text-[9px] uppercase tracking-wider mt-1 ${r.text}`}>
                {item.type}
              </div>
              <div className={`font-mono text-[9px] uppercase tracking-wider mt-1.5 px-1.5 py-0.5 border ${st.cls}`}>
                {st.label}
              </div>
            </button>
          );
        })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setOpen(null)}
        index="// 活动奖励 / EVENT REWARD"
        title={active?.name || ""}
      >
        {active ? <ItemDetail item={active} /> : null}
      </Modal>
    </Section>
  );
}
