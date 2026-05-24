import { useEffect, useState } from "react";
import Section from "../ui/Section";
import Tag from "../ui/Tag";
import Modal, { ModalBlock } from "../ui/Modal";

const DATA_URL = `${import.meta.env.BASE_URL}data/news.json`;

const tagVariant = { 活动: "default", 赛季: "cool", 更新: "hot", 公告: "default", 资讯: "default" };

// 官方标题形如 "Announcement | Update - May 29 | Victory Unite Mode..."，
// 取最后一段做展示标题（最具体），完整官方标题保留在详情里。
function displayTitle(t) {
  const parts = String(t || "").split("|").map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || t || "";
}
const fmtDate = (d) => (d ? d.replace(/-/g, ".") : "");

function NewsDetail({ n }) {
  return (
    <div className="space-y-6">
      {n.image ? (
        <div className="relative border border-line overflow-hidden">
          <img src={n.image} alt="" className="w-full max-h-72 object-cover" loading="lazy" />
        </div>
      ) : null}
      <div className="flex items-center gap-3 flex-wrap">
        <Tag variant={tagVariant[n.tag] || "default"}>{n.tag}</Tag>
        {n.date ? <span className="font-mono text-[12px] text-accent">{fmtDate(n.date)}</span> : null}
      </div>
      <ModalBlock label="官方摘要">
        <p className="text-sm text-text leading-relaxed">{n.summary || "（官方页未提供摘要）"}</p>
        <p className="font-mono text-[10px] text-faint mt-3">// 摘要由官方资讯页 og:description 提取，可能为节选</p>
      </ModalBlock>
      <a
        href={n.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 bg-accent/[0.08] border border-accent text-accent font-mono text-xs uppercase tracking-wider px-4 py-2.5 hover:bg-accent hover:text-bg transition-colors"
      >
        阅读官方全文 ↗
      </a>
    </div>
  );
}

export default function HotEventsNews() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [active, setActive] = useState(0);
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

  const items = state.data?.items || [];
  const featured = items.slice(0, 3); // 走马灯：最新 3 条
  const count = featured.length;
  const openItem = items.find((n) => n.url === open);

  useEffect(() => {
    if (open || count < 2) return; // 弹窗打开或不足 2 条时不轮播
    const t = setInterval(() => setActive((i) => (i + 1) % count), 5500);
    return () => clearInterval(t);
  }, [count, open]);

  const updated = state.data?.updatedAt
    ? new Date(state.data.updatedAt).toLocaleString("zh-CN", { hour12: false })
    : "—";

  return (
    <Section
      id="news"
      index="// 06 — 官方资讯 / OFFICIAL FEED"
      title="官方活动与资讯"
      action={
        <div className="text-right font-mono text-[11px] text-dim space-y-1">
          <div>
            来源{" "}
            <a
              href={state.data?.source?.url || "https://www.playdeltaforce.com/en/news/"}
              target="_blank"
              rel="noreferrer"
              className="text-dim hover:text-accent border-b border-line-bright"
            >
              {state.data?.source?.name || "官方资讯"}
            </a>
          </div>
          <div className="text-faint">抓取于 {updated}</div>
        </div>
      }
    >
      {state.loading ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 border border-line bg-card h-[220px] animate-pulse" />
          <div className="lg:col-span-2 border border-line bg-card h-[220px] animate-pulse" />
        </div>
      ) : state.error || items.length === 0 ? (
        <div className="bg-card border border-accent-dim hud-corner p-8 text-center">
          <div className="font-mono text-xs tracking-[0.2em] uppercase text-accent mb-3">// NO FEED</div>
          <p className="text-sm text-dim">
            {state.error
              ? `资讯数据加载失败（${state.error}）。请运行 npm run crawl:news 生成 data/news.json。`
              : "暂无官方资讯，运行爬虫后显示。"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* 走马灯（真实官方配图作背景） */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden border border-line bg-card hud-corner">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {featured.map((e) => (
                  <button
                    key={e.url}
                    type="button"
                    onClick={() => setOpen(e.url)}
                    className="text-left w-full shrink-0 relative min-h-[240px] flex flex-col justify-end p-6 md:p-8 group"
                  >
                    {e.image ? (
                      <>
                        <img src={e.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                      </>
                    ) : null}
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <Tag variant={tagVariant[e.tag] || "default"}>{e.tag}</Tag>
                        <span className="font-mono text-[11px] text-faint tracking-[0.1em]">{fmtDate(e.date)}</span>
                      </div>
                      <h4 className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-wide leading-tight mb-2 group-hover:text-accent transition-colors">
                        {displayTitle(e.title)}
                      </h4>
                      <p className="text-sm text-dim max-w-xl line-clamp-2">{e.summary}</p>
                      <span className="font-mono text-[11px] text-accent mt-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                        阅读详情 →
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {count > 1 ? (
                <div className="absolute bottom-4 right-5 flex gap-2 z-10">
                  {featured.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`第 ${i + 1} 条`}
                      onClick={() => setActive(i)}
                      className={`h-1.5 transition-all ${i === active ? "w-6 bg-accent" : "w-3 bg-line-bright hover:bg-dim"}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* 资讯列表（全部条目） */}
          <div className="lg:col-span-2 border border-line bg-card divide-y divide-line">
            {items.map((n) => (
              <button
                key={n.url}
                type="button"
                onClick={() => setOpen(n.url)}
                className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-accent/[0.04] transition-colors group"
              >
                <span className="font-mono text-[10px] text-faint tracking-[0.1em] w-[68px] shrink-0">{fmtDate(n.date) || "—"}</span>
                <span className="font-mono text-[10px] text-accent uppercase tracking-wider w-9 shrink-0">{n.tag}</span>
                <span className="text-[13px] text-text flex-1 min-w-0 truncate group-hover:text-accent transition-colors">
                  {displayTitle(n.title)}
                </span>
                <span className="font-mono text-faint group-hover:text-accent transition-colors">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={!!openItem}
        onClose={() => setOpen(null)}
        index={openItem ? `// ${openItem.tag} · ${fmtDate(openItem.date)}` : ""}
        title={openItem ? displayTitle(openItem.title) : ""}
      >
        {openItem ? <NewsDetail n={openItem} /> : null}
      </Modal>
    </Section>
  );
}
