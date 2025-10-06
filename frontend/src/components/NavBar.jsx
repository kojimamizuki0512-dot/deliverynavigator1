import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 bg-app/80 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-brand/20 flex items-center justify-center text-brand font-bold">DN</div>
          <div className="font-semibold">Delivery Navigator</div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive}) => isActive ? "text-brand" : "opacity-80 hover:opacity-100"}>ホーム</NavLink>
          <NavLink to="/upload" className={({isActive}) => isActive ? "text-brand" : "opacity-80 hover:opacity-100"}>読み込み</NavLink>
          <NavLink to="/records" className={({isActive}) => isActive ? "text-brand" : "opacity-80 hover:opacity-100"}>記録</NavLink>
        </nav>
      </div>
    </header>
  );
}
