import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import {
  HiArrowLeft,
  HiViewGrid,
  HiViewList,
  HiUserAdd,
  HiX,
  HiSearch,
  HiUsers,
  HiClipboardList,
} from 'react-icons/hi';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

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

  const filteredTasks = tasks.filter((task) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      (task.description || '').toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query) ||
      (task.assignee?.name || '').toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <HiClipboardList className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-xl font-medium text-gray-900 dark:text-white">Project not found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">The project you're looking for doesn't exist or has been deleted.</p>
        <Link to="/projects" className="btn-primary mt-6 inline-flex">
          <HiArrowLeft className="text-lg" /> Back to Projects
        </Link>
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
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <HiClipboardList className="text-base" />
                {tasks.length} task{tasks.length !== 1 && 's'}
              </span>
              <span className="flex items-center gap-1">
                <HiUsers className="text-base" />
                {project.members.length} member{project.members.length !== 1 && 's'}
              </span>
            </div>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <HiUsers className="text-indigo-500" />
            Team Members
          </h2>
          
          {project.members.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No members yet. Add someone to get started.
            </p>
          ) : (
            <div className="space-y-2 mb-4">
              {project.members.map((m) => (
                <div
                  key={m.userId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {m.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {m.user.name}
                        {m.userId === user.id && (
                          <span className="text-xs text-indigo-500 ml-1">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{m.user.email}</p>
                    </div>
                    {m.role === 'ADMIN' && (
                      <span className="badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs">
                        Admin
                      </span>
                    )}
                  </div>
                  {m.role !== 'ADMIN' && (
                    <button
                      onClick={() => {
                        setMemberToRemove(m.userId);
                        setShowConfirm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <HiX className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {availableUsers.length > 0 ? (
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
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">
              All registered users are already in this project.
            </p>
          )}
        </div>
      )}

      {/* Task Form (Admin only) */}
      {user.role === 'ADMIN' && (
        <TaskForm projectId={id} members={project.members} onTaskCreated={fetchProject} />
      )}

      {/* Search Bar */}
      {tasks.length > 0 && (
        <div className="relative mb-6">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search tasks by title, priority, status, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-icon"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <HiX className="text-lg" />
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {filteredTasks.length === 0 && !loading ? (
        <div className="text-center py-16">
          <HiClipboardList className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          {searchQuery ? (
            <>
              <p className="text-lg font-medium text-gray-900 dark:text-white">No tasks match your search</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Try a different search term</p>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900 dark:text-white">No tasks yet</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {user.role === 'ADMIN'
                  ? 'Create your first task using the form above.'
                  : 'Ask your admin to create tasks for this project.'}
              </p>
            </>
          )}
        </div>
      ) : view === 'kanban' ? (
        /* Kanban View */
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(columns).map(([status, col]) => {
              const columnTasks = filteredTasks.filter((t) => t.status === status);
              return (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-4 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-300 dark:ring-indigo-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${col.color} ${col.textColor}`}>
                          {col.title}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {columnTasks.length}
                        </span>
                      </div>
                      <div className="space-y-3 min-h-[200px]">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowModal(true);
                                  }}
                                >
                                  <TaskCard
                                    task={task}
                                    allMembers={project.members}
                                    onUpdate={fetchProject}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        /* List View */
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left p-4 font-medium text-gray-500 text-sm">Task</th>
                <th className="text-left p-4 font-medium text-gray-500 text-sm">Priority</th>
                <th className="text-left p-4 font-medium text-gray-500 text-sm">Status</th>
                <th className="text-left p-4 font-medium text-gray-500 text-sm">Assignee</th>
                <th className="text-left p-4 font-medium text-gray-500 text-sm">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowModal(true);
                  }}
                >
                  <td className="p-4">
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{task.description}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`badge-${
                        task.status === 'TODO' ? 'todo' : task.status === 'IN_PROGRESS' ? 'progress' : 'done'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-600">
                            {task.assignee.name.charAt(0)}
                          </span>
                        </div>
                        {task.assignee.name}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {task.dueDate ? (
                      <span className={new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : ''}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Edit Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={fetchProject}
        allMembers={project?.members || []}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          handleRemoveMember(memberToRemove);
          setShowConfirm(false);
        }}
        title="Remove Member"
        message="Are you sure you want to remove this member from the project? They will lose access to all tasks."
      />
    </div>
  );
};

export default ProjectDetail;