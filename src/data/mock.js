// ============================================================
//  作战简报 · 首页数据
//
//  数据真实性说明：
//   - 地图密码 → public/data/daily-codes.json（爬虫，真实）
//   - 官方资讯 → public/data/news.json（爬虫抓官方 og: meta，真实）
//   - 赛季/活动/物品（本文件）→ 取自官方资讯页的真实事实，每条带 source
//     官方链接，可点击核实。赛季更替时需手动更新（官方不提供可爬的结构化源）。
//   - 卡战备 → 已迁移到 scripts/loadouts-source.json（配方+参考价），
//     由 build-loadouts.mjs 算成本写入 public/data/loadouts.json，前端读取。
//   - 特勤处 → 社区经验 / 示例配置，官方不发布此类数据，
//     前端已用 RefNotice 显眼标注「参考 / 示例」，不冒充官方实时数据。
// ============================================================

// 官方资讯源链接（供赛季/活动/物品标注出处）
const SRC = {
  may15: "https://www.playdeltaforce.com/en/detail/news-announcement-update-may-15-eclipse-vigil-mid-season-update-overview.html",
  may29: "https://www.playdeltaforce.com/en/detail/news-announcement-update-may-29-victory-unite-mode-and-new-events.html",
  mar5: "https://www.playdeltaforce.com/en/detail/news-midseason-update-balance-adjustments-free-epic-appearance-warfare-4v4-showdown-iridescent-plume-appearance-lucky-draw-and-more.html",
};

// 2) 当前赛季 + 进行中活动（真实，来源：官方资讯页）
export const currentSeason = {
  name: "Eclipse Vigil",
  phase: "季中更新 / Mid-Season",
  note: "截至 2026 年 5 月的国际服当前赛季（官方未公布统一中文译名，沿用英文）。",
  source: SRC.may15,
};

// status: live=进行中, upcoming=即将开启, ended=已结束（按 2026-05-24 判定）
export const seasonEvents = [
  {
    name: "Event Pass · 赛季通行证",
    tag: "通行证",
    window: "5/16 – 6/12",
    status: "live",
    desc: "在烽火地带与战役两种模式中游玩对局，累积 Event EXP 解锁奖励。",
    rewards: ["M1014「Forest Hunter」枪械外观", "20 × 军备券 (Armament Voucher)"],
    source: SRC.may15,
  },
  {
    name: "新武器 K437",
    tag: "新武器",
    window: "5/16 – 5/29",
    status: "live",
    desc: "Eclipse Vigil 季中更新加入的新武器 K437，限时获取活动。",
    rewards: ["K437 武器"],
    source: SRC.may15,
  },
  {
    name: "Victory Unite 模式",
    tag: "新模式",
    window: "5/30 – 7/8",
    status: "upcoming",
    desc: "战役（Warfare）新增 Victory Unite 模式；同步开放手机端专属「航天基地常规行动」。",
    rewards: [],
    source: SRC.may29,
  },
  {
    name: "Iridescent Plume 外观幸运抽奖",
    tag: "抽奖",
    window: "3/6 起",
    status: "ended",
    desc: "季中幸运抽奖（Lucky Draw）外观，附带平衡性调整与 4v4 Warfare Showdown。",
    rewards: ["Iridescent Plume 外观", "免费史诗枪械（3/6 – 3/26）"],
    source: SRC.mar5,
  },
];

// 3) 卡战备配置 → 已迁移到 scripts/loadouts-source.json（配方+参考价），
//    由 build-loadouts.mjs 算成本写入 public/data/loadouts.json，前端运行时读取。

// 4) 特勤处推荐模块（示例机制 —— 前端显眼标注参考）
export const departmentPriority = [
  {
    name: "仓库扩容",
    type: "升级",
    priority: "高",
    level: "Lv.1 → Lv.3",
    desc: "提升安全箱与仓库格数。",
    why: "开荒期物资暴增，格子不够会被迫贱卖，优先拉满。",
    detail: {
      summary:
        "仓库格数是开荒期最稀缺的资源。物资进得快、卖得慢，格子不够就只能贱卖好东西。这是性价比最高的第一优先升级。",
      tiers: [
        { lv: "Lv.1 → Lv.2", cost: "45,000 哈弗币", mats: "金属板 ×4 · 螺丝包 ×6", time: "即时", unlock: "仓库 +40 格" },
        { lv: "Lv.2 → Lv.3", cost: "120,000 哈弗币", mats: "工业电机 ×2 · 金属板 ×8", time: "2 小时", unlock: "仓库 +80 格 · 安全箱扩容" },
      ],
      tip: "先升仓库再升其它，否则搜刮收益会因为格子不足而被迫浪费。",
    },
  },
  {
    name: "技术中心",
    type: "科技",
    priority: "高",
    level: "Lv.1 → Lv.2",
    desc: "解锁武器改装与高级配件研究。",
    why: "解锁 M4 / SCAR 关键改装位，直接决定中后期战斗力。",
    detail: {
      summary:
        "技术中心决定你能用上哪些改装件，直接挂钩战斗力天花板，也是曼德尔砖破译的场所。开荒期与仓库并列第一优先。",
      tiers: [
        { lv: "Lv.1 → Lv.2", cost: "90,000 哈弗币", mats: "电路板 ×6 · 加密硬盘 ×1", time: "4 小时", unlock: "M4/SCAR 高级枪口与瞄具" },
      ],
      tip: "升到 Lv.2 后曼德尔砖破译速度显著加快，呼应赛季任务线。",
    },
  },
  {
    name: "工作台",
    type: "制作",
    priority: "中",
    level: "Lv.1 → Lv.2",
    desc: "自制弹药、药品与基础配件。",
    why: "自产高穿弹与急救包，长期省下大量哈弗币。",
    detail: {
      summary:
        "工作台让你自产高穿弹和急救包。前期可缓，一旦开始打满配对抗，自产 M995 的省钱效果非常可观。",
      tiers: [
        { lv: "Lv.1 → Lv.2", cost: "60,000 哈弗币", mats: "火药 ×10 · 弹壳 ×20", time: "1 小时", unlock: "高穿弹自制 · 急救包配方" },
      ],
      tip: "自制 M995 单发成本约为交易行价的 6 折，满配党回本利器。",
    },
  },
  {
    name: "情报站",
    type: "科技",
    priority: "中",
    level: "Lv.1",
    desc: "显示地图刷新与头目情报。",
    why: "提升搜刮效率，配合房间密码事半功倍。",
    detail: {
      summary:
        "情报站点亮后，进图前可预览头目刷新区与高价值刷新点，配合每日房间密码搜刮效率大增。",
      tiers: [
        { lv: "解锁 Lv.1", cost: "55,000 哈弗币", mats: "无线电零件 ×4", time: "30 分钟", unlock: "局内头目/刷新点标记" },
      ],
      tip: "与打头目玩法强联动，先点这个再去刷 Boss。",
    },
  },
  {
    name: "医疗站",
    type: "升级",
    priority: "低",
    level: "Lv.1",
    desc: "缩短局外回血与断肢恢复时间。",
    why: "舒适性升级，资源紧张时可延后。",
    detail: {
      summary:
        "纯舒适性升级，缩短局外恢复时间。不影响战斗力，开荒期资源紧张时可以最后再点。",
      tiers: [
        { lv: "解锁 Lv.1", cost: "30,000 哈弗币", mats: "医疗箱钥匙 ×2", time: "即时", unlock: "局外恢复提速 40%" },
      ],
      tip: "高频开打、连续作战时才体现价值，佛系玩家可长期忽略。",
    },
  },
  {
    name: "交易行权限",
    type: "升级",
    priority: "低",
    level: "Lv.1 → Lv.2",
    desc: "提升每日挂单数量与降低手续费。",
    why: "倒货党再考虑，纯跑刀党性价比一般。",
    detail: {
      summary:
        "提升挂单上限并降低交易手续费。如果你靠倒卖钥匙卡/改装件赚差价，这是回本机器；纯撤离党收益有限。",
      tiers: [
        { lv: "Lv.1 → Lv.2", cost: "70,000 哈弗币", mats: "金色徽章 ×1", time: "1 小时", unlock: "挂单 +10 · 手续费 -3%" },
      ],
      tip: "想冲高额累计收益的倒货党，这个能显著提速。",
    },
  },
];

// 5) 活动物品模块（真实，来源：官方资讯页；括号内为活动时间）
export const eventItems = [
  {
    name: "M1014 · Forest Hunter", type: "枪械外观", rarity: "epic", status: "live",
    detail: { event: "Event Pass 赛季通行证", window: "5/16 – 6/12", howto: "游玩对局累积 Event EXP 解锁。", source: SRC.may15 },
  },
  {
    name: "K437", type: "武器", rarity: "legendary", status: "live",
    detail: { event: "新武器限时活动", window: "5/16 – 5/29", howto: "Eclipse Vigil 季中更新加入的新武器。", source: SRC.may15 },
  },
  {
    name: "军备券 Armament Voucher", type: "代币", rarity: "rare", status: "live",
    detail: { event: "Event Pass 赛季通行证", window: "5/16 – 6/12", howto: "通行证赠送 20 张，用于兑换军备。", source: SRC.may15 },
  },
  {
    name: "Iridescent Plume", type: "外观", rarity: "legendary", status: "ended",
    detail: { event: "季中幸运抽奖 Lucky Draw", window: "3/6 起", howto: "季中更新的抽奖限定外观。", source: SRC.mar5 },
  },
  {
    name: "免费史诗枪械", type: "武器", rarity: "epic", status: "ended",
    detail: { event: "Free Epic Gun 活动", window: "3/6 – 3/26", howto: "完成行动任务攒代币兑换。", source: SRC.mar5 },
  },
];
