import { useEffect, useState } from "react";
import { api } from "../api";

export default function CockpitBar() {
  const [sum, setSum] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.summary().then(setSum).catch(() => setErr("読み込み失敗"));
  }, []);

  const progress = Math.min(1, sum?.progress_to_goal ?? 0);
  const pct = Math.round(progress * 100);

  return (
    <div className="border-b border-white/5 bg-app/70 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
        {sum ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="col-span-2">
              <div className="flex justify-between text-xs mb-1 opacity-80">
                <span>本日の目標達成率</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 bg-app-panel rounded-full overflow-hidden">
                <div
                  className={`h-full ${pct >= 100 ? "bg-gold" : "bg-brand"}`}
                  style={{ width: `${pct}%`, transition: "width .6s ease" }}
                />
              </div>
            </div>
            <div className="text-sm opacity-90">
              <div>現在の時給 <span className="text-success font-semibold">¥{sum.current_hourly_wage.toLocaleString()}</span></div>
            </div>
            <div className="text-sm opacity-90">
              <div>連続稼働 <span className="font-medium">{sum.streak_minutes}分</span></div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-app-muted">{err || "読み込み中…"}</div>
        )}
      </div>
    </div>
  );
}
