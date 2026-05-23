import { useEffect, useState } from "react";
import Section, { SeeAll } from "../ui/Section";
import Tag from "../ui/Tag";
import { hotEvents, newsFeed } from "../../data/mock";

const tagVariant = { 活动: "default", 公告: "cool", 电竞: "hot" };

export default function HotEventsNews() {
  const [active, setActive] = useState(0);
  const count = hotEvents.length;

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <Section
      id="news"
      index="// 06 — 热门活动与资讯 / HOT FEED"
      title="热门活动与资讯"
      action={<SeeAll>历史档案 →</SeeAll>}
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* 走马灯 */}
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden border border-line bg-card hud-corner">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {hotEvents.map((e) => (
                <article key={e.title} className="w-full shrink-0 p-6 md:p-8 min-h-[200px] flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-3">
                    <Tag variant={tagVariant[e.tag] || "default"}>{e.tag}</Tag>
                    <span className="font-mono text-[11px] text-faint tracking-[0.1em]">{e.date}</span>
                  </div>
                  <h4 className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-wide leading-tight mb-2">
                    {e.title}
                  </h4>
                  <p className="text-sm text-dim max-w-xl">{e.summary}</p>
                </article>
              ))}
            </div>

            {/* 指示点 */}
            <div className="absolute bottom-4 right-5 flex gap-2">
              {hotEvents.map((_, i) => (
                <button
                  key={i}
                  aria-label={`第 ${i + 1} 条`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 transition-all ${i === active ? "w-6 bg-accent" : "w-3 bg-line-bright hover:bg-dim"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 资讯列表 */}
        <div className="lg:col-span-2 border border-line bg-card divide-y divide-line">
          {newsFeed.map((n) => (
            <a
              key={n.title}
              href="#"
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent/[0.04] transition-colors group"
            >
              <span className="font-mono text-[10px] text-faint tracking-[0.1em] w-20 shrink-0">{n.date}</span>
              <span className="font-mono text-[10px] text-accent uppercase tracking-wider w-12 shrink-0">{n.cat}</span>
              <span className="text-[13px] text-text flex-1 min-w-0 truncate group-hover:text-accent transition-colors">
                {n.title}
              </span>
              <span className="font-mono text-faint group-hover:text-accent transition-colors">→</span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
