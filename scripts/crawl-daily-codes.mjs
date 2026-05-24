#!/usr/bin/env node
// ============================================================
//  每日密码爬虫 · Daily Door-Code Crawler
//  源：素颜API delta_mima（免费 / 免 token / 国服）
//  用法：
//    node scripts/crawl-daily-codes.mjs            抓今日并写入 JSON
//    node scripts/crawl-daily-codes.mjs --dry      只打印，不写文件
//    node scripts/crawl-daily-codes.mjs --raw      额外打印接口原始返回
//    node scripts/crawl-daily-codes.mjs --time=5-22 指定日期(月-日)
// ============================================================

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_FILE = resolve(ROOT, "public/data/daily-codes.json");

// 本地运行时自动加载根目录 .env（官方源 token 等）。
// 云端 GitHub Actions 用 Secrets 直接注入环境变量，没有 .env 文件，跳过即可。
try {
  process.loadEnvFile(resolve(ROOT, ".env"));
} catch {
  /* 无 .env 文件：忽略，改由进程环境变量提供（CI / Secrets） */
}

const SOURCE = {
  name: "素颜API",
  url: "https://api.suyanw.cn/api/delta_mima.php",
  homepage: "https://api.suyanw.cn/doc/delta_mima.php",
  server: "cn", // 国服
};

// 地图中文名 → 编号 / 英文名（国际服对照，便于以后切换）
const MAP_META = {
  零号大坝: { code: "MAP-01", en: "Zero Dam" },
  长弓溪谷: { code: "MAP-02", en: "Layali Grove" },
  巴克什: { code: "MAP-03", en: "Brakkesh" },
  航天基地: { code: "MAP-04", en: "Space City" },
  潮汐监狱: { code: "MAP-05", en: "Tide Prison" },
};

// 官方国际服接口 GetPrivateRoomKey 的 data 形如 { slug: "4位码" }
// 各地图密码门位置是固定的（只有密码每日变），故位置作为静态信息内置。
const OFFICIAL_SLUG = {
  zero_dam: { map: "零号大坝", en: "Zero Dam", code: "MAP-01", location: "主变电站右侧 · 地下管道尽头" },
  longbow_valley: { map: "长弓溪谷", en: "Layali Grove", code: "MAP-02", location: "地图右下角标记点附近的地下入口" },
  bakshe: { map: "巴克什", en: "Brakkesh", code: "MAP-03", location: "哈曼浴场北侧" },
  spaceport: { map: "航天基地", en: "Space City", code: "MAP-04", location: "工业区 · 组装车间 2F" },
  tide_prison: { map: "潮汐监狱", en: "Tide Prison", code: "MAP-05", location: "监狱行政区 1 楼大厅楼梯拐角" },
};

const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getOpt = (k) => {
  const hit = args.find((a) => a.startsWith(`${k}=`));
  return hit ? hit.split("=")[1] : null;
};

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function fetchSource(time) {
  const u = new URL(SOURCE.url);
  u.searchParams.set("type", "json");
  if (time) u.searchParams.set("time", time);
  const res = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow" });
  const text = await res.text();
  if (hasFlag("--raw")) {
    console.log("---- RAW RESPONSE ----");
    console.log(`HTTP ${res.status}  ${res.headers.get("content-type")}`);
    console.log(text.slice(0, 2000));
    console.log("----------------------");
  }
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 非 JSON（多为纯文本错误），保留 text 走错误分支 */
  }
  return { httpStatus: res.status, json, text };
}

// 官方源：重放一次抓包得到的请求（token 等敏感信息从环境变量读取）
// 配置方式（二选一）：
//   1) DF_REQ_JSON='{"url":"...","method":"POST","headers":{...},"body":"..."}'
//   2) DF_URL=... DF_METHOD=POST DF_HEADERS='{"...":"..."}' DF_BODY='...'
function getOfficialReq() {
  if (process.env.DF_REQ_JSON) {
    try {
      return JSON.parse(process.env.DF_REQ_JSON);
    } catch {
      console.error("DF_REQ_JSON 不是合法 JSON，已忽略。");
      return null;
    }
  }
  if (process.env.DF_URL) {
    return {
      url: process.env.DF_URL,
      method: process.env.DF_METHOD || "POST",
      headers: process.env.DF_HEADERS ? JSON.parse(process.env.DF_HEADERS) : {},
      body: process.env.DF_BODY || undefined,
    };
  }
  return null;
}

async function fetchOfficial(req) {
  const res = await fetch(req.url, {
    method: req.method || "GET",
    headers: { "User-Agent": UA, ...(req.headers || {}) },
    body: req.body,
    redirect: "follow",
  });
  const text = await res.text();
  if (hasFlag("--raw")) {
    console.log("---- OFFICIAL RAW ----");
    console.log(`HTTP ${res.status}  ${res.headers.get("content-type")}`);
    console.log(text.slice(0, 3000));
    console.log("----------------------");
  }
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 保留 text */
  }
  return { httpStatus: res.status, json, text };
}

// 从任意返回里找出"数据行数组"
function extractRows(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (json.data && typeof json.data === "object") return [json.data];
  // 兜底：取第一个数组型字段
  for (const v of Object.values(json)) if (Array.isArray(v)) return v;
  return [];
}

const pick = (row, keys) => {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== "") return String(row[k]).trim();
  }
  return "";
};

// 把 "【潮汐监狱】监狱行政区" 拆成 { map, room }
function splitMapName(raw) {
  const m = raw.match(/^[【\[](.+?)[】\]]\s*(.*)$/);
  if (m) return { map: m[1].trim(), room: (m[2] || "").trim() };
  return { map: raw.trim(), room: "" };
}

function normalize(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const rawName = pick(row, ["map_name", "name", "ditu", "map", "title"]);
    const location = pick(row, ["location", "weizhi", "addr", "address", "desc"]);
    const password = pick(row, ["password", "mima", "code", "pwd"]);
    const images = Array.isArray(row.image_urls)
      ? row.image_urls
      : row.image
      ? [row.image]
      : [];
    if (!rawName && !password) continue;
    const { map, room } = splitMapName(rawName);
    if (!grouped.has(map)) grouped.set(map, []);
    grouped.get(map).push({ room: room || map, location, password, images });
  }
  return [...grouped.entries()].map(([map, rooms]) => ({
    map,
    code: MAP_META[map]?.code ?? "",
    en: MAP_META[map]?.en ?? "",
    rooms,
  }));
}

// 官方国际服形态：{ code:0, data:{ slug: "1234", ... } }
function normalizeOfficial(json) {
  const d = json?.data;
  if (!d || Array.isArray(d) || typeof d !== "object") return null;
  const entries = Object.entries(d).filter(
    ([, v]) => (typeof v === "string" || typeof v === "number") && /^\d{3,6}$/.test(String(v)),
  );
  if (entries.length === 0) return null;
  // 按内置顺序(MAP-01..05)排列，未知 slug 追加在后
  const order = Object.keys(OFFICIAL_SLUG);
  const slugs = [...entries.map(([s]) => s)].sort(
    (a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99),
  );
  return slugs.map((slug) => {
    const meta = OFFICIAL_SLUG[slug] || { map: slug, en: "", code: "", location: "" };
    return {
      map: meta.map,
      code: meta.code,
      en: meta.en,
      rooms: [{ room: "每日密码门", location: meta.location || "", password: String(d[slug]), images: [] }],
    };
  });
}

// 统一入口：先试官方对象形态，再退回素颜API数组形态
function normalizeAny(json) {
  return normalizeOfficial(json) ?? normalize(extractRows(json));
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT_FILE, "utf8"));
  } catch {
    return null;
  }
}

function todayLabel() {
  // 接口以"M月D日"为准；这里给一个本地参考标签
  const beijing = new Date(Date.now() + (8 * 60 + new Date().getTimezoneOffset()) * 60000);
  return `${beijing.getMonth() + 1}月${beijing.getDate()}日`;
}

async function main() {
  const time = getOpt("--time");
  const prev = await readPrevious();
  const now = new Date().toISOString();

  // 源选择优先级：
  //   --input=<file> 手动快照（用抓包贴来的返回直接填充） >
  //   官方抓包请求(DF_*) > 素颜API(国服回退)
  const inputFile = getOpt("--input");
  const officialReq = getOfficialReq();
  const OFFICIAL_HOME = "https://www.playdeltaforce.com/events/hq/en/";
  // 去掉 URL 上的查询串（官方签名 u/ts/s 等于登录凭证），绝不写进会提交到仓库的 JSON
  const stripQuery = (u) => {
    try {
      const x = new URL(u);
      return `${x.origin}${x.pathname}`;
    } catch {
      return OFFICIAL_HOME;
    }
  };
  const activeSource =
    inputFile || officialReq
      ? {
          name: "官方 HQ · GetPrivateRoomKey",
          homepage: OFFICIAL_HOME,
          url: officialReq?.url ? stripQuery(officialReq.url) : OFFICIAL_HOME,
          server: "intl",
        }
      : SOURCE;

  let result;
  try {
    let fetched;
    if (inputFile) {
      const raw = await readFile(resolve(process.cwd(), inputFile), "utf8");
      let j = null;
      try {
        j = JSON.parse(raw);
      } catch {
        /* keep text */
      }
      if (hasFlag("--raw")) console.log("---- INPUT SNAPSHOT ----\n" + raw.slice(0, 1500));
      fetched = { httpStatus: 200, json: j, text: raw };
    } else if (officialReq) {
      fetched = await fetchOfficial(officialReq);
    } else {
      fetched = await fetchSource(time);
    }
    const { httpStatus, json, text } = fetched;
    const apiBad = json && json.code != null && json.code !== 0 ? json.msg || `code ${json.code}` : null;
    const errMsg = json?.error || apiBad || (httpStatus >= 400 ? `HTTP ${httpStatus}` : null);
    const maps = normalizeAny(json);

    if (maps.length > 0) {
      result = {
        updatedAt: now,
        dataDate: json?.date || json?.time || todayLabel(),
        status: "ok",
        source: activeSource,
        note: json?.tips || "",
        maps,
      };
    } else {
      // 今日尚未公布 / 接口报错 → 保留上一份已知密码，仅标记为非最新
      result = {
        updatedAt: now,
        dataDate: prev?.dataDate ?? todayLabel(),
        status: "pending",
        source: activeSource,
        note:
          (json && json.error ? json.error : (text || "").trim()) ||
          "今日密码尚未公布，约 9-10 点更新",
        lastError: errMsg || "no data yet",
        maps: prev?.maps ?? [],
      };
    }
  } catch (e) {
    result = {
      updatedAt: now,
      dataDate: prev?.dataDate ?? todayLabel(),
      status: "error",
      source: activeSource,
      note: "抓取失败，展示上一次成功的数据",
      lastError: e.message,
      maps: prev?.maps ?? [],
    };
  }

  const summary = `[${result.status}] ${result.dataDate} · ${result.maps.length} 张图 · ${result.maps.reduce(
    (n, m) => n + m.rooms.length,
    0,
  )} 个房间`;

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
