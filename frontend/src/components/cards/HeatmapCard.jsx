import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { api } from "../../api";

export default function HeatmapCard() {
  const [points, setPoints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.heatmap().then(setPoints).catch(() => setError("地図データの取得に失敗しました"));
  }, []);

  const center = useMemo(() => [35.659, 139.700], []);

  return (
    <section className="min-w-[340px] md:min-w-[560px] flex-1 bg-app-panel rounded-2xl p-4 border border-white/5">
      <header className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">いま強いエリア（ヒート）</h2>
        <div className="text-xs text-app-muted">濃いほど強い</div>
      </header>

      <div className="rounded-xl overflow-hidden border border-white/10">
        <MapContainer
          center={center}
          zoom={14}
          style={{ height: 420 }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; Carto'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {points.map((p, idx) => (
            <CircleMarker
              key={idx}
              center={[p.lat, p.lng]}
              radius={8 + Math.round(p.intensity * 10)}
              pathOptions={{ color: "#4ea8ff", fillColor: "#4ea8ff", fillOpacity: 0.35 }}
            >
              <Tooltip direction="top">
                <div className="text-xs">
                  <div>強さ: {(p.intensity * 100) | 0}</div>
                  {p.restaurants?.length ? (
                    <ul className="mt-1">
                      {p.restaurants.map((r, i) => (
                        <li key={i}>・{r}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <p className="text-xs text-warn mt-3">
        {error ? error : "＊色が濃いほど強い（青系）"}
      </p>
    </section>
  );
}
