import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Task, TaskCategory, TaskPriority } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { getTodayDateString } from '../../utils/dateUtils';
import { Clock, Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Academic');
  const [priority, setPriority] = useState<TaskPriority>('P2');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setEstimatedDuration(taskToEdit.estimatedDuration);
      setDeadline(
        taskToEdit.deadline
          ? taskToEdit.deadline.slice(0, 16)
          : `${getTodayDateString()}T18:00`
      );
    } else {
      setTitle('');
      setDescription('');
      setCategory('Academic');
      setPriority('P2');
      setEstimatedDuration(60);
      setDeadline(`${getTodayDateString()}T18:00`);
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        estimatedDuration: Number(estimatedDuration),
        deadline: deadline ? new Date(deadline).toISOString() : '',
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        estimatedDuration: Number(estimatedDuration),
        deadline: deadline ? new Date(deadline).toISOString() : '',
        status: 'todo',
      });
    }

    onClose();
  };

  const durationPresets = [15, 30, 45, 60, 90, 120];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      subtitle="Organize your coursework, engineering project, or habit"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Task Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., CS 641: Raft Distributed Consensus Lab"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Description & Context
          </label>
          <textarea
            rows={2}
            placeholder="Brief scope, lab requirements, or target outcomes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Category and Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Category</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full bg-dark-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Academic">Academic (Coursework / Research)</option>
              <option value="Dev Project">Dev Project (Coding / Architecture)</option>
              <option value="Personal">Personal (Health / Habits)</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Priority Tier</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-dark-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="P1">P1 - Urgent & Important (Immediate)</option>
              <option value="P2">P2 - High / Important (Scheduled Focus)</option>
              <option value="P3">P3 - Medium (Timebox Routine)</option>
              <option value="P4">P4 - Low / Backlog</option>
            </select>
          </div>
        </div>

        {/* Duration presets & custom input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Estimated Duration</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {durationPresets.map((mins) => (
              <button
                type="button"
                key={mins}
                onClick={() => setEstimatedDuration(mins)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
                  estimatedDuration === mins
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-dark-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={480}
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(Number(e.target.value))}
              className="w-24 bg-dark-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400">minutes</span>
          </div>
        </div>

        {/* Strict Deadline */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Strict Deadline</span>
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-dark-800 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-[0.98]"
          >
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

