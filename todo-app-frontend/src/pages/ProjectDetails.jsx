import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');
  const [gisturl,setGistul] = useState('')
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.get(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(data);
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    toast.success('Logout successful');
    navigate('/login');
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo) return;
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post(`${backendUrl}/api/projects/${id}/todos`, { description: newTodo }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject({ ...project, todos: [...project.todos, data] });
      toast.success('Todo added');
      setNewTodo('');
      fetchProject();
    } catch (error) {
      console.error('Failed to add todo', error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${backendUrl}/api/projects/${id}/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Todo deleted');
      setProject({
        ...project,
        todos: project.todos.filter((todo) => todo._id !== todoId),
      });
      fetchProject();
    } catch (error) {
      console.error('Failed to delete todo', error);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo._id);
    setEditedTodo(todo.description);
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.put(`${backendUrl}/api/projects/${id}/todos/${editingTodo}`, {
        description: editedTodo,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTodos = project.todos.map((todo) => (todo._id === editingTodo ? data : todo));
      setProject({ ...project, todos: updatedTodos });
      toast.success('Todo updated');
      setEditingTodo(null);
      setEditedTodo('');
      fetchProject();
    } catch (error) {
      console.error('Failed to update todo', error);
    }
  };

  const handleToggleComplete = async (todoId, currentStatus) => {
    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.put(`${backendUrl}/api/projects/${id}/todos/${todoId}`, {
        status: currentStatus === 'completed' ? 'pending' : 'completed',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedTodos = project.todos.map((todo) => (todo._id === todoId ? data : todo));
      setProject({ ...project, todos: updatedTodos });
      fetchProject();
    } catch (error) {
      console.error('Failed to update todo status', error);
    }
  };

  const handleExportGist = async () => {
    try {
      // Send a POST request to the backend route for exporting the gist
      const token = localStorage.getItem('userToken'); // Assuming user is authenticated with a token
      const response = await axios.post(
        `${backendUrl}/api/projects/${id}/export`, 
        {}, // POST request body can be empty
        { headers: { Authorization: `Bearer ${token}` } } // Include auth token
      );
      
      toast.success('Project successfully exported to GitHub as a gist!');
      
      // Access the gist URL from the response
      setGistul(response.data.html_url);
      
      // Iterate over files to find the content dynamically
      const gistFiles = response.data.files;
      const fileNames = Object.keys(gistFiles);
      
      // Assuming there's only one file, access the first one
      if (fileNames.length > 0) {
        const fileName = fileNames[0]; 
        const gistContent = gistFiles[fileName].content; 
        
        // Trigger file download
        downloadMarkdownFile(gistContent, `${fileName}`);
      } else {
        console.error("No files found in the gist response.");
        toast.error('No files found in the exported gist');
      }
    } catch (error) {
      console.error('Failed to export project as gist', error);
      toast.error('Failed to export project');
    }
  };
  
  // Function to trigger download of the markdown file
  const downloadMarkdownFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  if (loading) return <p className="text-center">Loading...</p>;

  return project ? (
    <div className="max-w-4xl mx-auto py-10 px-5 border-2 my-7 rounded-md border-gray-300  shadow-md">
      <div className="flex justify-end mb-6">
        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300">
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-bold text-center mb-10">{project.title}</h1>

      <div className=" shadow-lg border-2 rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Todos</h2>
        <ul className="space-y-4 my-2 p-2">
          {project.todos.length == " " ? <p className='text-gray-500'>No Todos Found</p> : ""}
          {project.todos.map((todo) => (
            <li key={todo._id} className={`flex justify-between items-center border-2 ${todo.status === 'completed' ? 'bg-green-100 p-2 rounded-md' : 'bg-red-100 p-2 rounded-md'}`}>
              {editingTodo === todo._id ? (
                <form onSubmit={handleUpdateTodo} className="flex space-x-2 w-full">
                  <input
                    type="text"
                    value={editedTodo}
                    onChange={(e) => setEditedTodo(e.target.value)}
                    className="flex-grow border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                  <button type="submit" className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-300">
                    Update
                  </button>
                  <button onClick={() => setEditingTodo(null)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300">
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className={`flex-grow ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                    {todo.description}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditTodo(todo)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleToggleComplete(todo._id, todo.status)}
                      className={`py-1 px-2 rounded text-white ${todo.status === 'completed' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'} transition duration-300`}
                    >
                      {todo.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Form to add a new todo */}
      <form onSubmit={handleAddTodo} className="flex space-x-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New Todo"
          className="flex-grow border p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
          Add Todo
        </button>
      </form>
      <div className='my-32 text-end'>
      <button
        onClick={handleExportGist}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Export Project as Gist
      </button>
      {gisturl && (
        <div className="mt-4">
           <p>You can access the exported project using this URL:</p>
    <a href={gisturl}  rel="noopener noreferrer" className="text-blue-500 underline">
      {gisturl}
    </a>
        </div>
      )}
      </div>
      <Toaster
  position="top-center"
  reverseOrder={true}
/>
    </div>
  ) : (
    <p className="text-center ">Project not found</p>
  );
};

export default ProjectDetails;
