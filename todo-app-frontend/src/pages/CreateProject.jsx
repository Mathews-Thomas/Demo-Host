import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken'); // Get the user token
      const { data } = await axios.post(
        `${backendUrl}/api/projects`,   // Correct POST request
        { title },
        {
          headers: { Authorization: `Bearer ${token}` }, // Send the JWT token
        }
      );
      toast("project created")
      navigate(`/projects/${data._id}`); // Redirect to the newly created project's detail page
    } catch (err) {
      toast('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="text-center my-7 mx-auto">
      <h2 className="text-3xl mb-4 font-bold">Create New Project</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleCreateProject}>
        <div className='text-center gap-7  flex flex-col w-[20rem] mx-auto my-7'>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="mb-2 p-2 border border-gray-300"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4">
          Create Project
        </button>
        </div>
      </form>
      <Toaster
  position="top-center"
  reverseOrder={true}
/>
    </div>
  );
};

export default CreateProject;
