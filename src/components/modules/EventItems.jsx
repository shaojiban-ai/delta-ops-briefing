import Section, { SeeAll } from "../ui/Section";
import { eventItems } from "../../data/mock";

const rarityMeta = {
  legendary: { ring: "border-accent", glow: "shadow-[0_0_12px_rgba(245,166,35,0.25)]", text: "text-accent" },
  epic: { ring: "border-hot/50", glow: "", text: "text-hot" },
  rare: { ring: "border-cool/50", glow: "", text: "text-cool" },
  common: { ring: "border-line-bright", glow: "", text: "text-dim" },
};
const rarityLabel = { legendary: "传说", epic: "史诗", rare: "稀有", common: "普通" };

export default function EventItems() {
  return (
    <Section
      id="items"
      index="// 05 — 活动物品 / EVENT ITEMS"
      title="活动限定物资"
      action={<SeeAll>兑换商店 →</SeeAll>}
    >
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {eventItems.map((item) => {
          const r = rarityMeta[item.rarity] || rarityMeta.common;
          return (
            <div
              key={item.name}
              title={item.use}
              className={`group bg-card border ${r.ring} ${r.glow} p-3 flex flex-col items-center text-center cursor-default hover:bg-card2 transition-colors`}
            >
              <div className={`text-3xl md:text-4xl mb-2 ${r.text} leading-none`}>{item.icon}</div>
              <div className="text-[13px] text-text font-medium leading-tight">{item.name}</div>
              <div className={`font-mono text-[9px] uppercase tracking-wider mt-1 ${r.text}`}>
                {rarityLabel[item.rarity]}
              </div>
              <div className="font-mono text-[10px] text-faint mt-1.5 leading-tight opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                {item.use}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
