import { createContext, useContext, useState } from "react";


const initialValues={
    isSidebarOpen:false,
    toggleSidebar:()=>{}
}

const sidebarContext = createContext(initialValues);

const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(isSidebarOpen=>!isSidebarOpen);
  }



  return (
    <sidebarContext.Provider value={{isSidebarOpen,toggleSidebar, setIsSidebarOpen}}>
      {children}
    </sidebarContext.Provider>
  );

}

function useSidebar() {
  const context = useContext(sidebarContext);
  return context;
}

export { SidebarProvider, useSidebar };