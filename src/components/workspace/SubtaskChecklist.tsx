import React, { useState } from 'react';
import { ChecklistItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  CheckSquare2,
  Square,
  Plus,
  Trash2,
  ListCheck,
} from 'lucide-react';

interface SubtaskChecklistProps {
  taskId: string;
  checklist: ChecklistItem[];
}

export const SubtaskChecklist: React.FC<SubtaskChecklistProps> = ({
  taskId,
  checklist = [],
}) => {
  const { addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useAppStore();
  const [newText, setNewText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    addChecklistItem(taskId, newText.trim());
    setNewText('');
  };

  const total = checklist.length;
  const completed = checklist.filter((item) => item.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListCheck className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Action Items & Sub-tasks
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">
            {completed}/{total}
          </span>
          <span
            className={`font-mono font-bold px-2 py-0.5 rounded-full text-[11px] ${
              percentage === 100
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-dark-800 text-purple-300'
            }`}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* New Item Input */}
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add actionable subtask... (press Enter)"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="flex-1 bg-dark-850 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!newText.trim()}
          className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* Checklist Items List */}
      <div className="space-y-2">
        {checklist.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-3 italic">
            No subtasks yet. Break down complex coursework into actionable milestones.
          </div>
        ) : (
          checklist.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                item.completed
                  ? 'bg-dark-900/60 border-slate-850 text-slate-400'
                  : 'bg-dark-850 border-slate-700/60 text-slate-200 hover:border-slate-600'
              }`}
            >
              <button
                onClick={() => toggleChecklistItem(taskId, item.id)}
                className="flex items-center gap-2.5 text-left flex-1 min-w-0"
              >
                {item.completed ? (
                  <CheckSquare2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 hover:text-purple-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs select-none break-words ${
                    item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                  }`}
                >
                  {item.text}
                </span>
              </button>

              <button
                onClick={() => deleteChecklistItem(taskId, item.id)}
                className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors ml-2"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

