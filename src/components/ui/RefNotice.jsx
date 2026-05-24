// 显眼的「参考 / 示例」标注条 —— 用于官方不发布、无法验证的模块，
// 明确告知用户：内容为社区经验/示例，非官方实时数据。
export default function RefNotice({ children }) {
  return (
    <div className="mb-6 flex items-start gap-3 bg-cool/[0.06] border border-cool/40 px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cool border border-cool/50 px-2 py-1 shrink-0 mt-0.5">
        参考 / 示例
      </span>
      <p className="text-[13px] text-dim leading-relaxed">{children}</p>
    </div>
  );
}

// 小号行内徽章（标题旁用）
export function RefBadge() {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cool border border-cool/50 px-2 py-1">
      参考 / 示例
    </span>
  );
}
