import React, { useRef, useState } from 'react'

export default function UploadPage({ apiBase }) {
  const dropRef = useRef(null)
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const onFiles = (files) => {
    const f = files?.[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setError(null)
    setResult(null)
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropRef.current?.classList.remove('ring-2', 'ring-brand')
    onFiles(e.dataTransfer.files)
  }
  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropRef.current?.classList.add('ring-2', 'ring-brand')
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropRef.current?.classList.remove('ring-2', 'ring-brand')
  }

  const handleUpload = async () => {
    if (!file) {
      setError('画像を選んでください')
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
    <main>
      {/* ヒーロー */}
      <section className="border-b border-line bg-gradient-to-b from-[#0f1115] to-[#0c0e12]">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold">スクショをポン。30秒で「稼げる作戦」を提案</h1>
          <p className="text-mute mt-3">アプリの収益画面やレシートをアップするだけ。AIがあなた専用の戦略を作ります（ダミー動作）。</p>
        </div>
      </section>

      {/* アップロード */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-6">
        <div
          ref={dropRef}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className="card flex flex-col items-center justify-center text-center p-10 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-brand/20 text-brand grid place-items-center text-2xl font-extrabold">↑</div>
          <h3 className="text-lg font-bold mt-4">ここにドラッグ&ドロップ</h3>
          <p className="text-mute text-sm mt-1">またはクリックして選択</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          {file && <p className="text-mute text-sm mt-3">選択中：{file.name}</p>}

          <button
            onClick={(e) => { e.stopPropagation(); handleUpload() }}
            disabled={busy}
            className="mt-4 px-4 py-2 rounded-xl bg-brand text-black text-sm font-bold disabled:opacity-60"
          >
            {busy ? '読み込み中…' : '読み込む'}
          </button>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        <div className="space-y-4">
          {previewUrl ? (
            <div className="card overflow-hidden">
              <div className="text-mute text-xs mb-2">プレビュー</div>
              <img src={previewUrl} alt="preview" className="rounded-lg w-full object-contain max-h-[360px] bg-[#11161f]" />
            </div>
          ) : (
            <div className="card">
              <div className="text-mute text-sm">まだ画像がありません。左のボックスにドロップしてね。</div>
            </div>
          )}

          {result && (
            <div className="card">
              <div className="grid md:grid-cols-2 gap-3">
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
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
