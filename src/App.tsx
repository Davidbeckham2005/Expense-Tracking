import DashBroad from './Features/Dashbroad';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
export default function App() {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<DashBroad />} />
      </Routes>
    </BrowserRouter >
  );
}