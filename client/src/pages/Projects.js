import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName });
      setNewProjectName('');
      toast.success('Project created');
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Error deleting project');
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user.role === 'ADMIN' && (
          <form onSubmit={handleCreate} className="mt-4 sm:mt-0 flex gap-2">
            <input
              type="text"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="flex-1 p-3 rounded-xl border dark:bg-gray-800 dark:border-gray-700"
              required
            />
            <button type="submit" className="btn-primary py-3">Create</button>
          </form>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl">No projects found.</p>
          {user.role === 'ADMIN' ? (
            <p className="mt-2">Create your first project above.</p>
          ) : (
            <p className="mt-2">Ask your admin to add you to a project.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <motion.div whileHover={{ y: -5 }} key={project.id} className="glass-card group">
              <Link to={`/projects/${project.id}`} className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                {project.name}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{project.members.length} members</p>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => handleDelete(project.id)}
                  className="mt-3 text-red-500 hover:underline text-sm opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;