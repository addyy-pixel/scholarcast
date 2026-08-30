import React, { useState } from 'react';
import { 
  Database, 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RotateCcw, 
  Code, 
  Server,
  Sparkles,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { dbService, SUPABASE_SQL_SCHEMA } from '../services/db';

export default function DbConnectModal({ isOpen, onClose, onDbUpdated }) {
  const [activeTab, setActiveTab] = useState('sql'); // 'sql' | 'import' | 'export'
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    const jsonStr = dbService.exportJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campuscast_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportJson = (e) => {
    e.preventDefault();
    setImportStatus(null);

    const res = dbService.importJson(jsonInput);
    if (res.success) {
      setImportStatus({ type: 'success', message: 'Database imported successfully!' });
      if (onDbUpdated) onDbUpdated();
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setImportStatus({ type: 'error', message: res.error });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the database to initial demo state?')) {
      dbService.resetToDefaults();
      if (onDbUpdated) onDbUpdated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Database & Supabase Configuration</h3>
              <p className="text-xs text-slate-400">Export SQL schemas or import your custom school database</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'sql' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Supabase SQL Script</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'import' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Database JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'export' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Reset</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-300 space-y-1">
                <div className="font-bold text-indigo-200">Supabase / PostgreSQL Ready Schema</div>
                Copy and run this SQL script in your Supabase SQL Editor to instantly provision PostgreSQL tables for production deployment.
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono text-emerald-400 max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
                
                <button
                  onClick={handleCopySql}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <form onSubmit={handleImportJson} className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300">
                Paste your custom database JSON structure here to populate students, teachers, and announcements instantly.
              </div>

              {importStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  importStatus.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {importStatus.message}
                </div>
              )}

              <textarea
                rows={8}
                placeholder='Paste database JSON e.g. { "users": [...], "messages": [...] }'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-white placeholder-slate-600 outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import Custom Database</span>
              </button>
            </form>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-white">Export Local Backup</h4>
                <p className="text-xs text-slate-400">Download the complete database snapshot (users, filters, broadcasts, registrations) as a JSON file.</p>
                <button
                  onClick={handleExportJson}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-3">
                <h4 className="font-bold text-sm text-rose-300">Reset to Demo Defaults</h4>
                <p className="text-xs text-slate-400">Restores initial seed records (Ananya, Mrs. Sharma, Dr. Vinod Rana, and initial messages).</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Database</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
