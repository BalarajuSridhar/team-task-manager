import { HiFlag, HiUser, HiCalendar, HiPencil, HiSelector } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const priorityColors = {
  HIGH: 'text-red-500',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-green-500',
};

const priorityBadges = {
  HIGH: 'badge-high',
  MEDIUM: 'badge-medium',
  LOW: 'badge-low',
};

const TaskCard = ({ task, provided, onUpdate, allMembers }) => {
  const [showActions, setShowActions] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      toast.success('Status updated');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const handleAssigneeChange = async (userId) => {
    try {
      await api.put(`/tasks/${task.id}`, { assignedTo: userId || null });
      toast.success('Assignee updated');
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      onClick={() => setShowActions(!showActions)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 dark:border-gray-700 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white flex-1">{task.title}</h4>
        <span className="flex items-center gap-1">
          <HiFlag className={`text-sm ${priorityColors[task.priority]}`} />
          <span className={`text-xs ${priorityBadges[task.priority]}`}>{task.priority}</span>
        </span>
      </div>

      {/* Meta info */}
      <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <HiUser className="text-indigo-400" />
            <span>{task.assignee.name}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <HiCalendar className={new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-gray-400'} />
            <span className={new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : ''}>
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </span>
          </div>
        )}
      </div>

      {/* Quick actions */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2" onClick={(e) => e.stopPropagation()}>
          {/* Status dropdown */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Assignee dropdown */}
          {allMembers && allMembers.length > 0 && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Assignee</label>
              <select
                value={task.assignedTo || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <option value="">Unassigned</option>
                {allMembers.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Click indicator */}
      <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <HiPencil className="text-xs text-gray-400" />
      </div>
    </div>
  );
};

export default TaskCard;