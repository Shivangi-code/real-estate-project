import React from "react";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
  <Navbar />
  <div style={{ flex: 1 }}>
    {children}
  </div>
  </div>
  );
}

export default MainLayout;