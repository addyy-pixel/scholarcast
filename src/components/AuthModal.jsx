import React, { useState } from 'react';
import { X, LogIn, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/db';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!id || !password) {
      setError('Please enter your Generated ID and Password.');
      return;
    }

    const res = dbService.loginWithRoleDetection(id, password);
    if (res.success) {
      setSuccess(`Authenticated as ${res.user.name} (${res.role.toUpperCase()})`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.role);
        onClose();
      }, 500);
    } else {
      setError(res.message);
    }
  };

  const setDemoAccount = (demoId, demoPass) => {
    setId(demoId);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">CampusCast Unified Sign In</h3>
              <p className="text-xs text-slate-400">System automatically detects your Student or Teacher role</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start space-x-2 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Generated ID (Student / Teacher / Admin)
              </label>
              <input
                type="text"
                placeholder="e.g. CC-STU-1001 or CC-TCH-2001"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center space-x-2"
            >
              <span>Sign In & Detect Role</span>
              <LogIn className="w-4 h-4" />
            </button>

            {/* Quick Fill Helpers */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" /> One-Click Quick Fill Demo Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoAccount('CC-STU-1001', 'passAnanya123')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-emerald-400">Ananya (Student)</div>
                  <div className="text-[10px] text-slate-400 font-mono">CC-STU-1001</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoAccount('CC-TCH-2001', 'passTeacher123')}
                  className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-colors"
                >
                  <div className="font-bold text-xs text-blue-400">Mrs. Sharma (Teacher)</div>
                  <div className="text-[10px] text-slate-400 font-mono">CC-TCH-2001</div>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
