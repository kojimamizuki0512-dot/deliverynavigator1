import React, { useState } from 'react'
import Heatmap from '../components/Heatmap.jsx'
import RoutePlan from '../components/RoutePlan.jsx'

export default function HomePage({ apiBase }) {
  const [selectedRestaurants, setSelectedRestaurants] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [routePoints, setRoutePoints] = useState([])

  const setLoopAround = (pt) => {
    if (!pt) return
    const d = 0.002
    setRoutePoints([
      [pt.lat + d, pt.lng - d],
      [pt.lat + d * 0.5, pt.lng + d * 0.6],
      [pt.lat - d * 0.4, pt.lng + d],
      [pt.lat - d, pt.lng - d * 0.3],
    ])
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-5">
      {/* 左：ヒート（地図） */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">いま強いエリア（ヒート）</h2>
          <span className="text-mute text-sm">濃いほど強い</span>
        </div>
        <Heatmap
          apiBase={apiBase}
          routePoints={routePoints}
          onPointClick={(pt) => {
            setSelectedPoint(pt)
            setSelectedRestaurants(pt.restaurants || [])
            setLoopAround(pt)
          }}
        />
        <div className="mt-4">
          <h3 className="font-semibold mb-2">この近くで今よく出る店</h3>
          {selectedRestaurants.length ? (
            <ul className="grid grid-cols-2 gap-2">
              {selectedRestaurants.map((name, i) => (
                <li key={i} className="border border-line rounded-xl px-3 py-2 bg-[#121723]">
                  <span className="text-sm">{name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-mute text-sm">地図の点をタップすると表示されます。</p>
          )}
          {selectedPoint && (
            <p className="text-mute text-xs mt-2">
              目安の強さ：{Math.round((selectedPoint.intensity || 0) * 100)}%
            </p>
          )}
        </div>
      </section>

      {/* 右：ルート提案 */}
      <section className="card">
        <RoutePlan apiBase={apiBase} onRouteChange={(points) => setRoutePoints(points || [])} />
      </section>
    </main>
  )
}
