import React from 'react'
import Navbar from '../../components/common/Navbar'

const ProfilePage = () => {
    const handleLogout = () => {
        console.log("logging out...");
    }
    const dashboardNavItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Logout", action: handleLogout }
    ];

  return (
   
    <>
        <Navbar 
        title="StudyPlatform"
        navItems={dashboardNavItems}
        onLogout={handleLogout}/>
    </>
  )
}

export default ProfilePage