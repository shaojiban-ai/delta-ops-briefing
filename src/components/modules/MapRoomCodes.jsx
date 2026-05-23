import { useEffect, useState } from "react";
import Section from "../ui/Section";
import Tag from "../ui/Tag";

const DATA_URL = `${import.meta.env.BASE_URL}data/daily-codes.json`;

const riskDot = { low: "bg-safe", mid: "bg-accent", high: "bg-hot" };

function PasswordKeys({ value }) {
  const digits = String(value || "----").split("");
  return (
    <div className="flex gap-1">
      {digits.map((d, i) => (
        <span
          key={i}
          className="w-6 h-7 grid place-items-center font-mono text-sm font-bold text-accent bg-accent/[0.07] border border-accent-dim"
        >
          {d}
        </span>
      ))}
    </div>
  );
}

// 解析 "M月D日" → 与今日(北京)相差天数；解析失败返回 null
function parseDataDate(label) {
  const m = String(label || "").match(/(\d{1,2})\D+(\d{1,2})/);
  if (!m) return null;
  const now = new Date(Date.now() + (8 * 60 + new Date().getTimezoneOffset()) * 60000);
  const year = now.getFullYear();
  const codeDate = new Date(year, Number(m[1]) - 1, Number(m[2]));
  const today = new Date(year, now.getMonth(), now.getDate());
  return Math.round((today - codeDate) / 86400000);
}

function Freshness({ data }) {
  const diff = parseDataDate(data.dataDate);
  let label, cls;
  if (data.status === "ok" && (diff === 0 || diff === null)) {
    label = "今日最新";
    cls = "text-safe border-safe";
  } else if (diff === 1) {
    label = "1 天前 · 可能已过期";
    cls = "text-accent border-accent-dim";
  } else if (diff != null && diff > 1) {
    label = `${diff} 天前 · 已过期`;
    cls = "text-hot border-hot/50";
  } else {
    label = "今日待更新";
    cls = "text-accent border-accent-dim";
  }
  const local = data.updatedAt
    ? new Date(data.updatedAt).toLocaleString("zh-CN", { hour12: false })
    : "—";
  return (
    <div className="text-right font-mono text-[11px] text-dim space-y-1">
      <div>
        数据日期 <span className="text-text">{data.dataDate || "—"}</span>
        <span className={`ml-2 px-2 py-0.5 border uppercase tracking-wider ${cls}`}>{label}</span>
      </div>
      <div className="text-faint">
        来源{" "}
        <a
          href={data.source?.homepage || data.source?.url || "#"}
          target="_blank"
          rel="noreferrer"
          className="text-dim hover:text-accent border-b border-line-bright"
        >
          {data.source?.name || "—"}
        </a>{" "}
        · 抓取于 {local}
      </div>
    </div>
  );
}

function Notice({ tone = "pending", title, desc, source }) {
  const ring = tone === "error" ? "border-hot/40" : "border-accent-dim";
  const text = tone === "error" ? "text-hot" : "text-accent";
  return (
    <div className={`bg-card border ${ring} hud-corner p-6 md:p-8 text-center`}>
      <div className={`font-mono text-xs tracking-[0.2em] uppercase ${text} mb-3`}>
        {tone === "error" ? "// FETCH ERROR" : "// AWAITING UPDATE"}
      </div>
      <h4 className="font-display text-xl md:text-2xl uppercase tracking-wide text-text mb-2">{title}</h4>
      <p className="text-sm text-dim max-w-md mx-auto">{desc}</p>
      {source ? (
        <p className="font-mono text-[11px] text-faint mt-4">
          数据由{" "}
          <a
            href={source.homepage || source.url}
            target="_blank"
            rel="noreferrer"
            className="text-dim hover:text-accent border-b border-line-bright"
          >
            {source.name}
          </a>{" "}
          每日同步 · 仅供参考
        </p>
      ) : null}
    </div>
  );
}

function MapCard({ m }) {
  return (
    <div className="bg-card border border-line hover:border-accent transition-colors flex flex-col">
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="min-w-0">
          <h4 className="font-display text-lg font-semibold uppercase tracking-wide leading-none truncate">
            {m.map}
          </h4>
          {m.en ? <span className="font-mono text-[10px] text-faint tracking-[0.12em]">{m.en}</span> : null}
        </div>
        {m.code ? <Tag variant="ghost">{m.code}</Tag> : null}
      </div>
      <ul className="divide-y divide-line">
        {m.rooms.map((room, i) => (
          <li key={i} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskDot[room.risk] || "bg-accent"}`} />
                  <span className="text-sm text-text font-medium truncate">{room.room}</span>
                </div>
                {room.location ? (
                  <div className="font-mono text-[11px] text-dim mt-1 pl-3">{room.location}</div>
                ) : null}
              </div>
              {room.images?.length ? (
                <a
                  href={room.images[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[9px] text-faint hover:text-accent uppercase tracking-wider shrink-0 pt-0.5 border-b border-line-bright"
                >
                  位置图
                </a>
              ) : null}
            </div>
            <PasswordKeys value={room.password} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MapRoomCodes() {
  const [state, setState] = useState({ loading: true, data: null, error: null });

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

  const { loading, data, error } = state;
  const hasMaps = data?.maps?.length > 0;
  const stale = data && data.status !== "ok";

  return (
    <Section
      id="maps"
      index="// 01 — 每日密码 / DAILY CODES"
      title="地图房间密码"
      action={data ? <Freshness data={data} /> : null}
    >
      {loading ? (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-line h-56 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <Notice
          tone="error"
          title="密码数据加载失败"
          desc={`无法读取每日密码数据（${error}）。请稍后重试，或检查爬虫是否已生成 data/daily-codes.json。`}
        />
      ) : (
        <>
          {stale && hasMaps ? (
            <div className="mb-5 bg-hot/[0.06] border border-hot/30 px-4 py-3 font-mono text-[12px] text-hot flex items-center gap-2">
              <span>⚠</span>
              <span>
                以下为上一批已知密码，<b>{data.dataDate}</b> 之后可能已刷新；{data.note || "今日尚未更新"}。
              </span>
            </div>
          ) : null}

          {hasMaps ? (
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
              {data.maps.map((m, i) => (
                <MapCard key={i} m={m} />
              ))}
            </div>
          ) : (
            <Notice
              tone={data.status === "error" ? "error" : "pending"}
              title="今日密码尚未公布"
              desc={data.note || "每日密码大约在 9-10 点（北京时间）更新，稍后回来查看，或等待自动抓取。"}
              source={data.source}
            />
          )}
        </>
      )}
    </Section>
  );
}
