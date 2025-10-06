import { useEffect, useState } from "react";
import { api } from "../../api";

export default function SummaryCard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.summary().then(setS).catch(() => setErr("サマリーの取得に失敗しました"));
  }, []);

  return (
    <section className="min-w-[340px] md:min-w-[520px] flex-1 bg-app-panel rounded-2xl p-4 border border-white/5">
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">実績サマリー</h2>
      </header>

      {!s && !err && <div className="text-app-muted text-sm">読み込み中…</div>}
      {err && <div className="text-warn text-sm">{err}</div>}

      {s && (
        <div className="grid grid-cols-2 gap-4">
          <KPI label="総売上" value={`¥${s.total_revenue.toLocaleString()}`} />
          <KPI label="件数" value={`${s.orders}件`} />
          <KPI label="平均時給" value={`¥${s.avg_hourly_wage.toLocaleString()}`} />
          <KPI label="稼働時間" value={`${Math.round(s.worked_minutes / 60)}時間`} />
          <div className="col-span-2">
            <div className="text-xs opacity-70 mb-1">称号</div>
            <div className="flex flex-wrap gap-2">
              {s.badges_unlocked.map((b, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-app border border-white/10 text-xs">
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function KPI({ label, value }) {
  return (
    <div className="bg-app rounded-xl p-3 border border-white/5">
      <div className="text-xs opacity-70">{label}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}
