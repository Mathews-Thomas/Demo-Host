import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Home from './pages/Home';
import Register from './pages/Register';
import CreateProject from './pages/CreateProject';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
       <Route path="/" element={<Home />} />   {/* Root route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/projects/new" element={<CreateProject />} /> 
      <Route path="/projects/:id" element={<ProjectDetails />} />
    </Routes>
  );
}

export default App;
