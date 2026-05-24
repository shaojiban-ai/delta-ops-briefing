import { useEffect, useRef } from "react";

// ============================================================
//  HUD 详情弹窗 · 可复用
//  用于「卡片点击展开」详情面板：军事 HUD 风格、ESC/点击遮罩关闭、
//  打开时锁定 body 滚动、四角描边。
// ============================================================
export default function Modal({ open, onClose, index, title, action, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-[reveal_.2s_ease-out_forwards]"
        onClick={onClose}
      />

      {/* 面板 */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl my-auto bg-card border border-line-bright hud-corner outline-none translate-y-2 opacity-0 animate-[reveal_.25s_ease-out_.05s_forwards]"
      >
        {/* 扫描线顶饰 */}
        <div className="h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

        <div className="flex items-start justify-between gap-4 px-5 md:px-7 pt-5 pb-4 border-b border-line">
          <div className="min-w-0">
            {index ? (
              <div className="font-mono text-[11px] text-accent tracking-[0.25em] mb-1.5">{index}</div>
            ) : null}
            <h3 className="font-display text-2xl md:text-3xl font-semibold uppercase tracking-wide text-text leading-none">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {action}
            <button
              onClick={onClose}
              aria-label="关闭"
              className="w-9 h-9 grid place-items-center border border-line-bright text-dim hover:text-hot hover:border-hot transition-colors font-mono text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-5 md:px-7 py-6 max-h-[70vh] overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// 弹窗内常用：小标题分隔
export function ModalBlock({ label, children, className = "" }) {
  return (
    <div className={className}>
      <div className="font-mono text-[11px] text-accent uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-accent rotate-45" />
        {label}
      </div>
      {children}
    </div>
  );
}
