// ============================================================
//  作战简报 · 首页 Mock 数据
//  所有数据为占位用静态数据，后续可替换为接口返回
// ============================================================

// 1) 地图房间密码模块
//    已改为真实数据：由 scripts/crawl-daily-codes.mjs 每日抓取，
//    输出到 public/data/daily-codes.json，前端运行时读取。

// 2) 赛季任务模块
export const seasonInfo = {
  season: "S3 · 沙漠风暴",
  cycle: "2026.04.10 — 2026.07.02",
  totalTier: 80,
  currentTier: 34,
};

export const seasonMissions = [
  {
    stage: "阶段 01",
    title: "入境阿萨拉",
    objective: "完成 3 次烽火地带撤离（任意地图）",
    reward: "战术背包 II · 12,000 哈弗币",
    progress: 100,
    status: "done",
  },
  {
    stage: "阶段 02",
    title: "物资勘探",
    objective: "在零号大坝开启 10 个保险箱 / 协议箱",
    reward: "三级护甲图纸 · 8,000 哈弗币",
    progress: 100,
    status: "done",
  },
  {
    stage: "阶段 03",
    title: "高价值目标",
    objective: "击败任意地图头目 2 次并成功撤离",
    reward: "稀有改装件箱 · 25,000 哈弗币",
    progress: 60,
    status: "active",
  },
  {
    stage: "阶段 04",
    title: "情报破译",
    objective: "完整破译 1 块曼德尔砖",
    reward: "赛季限定涂装「沙暴」· 40,000 哈弗币",
    progress: 0,
    status: "locked",
  },
  {
    stage: "阶段 05",
    title: "全境通缉",
    objective: "单赛季累计撤离收益达 200 万",
    reward: "赛季徽章 · 黄金保险箱 ×1",
    progress: 0,
    status: "locked",
  },
];

// 3) 卡战备选择模块
export const loadoutSetups = [
  {
    id: "budget",
    tier: "低保配装",
    en: "BUDGET RUN",
    accent: "cool",
    priceLabel: "单套成本",
    price: "≈ 38,000",
    summary: "亏了不心疼的跑刀套，专注稳定撤离与回本。",
    gear: [
      { slot: "头盔", value: "GT3 三级头", note: "防爆头基础线" },
      { slot: "护甲", value: "MC 三级胸甲", note: "性价比之王" },
      { slot: "背包", value: "突击背包 24格", note: "够装一趟" },
      { slot: "主武器", value: "AKM · 零改", note: "单发高伤，弹便宜" },
      { slot: "副武器", value: "G17 手枪", note: "应急自卫" },
      { slot: "药品", value: "急救包 ×2 · 止痛 ×2", note: "保命续航" },
    ],
  },
  {
    id: "meta",
    tier: "满配起装",
    en: "FULL META",
    accent: "accent",
    priceLabel: "单套成本",
    price: "≈ 320,000",
    summary: "对抗老手与守点的高强度配置，吃鸡级输出与生存。",
    gear: [
      { slot: "头盔", value: "FAST 五级头 + 耳麦", note: "抗高穿弹" },
      { slot: "护甲", value: "GA 五级重甲", note: "正面硬抗" },
      { slot: "背包", value: "战术背包 II 42格", note: "满载撤离" },
      { slot: "主武器", value: "M4A1 · 天花板改", note: "中距版本答案" },
      { slot: "副武器", value: "MP5 · 室内改", note: "贴脸补枪" },
      { slot: "药品", value: "手术包 ×1 · 急救 ×3", note: "断肢回满" },
    ],
  },
];

// 4) 特勤处推荐模块
export const departmentPriority = [
  {
    name: "仓库扩容",
    type: "升级",
    priority: "高",
    level: "Lv.1 → Lv.3",
    desc: "提升安全箱与仓库格数。",
    why: "开荒期物资暴增，格子不够会被迫贱卖，优先拉满。",
  },
  {
    name: "技术中心",
    type: "科技",
    priority: "高",
    level: "Lv.1 → Lv.2",
    desc: "解锁武器改装与高级配件研究。",
    why: "解锁 M4 / SCAR 关键改装位，直接决定中后期战斗力。",
  },
  {
    name: "工作台",
    type: "制作",
    priority: "中",
    level: "Lv.1 → Lv.2",
    desc: "自制弹药、药品与基础配件。",
    why: "自产高穿弹与急救包，长期省下大量哈弗币。",
  },
  {
    name: "情报站",
    type: "科技",
    priority: "中",
    level: "Lv.1",
    desc: "显示地图刷新与头目情报。",
    why: "提升搜刮效率，配合房间密码事半功倍。",
  },
  {
    name: "医疗站",
    type: "升级",
    priority: "低",
    level: "Lv.1",
    desc: "缩短局外回血与断肢恢复时间。",
    why: "舒适性升级，资源紧张时可延后。",
  },
  {
    name: "交易行权限",
    type: "升级",
    priority: "低",
    level: "Lv.1 → Lv.2",
    desc: "提升每日挂单数量与降低手续费。",
    why: "倒货党再考虑，纯跑刀党性价比一般。",
  },
];

// 5) 活动物品模块
export const eventItems = [
  { name: "沙暴勋章", icon: "✦", rarity: "legendary", use: "赛季活动兑换硬通货" },
  { name: "行动密令", icon: "▣", rarity: "epic", use: "解锁限时高价值任务" },
  { name: "补给信标", icon: "◬", rarity: "rare", use: "召唤随机空投补给" },
  { name: "加密硬盘", icon: "⬡", rarity: "epic", use: "提交情报站换奖励" },
  { name: "古董怀表", icon: "◷", rarity: "rare", use: "活动收集类道具" },
  { name: "燃料罐", icon: "⛽", rarity: "common", use: "制作 / 兑换基础材料" },
  { name: "金色徽章", icon: "★", rarity: "legendary", use: "限定外观兑换" },
  { name: "电路板", icon: "⌗", rarity: "common", use: "技术中心升级材料" },
  { name: "医疗箱钥匙", icon: "✚", rarity: "rare", use: "开启活动医疗补给" },
  { name: "无线电零件", icon: "⌁", rarity: "common", use: "情报站任务道具" },
  { name: "神秘信封", icon: "✉", rarity: "epic", use: "随机奖励盲盒" },
  { name: "纪念弹壳", icon: "▮", rarity: "common", use: "收集成就道具" },
];

// 6) 热门活动与资讯模块
export const hotEvents = [
  {
    tag: "活动",
    date: "2026.05.22",
    title: "沙暴行动 · 双倍撤离收益周末",
    summary: "本周六日全地图撤离收益 +100%，限时三天，海外服同步开启。",
  },
  {
    tag: "公告",
    date: "2026.05.20",
    title: "航天基地时段事件正式上线",
    summary: "「前夜 / 长夜 / 终夜」动态时段更新，刷新与撤离规则调整。",
  },
  {
    tag: "电竞",
    date: "2026.05.18",
    title: "GTI 国际邀请赛预选开启报名",
    summary: "四人小队烽火地带积分赛，冠军瓜分 50,000 美元奖池。",
  },
];

export const newsFeed = [
  { date: "2026.05.20", cat: "PATCH", title: "航天基地新增时段事件，刷新机制调整" },
  { date: "2026.05.14", cat: "META", title: "SCAR-H 弹道修正后跌出 S 级，M4A1 重回首选" },
  { date: "2026.05.08", cat: "MAP", title: "零号大坝地下通道被淹，新路线推荐" },
  { date: "2026.05.02", cat: "EVENT", title: "巴克什博物馆周末双倍掉率活动" },
  { date: "2026.04.27", cat: "GUIDE", title: "曼德尔砖完整破译攻略：风险与收益解析" },
];
