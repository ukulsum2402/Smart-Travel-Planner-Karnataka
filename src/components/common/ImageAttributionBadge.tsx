import React, { useState } from 'react';
import { ImageMetadata } from '../../types';
import { Info, ExternalLink } from 'lucide-react';

interface Props {
  metadata: ImageMetadata;
  className?: string;
  dark?: boolean;
}

export const ImageAttributionBadge: React.FC<Props> = ({ metadata, className = '', dark = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setOpen(!open);
        }}
        title="View image attribution & Wikipedia source"
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md backdrop-blur-md transition-all shadow-sm ${
          dark
            ? 'bg-black/60 text-white/90 hover:bg-black/80'
            : 'bg-white/85 text-stone-700 hover:bg-white border border-stone-200'
        }`}
      >
        <Info className="w-3 h-3 text-emerald-500" />
        <span className="font-medium text-[10px]">Verified Photo</span>
      </button>

      {open && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute z-50 bottom-full left-0 mb-2 w-64 bg-stone-900/95 text-stone-200 text-xs p-3 rounded-xl shadow-2xl backdrop-blur-md border border-stone-700"
        >
          <div className="font-semibold text-white mb-1 flex items-center justify-between">
            <span>Image Source & Attribution</span>
            <span className="text-[10px] text-emerald-400 font-mono">{metadata.license}</span>
          </div>
          <p className="text-stone-300 text-[11px] mb-1.5">
            Credit: <span className="text-stone-100 font-medium">{metadata.photographer}</span>
          </p>
          <a
            href={metadata.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>View on Wikipedia / Wikimedia</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
