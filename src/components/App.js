import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Profile from "./authentication/Profile";
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

          {/* Drive */}

          {/* Profile */}
          {/* react-router-dom v6 implementation of PrivateRouter */}
          <Route path='/user' element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }></Route>
          <Route path='/update-profile' element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          }></Route>

          {/* Auth */}
          <Route path='/signup' element={<Signup />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
