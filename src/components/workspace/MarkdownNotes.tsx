import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Edit3, Eye, Columns, CheckSquare, Save } from 'lucide-react';

interface MarkdownNotesProps {
  taskId: string;
  notes: string;
}

export const MarkdownNotes: React.FC<MarkdownNotesProps> = ({ taskId, notes }) => {
  const { updateTaskNotes } = useAppStore();
  const [content, setContent] = useState(notes || '');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [savedIndicator, setSavedIndicator] = useState(false);

  // Sync state if task changes
  React.useEffect(() => {
    setContent(notes || '');
  }, [taskId, notes]);

  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    updateTaskNotes(taskId, newVal);
    setSavedIndicator(true);
    setTimeout(() => setSavedIndicator(false), 800);
  };

  // Helper to render markdown tokens cleanly
  const renderMarkdown = (text: string) => {
    if (!text.trim()) {
      return (
        <div className="text-slate-400 italic text-xs py-8 text-center">
          No notes recorded yet. Write lecture notes, architecture decisions, pseudocode, or formulas here.
        </div>
      );
    }

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, idx) => {
      // Code block start/end
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${idx}`} className="my-3 rounded-xl bg-dark-950 border border-slate-800 p-3 overflow-x-auto font-mono text-xs text-indigo-300">
              <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">{codeLanguage || 'code'}</div>
              <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
            </div>
          );
          inCodeBlock = false;
          codeBlockLines = [];
          codeLanguage = '';
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '');
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-sm font-bold text-slate-200 mt-3 mb-1.5 border-b border-slate-800 pb-1">
            {line.replace('### ', '')}
          </h4>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={idx} className="text-base font-bold text-indigo-300 mt-4 mb-2 border-b border-slate-800 pb-1">
            {line.replace('## ', '')}
          </h3>
        );
        return;
      }
      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={idx} className="text-lg font-extrabold text-slate-100 mt-4 mb-2">
            {line.replace('# ', '')}
          </h2>
        );
        return;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={idx} className="border-l-2 border-indigo-500 pl-3 py-1 my-2 bg-indigo-500/5 text-xs text-slate-300 italic rounded-r">
            {line.replace('> ', '')}
          </blockquote>
        );
        return;
      }

      // Checklists
      if (line.trim().startsWith('- [ ] ')) {
        elements.push(
          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 py-0.5 font-mono">
            <span className="w-3.5 h-3.5 rounded border border-slate-600 inline-block" />
            <span>{line.replace('- [ ] ', '')}</span>
          </div>
        );
        return;
      }
      if (line.trim().startsWith('- [x] ')) {
        elements.push(
          <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 line-through py-0.5 font-mono">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>{line.replace('- [x] ', '')}</span>
          </div>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 py-0.5">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      // Regular paragraph with inline formatting
      elements.push(
        <p key={idx} className="text-xs text-slate-300 leading-relaxed">
          {line}
        </p>
      );
    });

    if (inCodeBlock && codeBlockLines.length > 0) {
      elements.push(
        <div key="trailing-code" className="my-3 rounded-xl bg-dark-950 border border-slate-800 p-3 overflow-x-auto font-mono text-xs text-indigo-300">
          <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[480px]">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-dark-850 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Markdown Documentation</span>
          {savedIndicator && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <Save className="w-3 h-3" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center bg-dark-800 rounded-lg p-0.5 border border-slate-700/60">
          <button
            onClick={() => setViewMode('edit')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              viewMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Edit only"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Write</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split view"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Preview only"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Column */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex-1 p-4 flex flex-col ${viewMode === 'split' ? 'border-r border-slate-800' : ''}`}>
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="# Task Notes & Architecture&#10;&#10;- Objectives&#10;- Formulas & theorems&#10;&#10;```go&#10;// Code snippets&#10;```"
              className="w-full h-full bg-transparent resize-none font-mono text-xs text-slate-200 focus:outline-none placeholder:text-slate-600 leading-relaxed"
            />
          </div>
        )}

        {/* Preview Column */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 p-4 overflow-y-auto bg-dark-850/40 space-y-1">
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  );
};

