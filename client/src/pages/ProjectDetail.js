import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';

const columns = {
  TODO: { title: 'To Do', color: 'bg-gray-200 dark:bg-gray-700' },
  IN_PROGRESS: { title: 'In Progress', color: 'bg-blue-200 dark:bg-blue-900' },
  DONE: { title: 'Done', color: 'bg-green-200 dark:bg-green-900' },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban'); // kanban or list
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error('Project not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) return { ...task, status: destination.droppableId };
      return task;
    });
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success('Task moved');
    } catch (err) {
      toast.error('Failed to update task');
      fetchProject(); // rollback
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      await api.post(`/projects/${id}/members`, { userId: selectedUserId });
      toast.success('Member added');
      setSelectedUserId('');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (err) {
      toast.error('Error removing member');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (!project) return <div className="text-center mt-20 text-xl">Project not found</div>;

  // Only show users not already in project
  const projectMemberIds = project.members.map((m) => m.userId);
  const availableUsers = allUsers.filter((u) => !projectMemberIds.includes(u.id));

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/projects" className="text-indigo-500 hover:underline text-sm">← Back to Projects</Link>
          <h1 className="text-3xl font-bold mt-1">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 rounded-full text-sm ${view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-full text-sm ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            List
          </button>
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className="mb-8 glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-3">Team Members</h2>
          <ul className="mb-4 space-y-1">
            {project.members.map((m) => (
              <li key={m.userId} className="flex justify-between items-center py-1">
                <span className="flex items-center gap-2">
                  <span className="font-medium">{m.user.name}</span>
                  <span className="text-sm text-gray-500">{m.user.email}</span>
                  {m.role === 'ADMIN' && (
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Admin</span>
                  )}
                </span>
                {m.role !== 'ADMIN' && (
                  <button
                    onClick={() => handleRemoveMember(m.userId)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Add member form with user dropdown */}
          <form onSubmit={handleAddMember} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-500">Add a member</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                required
              >
                <option value="">-- Select user --</option>
                {availableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {user.role === 'ADMIN' && (
        <TaskForm projectId={id} members={project.members} onTaskCreated={fetchProject} />
      )}

      {view === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {Object.entries(columns).map(([status, col]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className={`text-lg font-semibold mb-3 px-3 py-1 rounded-full inline-block ${col.color}`}>
                      {col.title} ({tasks.filter((t) => t.status === status).length})
                    </h3>
                    <div className="space-y-3 min-h-[200px]">
                      {tasks
                        .filter((t) => t.status === status)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => <TaskCard task={task} provided={provided} />}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="glass rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Priority</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Assignee</th>
                <th className="text-left p-2">Due</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-2">{task.title}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-2">{task.status.replace('_', ' ')}</td>
                  <td className="p-2">{task.assignee?.name || '-'}</td>
                  <td className="p-2 text-sm">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="p-2">
                    {(user.role === 'ADMIN' || task.assignedTo === user.id) && (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="border rounded p-1 text-sm dark:bg-gray-700"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;