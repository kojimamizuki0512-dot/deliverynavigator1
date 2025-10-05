import React, { useRef, useState } from 'react'

export default function UploadModal({ open, onClose, apiBase }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  if (!open) return null

  const handleSelect = (e) => {
    setFile(e.target.files?.[0] ?? null)
    setError(null)
    setResult(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('画像ファイルを選んでください')
      return
    }
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const base = (apiBase || '').replace(/\/$/, '')
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${base}/api/upload-screenshot/`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setResult(json)
    } catch (e) {
      console.error(e)
      setError('アップロードに失敗しました')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,680px)] card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">画像から読み込み（疑似OCR）</h3>
          <button onClick={onClose} className="text-mute hover:text-text">閉じる</button>
        </div>

        <div className="border border-line rounded-xl p-4 bg-[#121723]">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="block w-full text-sm"
          />
          <p className="text-mute text-xs mt-2">スクショやレシートの画像を選んでください。</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleUpload}
            disabled={busy}
            className="px-3 py-2 rounded-xl bg-brand text-black text-sm font-bold disabled:opacity-60"
          >
            {busy ? '読み込み中…' : '読み込む'}
          </button>
          {file && <span className="text-mute text-sm">選択中：{file.name}</span>}
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        {result && (
          <div className="mt-4 grid md:grid-cols-2 gap-3">
            <div className="border border-line rounded-xl px-4 py-3">
              <div className="text-mute text-xs">プレビュー情報</div>
              <div className="mt-1 text-sm">
                幅：{result?.preview?.width ?? '-'} / 高さ：{result?.preview?.height ?? '-'}
              </div>
            </div>
            <div className="border border-line rounded-xl px-4 py-3">
              <div className="text-mute text-xs">抽出（ダミー）</div>
              <ul className="mt-1 text-sm space-y-1">
                <li>配達報酬：{result?.extracted?.['配達報酬'] ?? '-'}</li>
                <li>配達完了時刻：{result?.extracted?.['配達完了時刻'] ?? '-'}</li>
                <li>レストラン名：{result?.extracted?.['レストラン名'] ?? '-'}</li>
                <li>配達先エリア：{result?.extracted?.['配達先エリア'] ?? '-'}</li>
                <li>配達距離：{result?.extracted?.['配達距離'] ?? '-'}</li>
                <li>ブースト料金：{result?.extracted?.['ブースト料金'] ?? '-'}</li>
              </ul>
              <p className="text-mute text-xs mt-2">{result?.note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
