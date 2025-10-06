import { useEffect, useState } from "react";
import { api } from "../../api";

export default function RouteCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.route().then(setData).catch(() => setErr("ルートの取得に失敗しました"));
  }, []);

  return (
    <section className="min-w-[340px] md:min-w-[520px] flex-1 bg-app-panel rounded-2xl p-4 border border-white/5">
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">今日のおすすめルート</h2>
        <div className="flex items-center gap-2">
          <select className="bg-app border border-white/10 rounded-lg px-2 py-1 text-sm">
            <option>渋谷エリア</option>
          </select>
          <button
            onClick={() => api.route().then(setData)}
            className="px-3 py-1.5 rounded-lg bg-brand text-black/90 font-medium hover:brightness-110"
          >
            今日のプランを作成
          </button>
        </div>
      </header>

      {!data && !err && <div className="text-app-muted text-sm">読み込み中…</div>}
      {err && <div className="text-warn text-sm">{err}</div>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-app rounded-xl p-3 border border-white/5">
              <div className="text-xs opacity-70">本日の推奨エリア</div>
              <div className="font-semibold mt-1">{data.recommended_area}</div>
            </div>
            <div className="bg-app rounded-xl p-3 border border-white/5">
              <div className="text-xs opacity-70">予測日給</div>
              <div className="font-semibold mt-1 text-success">
                ¥{data.predicted_income.toLocaleString()}
              </div>
            </div>
          </div>

          <ol className="space-y-3">
            {data.timeline.map((t, i) => (
              <li
                key={i}
                className="bg-app rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="text-xs opacity-70">{t.time}</div>
                <div className="font-medium mt-0.5">{t.action}</div>
              </li>
            ))}
          </ol>

          <p className="text-xs text-app-muted mt-3">
            ＊状況により30〜60分ごとに自動で最適化（ここではダミー）
          </p>
        </>
      )}
    </section>
  );
}
