const BASE =
  (import.meta.env.VITE_API_BASE || "").replace(/\/$/, ""); // 末尾スラッシュ除去

async function jget(path) {
  const url = `${BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  heatmap: () => jget("/api/heatmap-data/"),
  route: () => jget("/api/daily-route/"),
  summary: () => jget("/api/daily-summary/"),
  weekly: () => jget("/api/weekly-forecast/"),
  upload: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${BASE}/api/upload-screenshot/`, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json();
  },
};
