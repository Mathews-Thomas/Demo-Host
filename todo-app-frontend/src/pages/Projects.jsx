import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null); // Track the project being edited
  const [inputValue, setInputValue] = useState(""); // Track the input value for updating
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchProjects = async () => {
    const token = localStorage.getItem('userToken');
    const { data } = await axios.get(`${backendUrl}/api/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    setIsEditing(true);
    try {
      const res = await axios.delete(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast(res.message || "Project deleted successfully");
      fetchProjects();
    } catch (error) {
      toast(error.message || "Error deleting project");
    } finally {
      setIsEditing(false);
    }
  };

  const handleEdit = (id, currentTitle) => {
    setEditProjectId(id); // Set the project ID to be edited
    setInputValue(currentTitle); // Set the current title as the initial input value
    setIsEditing(true);
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.put(
        `${backendUrl}/api/projects/${id}`,
        { title: inputValue }, // Update the project title
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast(res.message || "Project updated successfully");
      fetchProjects();
    } catch (error) {
      toast(error.message || "Error updating project");
    } finally {
      setIsEditing(false);
      setEditProjectId(null); // Clear edit state
      setInputValue(""); // Clear input field
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast.success('Logout successful');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 bg-gray-200 my-7 rounded-md">
      <Toaster />
      <div className="flex justify-end mb-6">
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-bold text-center mb-10">Projects</h1>

      <div className="flex justify-center mb-10">
        <Link
          to="/projects/new"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          Create New Project
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Existing Projects</h2>

        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project._id} className="flex items-center justify-between">
                <Link
                  to={`/projects/${project._id}`}
                  className="text-blue-600 hover:underline text-lg"
                >
                  {project.title}
                </Link>
                <div className="flex gap-2">
                  <button
                    className="p-2 bg-red-500 text-white rounded-md"
                    onClick={() => handleDelete(project._id)}
                  >
                    Delete
                  </button>
                  {editProjectId === project._id && isEditing ? (
                    <>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md"
                      />
                      <button
                        className="p-2 bg-green-500 text-white rounded-md"
                        onClick={() => handleUpdate(project._id)}
                      >
                        Save
                      </button>
                      <button
                        className="p-2 bg-gray-500 text-white rounded-md"
                        onClick={() => {
                          setIsEditing(false);
                          setEditProjectId(null);
                          setInputValue("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="p-2 bg-blue-500 text-white rounded-md"
                      onClick={() => handleEdit(project._id, project.title)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No projects available. Create a new project to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
