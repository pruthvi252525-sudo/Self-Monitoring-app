import React, { useState, useRef } from 'react';
import { WorkspaceAsset } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  X,
  Upload,
  Link,
} from 'lucide-react';

interface AssetGalleryProps {
  taskId: string;
  assets: WorkspaceAsset[];
}

export const AssetGallery: React.FC<AssetGalleryProps> = ({ taskId, assets }) => {
  const { addAsset, deleteAsset } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [lightboxAsset, setLightboxAsset] = useState<WorkspaceAsset | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlName, setUrlName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const sizeKb = Math.round(file.size / 1024);
      addAsset(taskId, {
        name: file.name,
        url: result,
        type: file.type.includes('image') ? 'image' : 'diagram',
        size: `${sizeKb} KB`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    addAsset(taskId, {
      name: urlName.trim() || 'Diagram / Architecture Slide',
      url: imageUrl.trim(),
      type: 'diagram',
      size: 'Web Asset',
    });

    setUrlName('');
    setImageUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-100">
            Visual Assets & Diagrams Gallery
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-dark-800 text-slate-400 border border-slate-700">
            {assets?.length || 0}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            title="Add via Image URL"
          >
            <Link className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add URL</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Add URL form */}
      {showUrlInput && (
        <form
          onSubmit={handleAddUrl}
          className="p-3 rounded-xl bg-dark-850 border border-slate-700/70 space-y-2.5 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Asset title (e.g. Architecture Flowchart)"
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              required
              placeholder="Image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
            >
              Add Image
            </button>
          </div>
        </form>
      )}

      {/* Asset Grid */}
      {(!assets || assets.length === 0) && !showUrlInput ? (
        <div className="text-slate-400 text-xs text-center py-6 italic border border-dashed border-slate-800 rounded-xl">
          No screenshots, slides, or state machine diagrams uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {assets?.map((asset) => (
            <div
              key={asset.id}
              className="group relative rounded-xl overflow-hidden bg-dark-850 border border-slate-700/50 hover:border-emerald-500/50 transition-all aspect-video flex flex-col justify-end"
            >
              <img
                src={asset.url}
                alt={asset.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Hover actions */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setLightboxAsset(asset)}
                  className="p-1 rounded bg-black/60 hover:bg-black/80 text-white"
                  title="View Larger"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteAsset(taskId, asset.id)}
                  className="p-1 rounded bg-black/60 hover:bg-red-600/80 text-white"
                  title="Remove Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Caption */}
              <div className="relative z-10 p-2 text-left">
                <p className="text-[11px] font-semibold text-white truncate drop-shadow">
                  {asset.name}
                </p>
                {asset.size && (
                  <p className="text-[10px] text-slate-300 font-mono drop-shadow">
                    {asset.size}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setLightboxAsset(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-dark-800 text-slate-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={lightboxAsset.url}
              alt={lightboxAsset.name}
              className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-700"
            />
            <p className="text-sm font-semibold text-white mt-3 font-mono">
              {lightboxAsset.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

