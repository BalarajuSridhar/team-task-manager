import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const TaskForm = ({ projectId, members, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');   // user ID or empty
  const [priority, setPriority] = useState('MEDIUM');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        projectId,
        assignedTo: assignedTo || null,   // empty string becomes null
      });
      toast.success('Task created');
      if (onTaskCreated) onTaskCreated(res.data);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignedTo('');
      setPriority('MEDIUM');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6 space-y-4">
      <h3 className="text-xl font-semibold">Add New Task</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
        >
          <option value="">-- Unassigned --</option>
          {members?.map((member) => (
            <option key={member.userId} value={member.userId}>
              {member.user.name} ({member.user.email})
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition"
        rows="2"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;