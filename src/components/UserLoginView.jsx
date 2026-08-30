import React, { useState, useEffect } from 'react';
import { LogIn, AlertCircle, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { dbService } from '../services/db';

export default function UserLoginView({ onAuthSuccess }) {
  const [idInput, setIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Trigger animation sequence on mount
    setAnimationStarted(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!idInput.trim() || !passwordInput) {
      setError('Please enter your Generated ID and Password.');
      return;
    }

    const res = dbService.loginWithRoleDetection(idInput, passwordInput);
    if (res.success) {
      if (res.role === 'admin') {
        setError('Admin logins are not allowed on the CampusCast User App. Please use the Admin Portal.');
        return;
      }

      setSuccess(`Authenticated as ${res.user.name} (${res.role.toUpperCase()})`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.role);
      }, 400);
    } else {
      setError(res.message);
    }
  };

  const setDemoAccount = (demoId, demoPass) => {
    setIdInput(demoId);
    setPasswordInput(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-scholars-950 font-sans overflow-hidden">
      
      {/* 1. Full-Screen Stage Background with Strong Blur Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-110 opacity-50 transition-all duration-1000"
        style={{ backgroundImage: `url('/stage_bg.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-scholars-950/80 via-scholars-900/85 to-scholars-950/90" />

      {/* 2. Stage Curtains Reveal Keyframe Animation (Sliding from Center Outward) */}
      <div className="fixed inset-0 pointer-events-none z-30 flex">
        {/* Left Stage Curtain */}
        <div 
          className={`w-1/2 h-full bg-gradient-to-r from-red-950 via-amber-950 to-red-900 border-r-4 border-amber-400/60 shadow-2xl relative ${
            animationStarted ? 'animate-curtain-left' : ''
          }`}
          style={{
            backgroundImage: `radial-gradient(ellipse at left, rgba(120, 20, 20, 0.9), rgba(40, 5, 5, 0.95)), url('/stage_bg.png')`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover'
          }}
        >
          {/* Curtain Velvet Folds & Gold Trim Details */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-400/40 to-transparent" />
          <div className="absolute inset-y-0 right-2 w-1 bg-amber-400/80 shadow-[0_0_15px_#f59e0b]" />
        </div>

        {/* Right Stage Curtain */}
        <div 
          className={`w-1/2 h-full bg-gradient-to-l from-red-950 via-amber-950 to-red-900 border-l-4 border-amber-400/60 shadow-2xl relative ${
            animationStarted ? 'animate-curtain-right' : ''
          }`}
          style={{
            backgroundImage: `radial-gradient(ellipse at right, rgba(120, 20, 20, 0.9), rgba(40, 5, 5, 0.95)), url('/stage_bg.png')`,
            backgroundBlendMode: 'overlay',
            backgroundSize: 'cover'
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-400/40 to-transparent" />
          <div className="absolute inset-y-0 left-2 w-1 bg-amber-400/80 shadow-[0_0_15px_#f59e0b]" />
        </div>
      </div>

      {/* 3. Centered Sleek Glassmorphic Login Dialog Box (Fades In After Curtains Part) */}
      <div className="relative z-20 w-full max-w-lg my-8 animate-glass-in">
        
        {/* School Logo & Motto Banner */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-block p-3.5 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-scholars-800/30 transform hover:scale-105 transition-all duration-300">
            <img 
              src="/scholars_home_logo.png" 
              alt="Scholars Home Logo" 
              className="h-28 sm:h-32 object-contain mx-auto"
            />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider font-serif-header uppercase drop-shadow-md">
              SCHOLARS HOME
            </h1>
            
            {/* Motto Ribbon Pill */}
            <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-sky-500/30 tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Achieve • Believe • Create</span>
            </div>

            <p className="text-xs text-blue-200/90 max-w-sm mx-auto pt-1 font-medium">
              CampusCast Broadcast System • Student & Teacher Portal
            </p>
          </div>
        </div>

        {/* Sleek Glassmorphic Card (Swiggy / Zomato Modern Styling) */}
        <div className="bg-white/90 backdrop-blur-2xl border-2 border-white/80 p-8 rounded-3xl space-y-6 soft-card-shadow-lg text-slate-800">
          
          <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-lg text-scholars-900 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-scholars-800" /> Account Sign In
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Sign in with your Admin-generated ID</p>
            </div>
            <span className="text-[10px] uppercase font-bold text-scholars-800 bg-scholars-100/80 px-3 py-1 rounded-full border border-scholars-300">
              Auto Role Detect
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-scholars-900 mb-1.5">
                Generated User ID (Student / Teacher)
              </label>
              <input
                type="text"
                placeholder="e.g. CC-STU-1001 or CC-TCH-2001"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                className="w-full bg-slate-50/80 border-2 border-slate-200 focus:border-scholars-800 focus:bg-white rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-mono outline-none transition-all uppercase shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-scholars-900 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-50/80 border-2 border-slate-200 focus:border-scholars-800 focus:bg-white rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-mono outline-none transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-scholars-800 to-scholars-900 hover:from-scholars-900 hover:to-scholars-950 text-white font-extrabold rounded-2xl shadow-lg shadow-scholars-900/30 hover:shadow-xl transition-all text-sm flex items-center justify-center space-x-2 uppercase tracking-wider transform active:scale-98"
            >
              <span>Sign In & Open Portal</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Fill Demo Buttons */}
          <div className="pt-4 border-t border-slate-200/60 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> One-Click Quick Fill Demo Account:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDemoAccount('CC-STU-1001', 'passAnanya123')}
                className="p-3 bg-scholars-50/80 hover:bg-scholars-100 border border-scholars-200 rounded-2xl text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="font-bold text-xs text-scholars-800 group-hover:text-scholars-900">Ananya (Student)</div>
                <div className="text-[10px] text-slate-500 font-mono">CC-STU-1001</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('CC-TCH-2001', 'passTeacher123')}
                className="p-3 bg-sky-50/80 hover:bg-sky-100 border border-sky-200 rounded-2xl text-left transition-all group shadow-sm hover:shadow"
              >
                <div className="font-bold text-xs text-sky-800 group-hover:text-sky-900">Mrs. Sharma (Teacher)</div>
                <div className="text-[10px] text-slate-500 font-mono">CC-TCH-2001</div>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
