#!/usr/bin/env node
// ============================================================
//  官方资讯爬虫 · Official News Crawler
//  源：playdeltaforce.com 官方资讯详情页（公开，无需登录）
//
//  原理：官方站是 SPA，正文由 JS 异步渲染抓不到，但每个详情页的
//        <meta og:title / og:description / og:image> 由服务端写死，
//        是真实、可验证的官方数据。本脚本逐页提取这些 meta。
//
//  用法：
//    node scripts/crawl-news.mjs           抓全部种子 URL 并写 JSON
//    node scripts/crawl-news.mjs --dry      只打印，不写文件
//    node scripts/crawl-news.mjs --raw      额外打印每页提取到的字段
//
//  维护：官方资讯列表页同样是 JS 渲染、无法可靠枚举，故采用「种子 URL
//        列表」——新资讯出来后把官方链接追加到 NEWS_SEEDS 即可（或由
//        用户/搜索补充）。绝不编造，抓不到的字段留空。
// ============================================================

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_FILE = resolve(ROOT, "public/data/news.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// 种子：官方资讯详情页 URL（公开可访问）。tag 仅用于前端分类着色。
const NEWS_SEEDS = [
  { url: "https://www.playdeltaforce.com/en/detail/news-announcement-update-may-29-victory-unite-mode-and-new-events.html", tag: "更新" },
  { url: "https://www.playdeltaforce.com/en/detail/news-announcement-update-may-15-eclipse-vigil-mid-season-update-overview.html", tag: "赛季" },
  { url: "https://www.playdeltaforce.com/en/detail/news-update-endofseason-armament-voucher-giveaway-dark-sentinel-series-appearances-launch-on-mobile-console.html", tag: "活动" },
  { url: "https://www.playdeltaforce.com/en/detail/news-midseason-update-balance-adjustments-free-epic-appearance-warfare-4v4-showdown-iridescent-plume-appearance-lucky-draw-and-more.html", tag: "更新" },
  { url: "https://www.playdeltaforce.com/en/detail/news-version-update-new-season-morphosis-events-rewards-store-updates-overview.html", tag: "赛季" },
];

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);

// 解码 HTML 实体 + 规整空白（og:description 里 &nbsp; / &quot; / &amp; 很多）
function clean(s) {
  return String(s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/â/g, "·") // 官方源里常见的乱码符（â→项目符），统一成中点
    .replace(/\s+/g, " ")
    .trim();
}

// meta 标签 content/property 顺序不固定，分两步取，顺序无关。
// 属性用双引号包裹，故 content 只按双引号截断（描述里含 We're 这类直撇号，
// 不能把 ' 当结束符，否则会被截成 "Dear Operators, We"）。
function metaContent(html, key) {
  const re = new RegExp(`<meta[^>]*(?:property|name)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0] || "";
  const dq = tag.match(/content="([^"]*)"/i)?.[1];
  const sq = tag.match(/content='([^']*)'/i)?.[1];
  return clean(dq ?? sq ?? "");
}

// 从标题/摘要里解析日期 → ISO(YYYY-MM-DD)。解析不到返回 ""。
const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};
function parseDate(title, desc) {
  const text = `${title} ${desc}`;
  // 优先 "May 15" / "February 3"
  const m1 = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\b/i);
  // 退而求其次 "5/15" / "on 5/29"
  const m2 = text.match(/\b(\d{1,2})\/(\d{1,2})\b/);
  const year = new Date().getFullYear();
  let mo, day;
  if (m1) {
    mo = MONTHS[m1[1].toLowerCase()];
    day = Number(m1[2]);
  } else if (m2) {
    mo = Number(m2[1]);
    day = Number(m2[2]);
  } else {
    return "";
  }
  if (!mo || !day) return "";
  return `${year}-${String(mo).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function fetchNews(seed) {
  const res = await fetch(seed.url, { headers: { "User-Agent": UA }, redirect: "follow" });
  const html = await res.text();
  const title = metaContent(html, "og:title");
  const summary = metaContent(html, "og:description");
  const image = metaContent(html, "og:image");
  if (hasFlag("--raw")) {
    console.log("---- " + seed.url);
    console.log("  title:", title || "(空)");
    console.log("  date :", parseDate(title, summary) || "(未解析)");
    console.log("  desc :", summary.slice(0, 120) + (summary.length > 120 ? "…" : ""));
    console.log("  img  :", image || "(空)");
  }
  if (!title) return null; // 抓不到真实标题就丢弃，绝不编造
  return {
    title,
    summary,
    image,
    url: seed.url,
    tag: seed.tag || "资讯",
    date: parseDate(title, summary),
  };
}

async function main() {
  const items = [];
  for (const seed of NEWS_SEEDS) {
    try {
      const item = await fetchNews(seed);
      if (item) items.push(item);
    } catch (e) {
      console.error("跳过（抓取失败）:", seed.url, "-", e.message);
    }
  }

  // 按日期倒序（无日期的排最后）
  items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const result = {
    updatedAt: new Date().toISOString(),
    source: { name: "Delta Force 官方资讯", url: "https://www.playdeltaforce.com/en/news/", server: "intl" },
    count: items.length,
    items,
  };

  const summary = `[news] ${items.length} 条官方资讯`;
  if (hasFlag("--dry")) {
    console.log("DRY-RUN，不写文件。");
    console.log(JSON.stringify(result, null, 2));
    console.log(summary);
    return;
  }

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(result, null, 2) + "\n", "utf8");
  console.log(`已写入 ${OUT_FILE}`);
  console.log(summary);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
