import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* react-router-dom v6 implementation of PrivateRouter */}
              <Route path='/' element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }></Route>
              <Route path='/signup' element={<Signup />} ></Route>
              <Route path='/login' element={<Login />} ></Route>
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  );
}

export default App;
