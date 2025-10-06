import { Outlet, NavLink, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import CockpitBar from "./components/CockpitBar";

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-app text-app-fore">
      <NavBar />
      <CockpitBar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <Outlet />
      </main>

      {/* フッターの簡易ナビ */}
      <footer className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-sm text-app-muted">
        <div className="flex gap-4">
          <NavLink className={({isActive}) => isActive ? "text-brand" : ""} to="/">ホーム</NavLink>
          <NavLink className={({isActive}) => isActive ? "text-brand" : ""} to="/upload">読み込み</NavLink>
          <NavLink className={({isActive}) => isActive ? "text-brand" : ""} to="/records">記録</NavLink>
        </div>
        <div className="mt-2 opacity-60">現在: {pathname}</div>
      </footer>
    </div>
  );
}
