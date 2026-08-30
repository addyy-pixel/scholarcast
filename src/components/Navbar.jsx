import React from 'react';
import { 
  LogOut, 
  GraduationCap, 
  Briefcase,
  Award
} from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  return (
    <header className="bg-scholars-900 border-b-2 border-scholars-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3.5">
            <div className="p-1.5 bg-white rounded-2xl shadow-md border border-scholars-200">
              <img 
                src="/scholars_home_logo.png" 
                alt="Scholars Home Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider font-serif-header text-white">
                  SCHOLARS HOME
                </span>
                <span className="bg-sky-500/20 border border-sky-400/40 text-sky-200 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
                  {currentUser?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-blue-200 font-medium hidden sm:inline">
                  CampusCast Platform
                </span>
                <span className="text-blue-300 font-bold text-[10px] hidden md:flex items-center gap-1 bg-scholars-800/80 px-2 py-0.2 rounded-md">
                  <Award className="w-3 h-3 text-sky-400" /> Achieve • Believe • Create
                </span>
              </div>
            </div>
          </div>

          {/* Right User Status & Logout */}
          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1.5">
                  {currentUser.role === 'teacher' && <Briefcase className="w-4 h-4 text-sky-400" />}
                  {currentUser.role === 'student' && <GraduationCap className="w-4 h-4 text-emerald-400" />}
                  <span className="text-xs sm:text-sm font-bold text-white">{currentUser.name}</span>
                </div>
                <span className="text-[10px] text-blue-200 uppercase font-semibold">
                  {currentUser.role === 'student' && `Class ${currentUser.class} (${currentUser.section}) • ${currentUser.house} House`}
                  {currentUser.role === 'teacher' && `Teacher (${currentUser.department})`}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-200 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/40 rounded-xl transition-all shadow"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
