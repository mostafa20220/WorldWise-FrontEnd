import styles from "./Sidebar.module.css";

import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import Share from "./Share";
import { useSidebar } from "../contexts/SidebarContext";

export default function Sidebar() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  return (
    <div className={`${styles.sidebar} ${isSidebarOpen ? styles.active : ""}`}>
      <button
        onClick={() => toggleSidebar()}
        className={`${styles.toggleBtn} ${isSidebarOpen ? styles.active : ""}`}
      >
        {isSidebarOpen ? "⬇" : "⬆"}{" "}
      </button>
      <Logo />
      <AppNav />

      <Outlet />

      <Share />
      <Footer />
    </div>
  );
}
