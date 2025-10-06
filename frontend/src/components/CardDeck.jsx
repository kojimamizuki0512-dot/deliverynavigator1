import { useRef } from "react";

export default function CardDeck({ children }) {
  const scroller = useRef(null);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w - 64), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="deck flex gap-6 overflow-x-auto pb-4"
      >
        {children}
      </div>

      {/* 左右ボタン（PC向け） */}
      <button
        onClick={() => scrollBy(-1)}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-app-panel border border-white/10 hover:border-white/20 shadow-soft items-center justify-center"
        aria-label="左へ"
      >
        ‹
      </button>
      <button
        onClick={() => scrollBy(1)}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-app-panel border border-white/10 hover:border-white/20 shadow-soft items-center justify-center"
        aria-label="右へ"
      >
        ›
      </button>
    </div>
  );
}
