import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function Heatmap({ apiBase, onPointClick, routePoints = [] }) {
  const mapRef = useRef(null)
  const mapObj = useRef(null)
  const markersRef = useRef([])
  const routeRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 初期化＆ポイント描画
  useEffect(() => {
    const map = L.map(mapRef.current, { zoomControl: true }).setView([35.6618, 139.7041], 13)
    mapObj.current = map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & Carto',
      maxZoom: 19
    }).addTo(map)

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const base = (apiBase || '').replace(/\/$/, '')
        const res = await fetch(`${base}/api/heatmap-data/`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const items = await res.json()

        // 既存マーカー削除
        markersRef.current.forEach(m => map.removeLayer(m))
        markersRef.current = []

        items.forEach((pt) => {
          const s = Number(pt.intensity ?? 0)
          const r = 10 + Math.round(s * 14)
          const color =
            s >= 0.8 ? '#93c5fd' :
            s >= 0.6 ? '#60a5fa' :
            s >= 0.4 ? '#3b82f6' :
                        '#2563eb'

          const marker = L.circleMarker([pt.lat, pt.lng], {
            radius: r,
            color: '#e5e7eb',
            weight: 1.5,
            fillColor: color,
            fillOpacity: 0.8
          }).addTo(map)

          marker.on('click', () => onPointClick && onPointClick(pt))
          marker.bindPopup(`<b>強さ</b>：${Math.round(s * 100)}%`)
          markersRef.current.push(marker)
        })

        if (markersRef.current.length) {
          const g = L.featureGroup(markersRef.current)
          map.fitBounds(g.getBounds().pad(0.2))
        }
      } catch (e) {
        console.error('[Heatmap] fetch error:', e)
        setError('地図データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => { map.remove(); mapObj.current = null }
  }, [apiBase, onPointClick])

  // ルート線の描画（右パネルやクリックに応じて更新）
  useEffect(() => {
    const map = mapObj.current
    if (!map) return
    if (routeRef.current) {
      map.removeLayer(routeRef.current)
      routeRef.current = null
    }
    if (routePoints && routePoints.length >= 2) {
      routeRef.current = L.polyline(routePoints, {
        color: '#60a5fa',
        weight: 4,
        opacity: 0.9
      }).addTo(map)
    }
  }, [routePoints])

  return (
    <div>
      <div ref={mapRef} className="w-full h-[420px] rounded-xl overflow-hidden border border-line" />
      {loading && <p className="text-mute text-sm mt-2">読み込み中…</p>}
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      {!loading && !error && <p className="text-mute text-xs mt-1">＊色は濃いほど強い（青系）</p>}
    </div>
  )
}
