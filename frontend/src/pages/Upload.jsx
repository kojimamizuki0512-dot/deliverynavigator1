import { useRef, useState } from "react";
import { api } from "../api";

export default function Upload() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const pick = () => inputRef.current?.click();

  const onChoose = (ev) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const upload = async () => {
    if (!file) return setMsg("画像を選んでください。");
    setBusy(true);
    setMsg("");
    try {
      const res = await api.upload(file);
      setResult(res);
      setMsg("読み取りが完了しました。");
    } catch (e) {
      setMsg("アップロードに失敗しました。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="bg-app-panel rounded-2xl p-6 border border-white/5">
        <h2 className="font-semibold mb-2">実績を読み込む</h2>
        <p className="text-app-muted text-sm">
          スクショをアップロードすると、AIが金額・時間・店名などを読取り、戦略に反映します。
        </p>

        <div
          className="mt-4 border-2 border-dashed border-white/10 rounded-2xl p-6 bg-app hover:border-white/20 cursor-pointer"
          onClick={pick}
        >
          {!preview ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📷</div>
              <div className="font-medium">画像をドラッグ&ドロップ</div>
              <div className="text-app-muted text-sm mt-1">または クリックして選択</div>
            </div>
          ) : (
            <img src={preview} alt="preview" className="mx-auto max-h-72 rounded-xl" />
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChoose} />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-brand text-black/90 font-medium disabled:opacity-60"
            disabled={!file || busy}
            onClick={upload}
          >
            {busy ? "アップロード中…" : "アップロードして解析"}
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-app border border-white/10"
            onClick={() => { setFile(null); setPreview(""); setResult(null); setMsg(""); }}
          >
            クリア
          </button>
        </div>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </section>

      <section className="bg-app-panel rounded-2xl p-6 border border-white/5">
        <h3 className="font-semibold mb-3">読み取り結果</h3>
        {!result && <div className="text-app-muted text-sm">まだ結果はありません。</div>}
        {result && (
          <div className="space-y-2">
            <div className="text-sm opacity-70">raw</div>
            <pre className="text-xs bg-app rounded-xl p-3 border border-white/5 overflow-auto">
{JSON.stringify(result, null, 2)}
            </pre>
            <p className="text-xs text-app-muted">
              ＊読み取れない項目は「不明」になります（ダミー実装）
            </p>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-semibold mb-1">アップロードのコツ</h4>
          <ul className="text-sm text-app-muted list-disc list-inside space-y-1">
            <li>数字がはっきり写るよう、明るめのスクショを選ぶ</li>
            <li>アプリの「日次サマリー」の画面が最も精度が高い</li>
            <li>個人情報が含まれる場合はマスキングしてからアップ</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
