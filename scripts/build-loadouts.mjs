#!/usr/bin/env node
// ============================================================
//  卡战备成本计算 · Loadout Cost Builder
//
//  读 scripts/loadouts-source.json（配方 + 参考价表），把每套配装的
//  总成本算出来，写到 public/data/loadouts.json，前端运行时读取。
//
//  数据性质：价格为社区参考价/估算，非官方实时数据（前端已显眼标注）。
//  改价格/配装 → 编辑 loadouts-source.json → 跑本脚本重算。
//
//  用法：
//    node scripts/build-loadouts.mjs          重算并写入 JSON
//    node scripts/build-loadouts.mjs --dry      只打印，不写文件
// ============================================================

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC_FILE = resolve(__dirname, "loadouts-source.json");
const OUT_FILE = resolve(ROOT, "public/data/loadouts.json");

const hasFlag = (f) => process.argv.slice(2).includes(f);

async function main() {
  const src = JSON.parse(await readFile(SRC_FILE, "utf8"));
  const prices = src.prices || {};
  const missing = new Set();

  const loadouts = (src.loadouts || []).map((lo) => {
    let total = 0;
    const gear = (lo.gear || []).map((g) => {
      const unit = prices[g.name];
      if (unit == null) missing.add(g.name); // 价表里没有该物品 → 记录，按 0 处理
      const qty = g.qty || 1;
      const priced = (unit || 0) * qty;
      total += priced;
      return { ...g, qty, unit: unit ?? null, priced };
    });
    return { ...lo, gear, total };
  });

  if (missing.size) {
    console.warn("⚠ 价表缺少这些物品的价格（已按 0 计）：", [...missing].join("、"));
  }

  const result = {
    generatedAt: new Date().toISOString(),
    pricesUpdated: src.pricesUpdated || null,
    currency: src.currency || "哈弗币",
    source: src.source || "社区参考价",
    note: "价格为社区参考/估算，非官方实时数据，仅供配装预算参考。",
    count: loadouts.length,
    loadouts,
  };

  const summary =
    `[loadouts] ${loadouts.length} 套 · 价表更新于 ${result.pricesUpdated} · ` +
    loadouts.map((l) => `${l.en}≈${l.total.toLocaleString()}`).join("  ");

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
