import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/projects');  // If the user is logged in, redirect to projects
    } else {
      navigate('/login');     // If not logged in, redirect to login
    }
  }, [navigate]);

  return null; 
};

export default Home;
