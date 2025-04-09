import React from 'react';
import Navbar from "../../components/common/Navbar";

const ExportPage = () => {

    const handleLogout = () => {
      console.log("logging out..");
    };
  //navigation "items" for export page
  const exportNavItems = [
    { label: "Dashboard", path: "/dashboard"},
    { label: "Profile", path: "/profile"},
    { label: "Logout", path: handleLogout}
  ];
  return (
    <div>
      <Navbar
        title="StudyPlatform"
        navItems={exportNavItems}
        onLogout={handleLogout}
      />

      <main>
        <h1>Export Results</h1>
        <p>This page will allow you to export study results</p>
      </main>
    </div>
  )
}

export default ExportPage