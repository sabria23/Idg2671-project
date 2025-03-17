import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage/Homepage.jsx";
import Dashboard from "./Pages/Dashboard/dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="homepage" element={<Homepage/>}></Route>
        <Route path="homepage" element={<Dashboard/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
