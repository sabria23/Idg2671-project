import React from 'react';
import './dahs-styles.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <button>Studies</button>
        <button>Participants</button>
        <button>Settings</button>
      </nav>

      <main className="main-content">
        {/* Conditional rendering based on whether studies exist */}
        <div className="empty-dashboard">
          <p>No studies created yet. Click here to create your first study!</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
