'use client';

import { useState, useRef } from 'react';
import { useHabitStore } from '@/lib/store';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';

export default function DataManager() {
  const { exportData, importData } = useHabitStore();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitgrid-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importData(text);
      setImportStatus(success ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 3000);
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-card-border rounded-lg transition-colors"
      >
        <Download size={14} />
        Export
      </button>

      <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted hover:bg-card-border rounded-lg transition-colors cursor-pointer">
        <Upload size={14} />
        Import
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </label>

      {importStatus === 'success' && (
        <span className="flex items-center gap-1 text-xs text-accent">
          <Check size={14} /> Imported!
        </span>
      )}
      {importStatus === 'error' && (
        <span className="flex items-center gap-1 text-xs text-danger">
          <AlertCircle size={14} /> Invalid file
        </span>
      )}
    </div>
  );
}
