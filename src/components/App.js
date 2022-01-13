import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Signup from "./authentication/Signup";
import Login from "./authentication/Login";
import PrivateRoute from "./authentication/PrivateRoute";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";

function App() {
  return (

    <Router>
      <AuthProvider>
        <Routes>
          {/* react-router-dom v6 implementation of PrivateRouter */}
          <Route path='/' element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }></Route>
          <Route path='/update-profile' element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }></Route>
          <Route path='/signup' element={<Signup />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
