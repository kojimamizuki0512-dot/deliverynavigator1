import React, { useEffect, useMemo, useState } from 'react'

export default function RoutePlan({ apiBase, onRouteChange }) {
  const [area, setArea] = useState('渋谷エリア')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const areaOptions = useMemo(() => ([
    '渋谷エリア', '新宿エリア', '中央区エリア', '港区エリア'
  ]), [])

  // エリア→中心座標
  const areaCenter = (a) => {
    switch (a) {
      case '新宿エリア': return [35.6902, 139.7006]
      case '中央区エリア': return [35.6717, 139.7776]
      case '港区エリア': return [35.6581, 139.7516]
      default: return [35.6591, 139.7006] // 渋谷
    }
  }

  // 中心から“ざっくりルート”（地図に描くためだけ）
  const makeRoute = ([lat, lng]) => ([
    [lat + 0.003, lng - 0.003],
    [lat + 0.002, lng + 0.002],
    [lat - 0.001, lng + 0.003],
    [lat - 0.003, lng - 0.001],
  ])

  const load = async (chosen) => {
    setLoading(true)
    try {
      const base = (apiBase || '').replace(/\/$/, '')
      const res = await fetch(`${base}/api/daily-route/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: chosen || area })
      })
      const json = await res.json()
      setData(json)
      onRouteChange?.(makeRoute(areaCenter(json.recommended_area)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(area) }, [])

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold">今日のおすすめルート</h2>
        <div className="flex items-center gap-2">
          <select
            className="bg-[#0f141e] border border-line rounded-xl px-3 py-2 text-sm"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {areaOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <button
            onClick={() => load(area)}
            className="px-3 py-2 rounded-xl bg-brand text-black text-sm font-bold"
          >
            今日のプランを作成
          </button>
        </div>
      </div>

      {loading && <p className="text-mute text-sm mt-3">作成中…</p>}

      {data && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-line rounded-xl px-4 py-3">
              <div className="text-mute text-xs">本日の推奨エリア</div>
              <div className="font-bold text-base mt-0.5">{data.recommended_area}</div>
            </div>
            <div className="border border-line rounded-xl px-4 py-3">
              <div className="text-mute text-xs">予測日給</div>
              <div className="font-bold text-base mt-0.5">¥{data.predicted_income?.toLocaleString?.() ?? data.predicted_income}</div>
            </div>
          </div>

          <ul className="space-y-2">
            {data.timeline?.map((item, idx) => (
              <li key={idx} className="grid grid-cols-[100px_1fr] gap-3 border border-line rounded-xl px-4 py-3 bg-[#121723]">
                <div className="font-extrabold">{item.time}</div>
                <div>{item.action}</div>
              </li>
            ))}
          </ul>

          <div className="text-mute text-xs">＊状況により30〜60分ごとに自動で最適化（ここではダミー）</div>
        </div>
      )}
    </div>
  )
}
