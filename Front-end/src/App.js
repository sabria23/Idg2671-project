import './App.css';
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Dashboard from "./Pages/Dashboard/dashboard.jsx";
import CreateStudyPage from './Pages/CreateStudy/createStudy.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}>
            <Route path="Dashboard" element={<Dashboard/>} />
            <Route path='CreateStudyPage' element={<CreateStudyPage/>} />
          </Route>
      </Routes>
    </BrowserRouter>
      <Dashboard/>
    </div>
    
  
    
  );
}

export default App;
