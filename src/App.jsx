import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import Dashboard from './pages/Dashboard';
import CommandeClient from './pages/CommandeClient'; 
import ProtectedRoute from './Route/ProtectedRoute';
import Reporting from './pages/Reporting';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/commande-client"
        element={
          <ProtectedRoute>
            <CommandeClient />
          </ProtectedRoute>
        }
      />
    

        <Route
           path="/reporting"
           element={
            <ProtectedRoute>
              <Reporting />
             </ProtectedRoute>
   }
         />


      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}
