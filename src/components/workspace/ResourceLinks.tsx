import React, { useState } from 'react';
import { ResourceLink } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  Link2,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Check,
  GitBranch,
  BookOpen,
  FileText,
  Video,
  Globe,
} from 'lucide-react';

interface ResourceLinksProps {
  taskId: string;
  resources: ResourceLink[];
}

export const ResourceLinks: React.FC<ResourceLinksProps> = ({ taskId, resources }) => {
  const { addResourceLink, deleteResourceLink } = useAppStore();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<ResourceLink['category']>('docs');
  const [note, setNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    addResourceLink(taskId, {
      title: title.trim() || cleanUrl,
      url: cleanUrl,
      category,
      note: note.trim(),
    });

    setTitle('');
    setUrl('');
    setNote('');
    setIsAdding(false);
  };

  const handleCopy = (resId: string, linkUrl: string) => {
    navigator.clipboard.writeText(linkUrl);
    setCopiedId(resId);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const getCategoryIcon = (cat?: ResourceLink['category']) => {
    switch (cat) {
      case 'github':
        return <GitBranch className="w-4 h-4 text-emerald-400" />;
      case 'paper':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-pink-400" />;
      case 'docs':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      default:
        return <Globe className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Resource Links & Documentation
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dark-800 text-slate-400 border border-slate-700">
            {resources?.length || 0}
          </span>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Link</span>
        </button>
      </div>

      {/* Add Link Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-3.5 rounded-xl bg-dark-850 border border-slate-700/70 space-y-3 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Link Title
              </label>
              <input
                type="text"
                placeholder="e.g., Raft Paper (PDF)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResourceLink['category'])}
                className="w-full bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="docs">Documentation</option>
                <option value="github">GitHub Repo / PR</option>
                <option value="paper">Research Paper</option>
                <option value="video">Lecture Video</option>
                <option value="general">Web Resource</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              URL <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="https://github.com/... or https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              Note (Optional context or section to check)
            </label>
            <input
              type="text"
              placeholder="e.g., Reference Section 4 for leader election logic"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Save Link
            </button>
          </div>
        </form>
      )}

      {/* Links List Cards */}
      <div className="space-y-2.5">
        {(!resources || resources.length === 0) && !isAdding ? (
          <div className="text-slate-400 text-xs text-center py-4 italic">
            No reference materials or GitHub links attached.
          </div>
        ) : (
          resources?.map((res) => (
            <div
              key={res.id}
              className="p-3 rounded-xl bg-dark-850 border border-slate-700/50 hover:border-slate-600 flex items-start justify-between gap-3 transition-colors group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-2 rounded-lg bg-dark-800 border border-slate-700/60 mt-0.5 flex-shrink-0">
                  {getCategoryIcon(res.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {res.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {res.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">
                    {res.url}
                  </p>
                  {res.note && (
                    <p className="text-xs text-slate-300 mt-1 italic">
                      {res.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleCopy(res.id, res.url)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-dark-800 transition-colors"
                  title="Copy Link"
                >
                  {copiedId === res.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-dark-800 transition-colors"
                  title="Open Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => deleteResourceLink(taskId, res.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-dark-800 transition-colors"
                  title="Remove Link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
