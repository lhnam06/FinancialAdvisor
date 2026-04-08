import { Outlet, useLocation } from "react-router";
import { BottomNav } from "./BottomNav";

export function Layout() {
  const location = useLocation();
  const hideBottomNav = location.pathname === "/ai-advisor";
  
  return (
    <div className={`min-h-screen bg-transparent ${hideBottomNav ? "" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))]"}`}>
      <Outlet />
      {!hideBottomNav && <BottomNav currentPath={location.pathname} />}
    </div>
  );
}
