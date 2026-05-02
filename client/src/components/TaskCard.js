import { formatDistanceToNow } from 'date-fns';
import { HiFlag } from 'react-icons/hi';

const priorityColors = {
  HIGH: 'text-red-500',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-green-500',
};

const TaskCard = ({ task, provided }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 dark:border-gray-700 group"
    >
      <div className="flex items-start justify-between">
        <h4 className="font-semibold text-sm">{task.title}</h4>
        <HiFlag className={`${priorityColors[task.priority]} text-sm`} />
      </div>
      {task.dueDate && (
        <p className={`text-xs mt-2 ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
          {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
        </p>
      )}
      <p className="text-xs text-gray-400 mt-1">{task.assignee?.name || 'Unassigned'}</p>
    </div>
  );
};

export default TaskCard;