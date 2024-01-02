import styles from "./AppLayout.module.css";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import User from "../components/User";

import { SidebarProvider } from "../contexts/SidebarContext";

export default function AppLayout() {

  return (
    <SidebarProvider>
      <div className={styles.app}>
        <Sidebar  />
        <Map/>
        <User />
      </div>
    </SidebarProvider>
  );
}
