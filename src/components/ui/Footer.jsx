export default function Footer() {
  return (
    <footer className="px-5 sm:px-8 md:px-12 py-8 md:py-10 font-mono text-[10px] md:text-[11px] text-faint tracking-[0.1em] uppercase flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-wrap gap-4">
        <a href="#" className="text-dim hover:text-accent transition-colors">关于</a>
        <a href="#" className="text-dim hover:text-accent transition-colors">数据来源</a>
        <a href="#" className="text-dim hover:text-accent transition-colors">投稿</a>
        <a href="#" className="text-dim hover:text-accent transition-colors">RSS</a>
      </div>
      <div>// 非官方爱好者站点 · DELTA FORCE BRIEFING · 2026</div>
    </footer>
  );
}
