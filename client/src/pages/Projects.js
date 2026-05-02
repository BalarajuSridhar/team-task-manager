import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiPlus, HiTrash, HiUsers } from 'react-icons/hi';

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    try {
      await api.post('/projects', { name: newProjectName.trim() });
      setNewProjectName('');
      toast.success('Project created');
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="btn-ghost p-2 rounded-lg">
            <HiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {projects.length} project{projects.length !== 1 && 's'}
            </p>
          </div>
        </div>
      </div>

      {/* Create project (Admin only) */}
      {user.role === 'ADMIN' && (
        <form onSubmit={handleCreate} className="card p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter new project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="input flex-1"
              required
            />
            <button type="submit" className="btn-primary">
              <HiPlus className="text-lg" />
              Create
            </button>
          </div>
        </form>
      )}

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-medium text-gray-900 dark:text-white">No projects found</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {user.role === 'ADMIN'
              ? 'Create your first project above.'
              : 'Ask your admin to add you to a project.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -4 }}
              className="card p-6 group relative"
            >
              <Link
                to={`/projects/${project.id}`}
                className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {project.name}
              </Link>
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <HiUsers className="text-base" />
                <span>{project.members.length} member{project.members.length !== 1 && 's'}</span>
              </div>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => handleDelete(project.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete project"
                >
                  <HiTrash className="text-lg" />
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