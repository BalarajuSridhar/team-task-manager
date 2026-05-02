import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { HiArrowLeft, HiViewGrid, HiViewList, HiUserAdd, HiX } from 'react-icons/hi';

const columns = {
  TODO: { title: 'To Do', color: 'bg-gray-200 dark:bg-gray-700', textColor: 'text-gray-800 dark:text-gray-200' },
  IN_PROGRESS: { title: 'In Progress', color: 'bg-blue-200 dark:bg-blue-900', textColor: 'text-blue-800 dark:text-blue-200' },
  DONE: { title: 'Done', color: 'bg-green-200 dark:bg-green-900', textColor: 'text-green-800 dark:text-green-200' },
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban');
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
    if (user?.role === 'ADMIN') fetchUsers();
  }, [user]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggableId ? { ...task, status: destination.droppableId } : task
    );
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggableId}`, { status: destination.droppableId });
      toast.success('Task moved');
    } catch (err) {
      toast.error('Failed to update task');
      fetchProject();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl text-gray-500">Project not found</p>
        <Link to="/projects" className="btn-primary mt-4 inline-flex">Back to Projects</Link>
      </div>
    );
  }

  const projectMemberIds = project.members.map((m) => m.userId);
  const availableUsers = allUsers.filter((u) => !projectMemberIds.includes(u.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="btn-ghost p-2 rounded-lg">
            <HiArrowLeft className="text-xl" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {tasks.length} task{tasks.length !== 1 && 's'} • {project.members.length} member{project.members.length !== 1 && 's'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('kanban')}
            className={`btn ${view === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <HiViewGrid className="text-lg" /> Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <HiViewList className="text-lg" /> List
          </button>
        </div>
      </div>

      {/* Team Members (Admin only) */}
      {user.role === 'ADMIN' && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Members</h2>
          <div className="space-y-2 mb-4">
            {project.members.map((m) => (
              <div key={m.userId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{m.user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{m.user.name}</p>
                    <p className="text-xs text-gray-500">{m.user.email}</p>
                  </div>
                  {m.role === 'ADMIN' && (
                    <span className="badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                      Admin
                    </span>
                  )}
                </div>
                {m.role !== 'ADMIN' && (
                  <button
                    onClick={() => handleRemoveMember(m.userId)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <HiX className="text-lg" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddMember} className="flex gap-3">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="input flex-1"
              required
            >
              <option value="">Select a user to add...</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <button type="submit" className="btn-primary">
              <HiUserAdd className="text-lg" /> Add
            </button>
          </form>
        </div>
      )}

      {/* Task Form (Admin only) */}
      {user.role === 'ADMIN' && (
        <TaskForm projectId={id} members={project.members} onTaskCreated={fetchProject} />
      )}

      {/* Kanban or List view */}
      {view === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {Object.entries(columns).map(([status, col]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4"
                  >
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${col.color} ${col.textColor}`}>
                      {col.title} ({tasks.filter((t) => t.status === status).length})
                    </div>
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
        <div className="card overflow-x-auto mt-6">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-4 font-medium text-gray-500">Task</th>
                <th className="text-left p-4 font-medium text-gray-500">Priority</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-left p-4 font-medium text-gray-500">Assignee</th>
                <th className="text-left p-4 font-medium text-gray-500">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{task.title}</td>
                  <td className="p-4">
                    <span className={`badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </td>
                  <td className="p-4">
                    <span className={`badge-${task.status === 'TODO' ? 'todo' : task.status === 'IN_PROGRESS' ? 'progress' : 'done'}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{task.assignee?.name || 'Unassigned'}</td>
                  <td className="p-4 text-sm text-gray-500">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No tasks yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;