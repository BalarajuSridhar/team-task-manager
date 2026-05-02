import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { HiClipboardList, HiClock, HiCheckCircle, HiExclamation, HiArrowLeft } from 'react-icons/hi';

const COLORS = { TODO: '#6B7280', IN_PROGRESS: '#3B82F6', DONE: '#10B981' };

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (err) {
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const myTasks = tasks.filter((t) => t.assignedTo === user.id);
  const todo = myTasks.filter((t) => t.status === 'TODO');
  const inProgress = myTasks.filter((t) => t.status === 'IN_PROGRESS');
  const done = myTasks.filter((t) => t.status === 'DONE');
  const overdue = myTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  const chartData = [
    { name: 'To Do', value: todo.length, color: COLORS.TODO },
    { name: 'In Progress', value: inProgress.length, color: COLORS.IN_PROGRESS },
    { name: 'Done', value: done.length, color: COLORS.DONE },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/projects" className="btn-ghost p-2 rounded-lg">
          <HiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your task overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <HiClipboardList className="text-2xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{myTasks.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <HiClock className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{inProgress.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <HiCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{done.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <HiExclamation className="text-2xl text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{overdue.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Distribution</h3>
          {myTasks.length > 0 ? (
            <div className="flex justify-center">
              <PieChart width={350} height={280}>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          ) : (
            <p className="text-center text-gray-400 py-16">No tasks assigned yet</p>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deadlines</h3>
          <div className="space-y-3">
            {myTasks.filter((t) => t.dueDate).slice(0, 5).map((task) => {
              const dueDate = new Date(task.dueDate);
              const isOverdue = dueDate < new Date();
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border ${
                    isOverdue
                      ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{task.title}</p>
                  <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                    {dueDate.toLocaleDateString()} {isOverdue ? '• Overdue' : '• Upcoming'}
                  </p>
                </div>
              );
            })}
            {myTasks.filter((t) => t.dueDate).length === 0 && (
              <p className="text-center text-gray-400 py-8">No deadlines</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/projects" className="btn-primary">
          View All Projects
        </Link>
        {user.role === 'ADMIN' && (
          <Link to="/projects" className="btn-secondary">
            Create New Project
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;