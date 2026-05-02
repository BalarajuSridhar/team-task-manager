import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { HiClipboardList, HiClock, HiCheckCircle, HiExclamation } from 'react-icons/hi';

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

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div></div>;

  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  const todo = myTasks.filter(t => t.status === 'TODO');
  const inProgress = myTasks.filter(t => t.status === 'IN_PROGRESS');
  const done = myTasks.filter(t => t.status === 'DONE');
  const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');

  const chartData = [
    { name: 'Todo', value: todo.length, color: COLORS.TODO },
    { name: 'In Progress', value: inProgress.length, color: COLORS.IN_PROGRESS },
    { name: 'Done', value: done.length, color: COLORS.DONE },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here’s your task overview</p>
      </motion.div>

      {/* Status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <motion.div whileHover={{ y: -5 }} className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30"><HiClipboardList className="text-indigo-600 text-2xl" /></div>
          <div>
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold">{myTasks.length}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30"><HiClock className="text-blue-600 text-2xl" /></div>
          <div>
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-3xl font-bold">{inProgress.length}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30"><HiCheckCircle className="text-green-600 text-2xl" /></div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold">{done.length}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ y: -5 }} className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30"><HiExclamation className="text-red-600 text-2xl" /></div>
          <div>
            <p className="text-sm text-gray-500">Overdue</p>
            <p className="text-3xl font-bold text-red-500">{overdue.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Chart & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card lg:col-span-2 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Your Progress</h3>
          {myTasks.length > 0 ? (
            <PieChart width={300} height={250}>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p className="text-gray-400 text-center py-10">No tasks assigned to you yet</p>
          )}
        </div>

        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {myTasks.filter(t => t.dueDate).slice(0, 5).map(task => {
              const dueDate = new Date(task.dueDate);
              const isOverdue = dueDate < new Date();
              return (
                <div key={task.id} className={`p-3 rounded-lg border ${isOverdue ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                  <p className="font-medium">{task.title}</p>
                  <p className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                    {dueDate.toLocaleDateString()} - {isOverdue ? 'Overdue' : 'Upcoming'}
                  </p>
                </div>
              );
            })}
            {myTasks.filter(t => t.dueDate).length === 0 && (
              <p className="text-gray-400 text-center py-6">No deadlines</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/projects" className="btn-primary inline-block">
          View All Projects →
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;