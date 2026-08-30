import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TeacherDashboard from './components/TeacherDashboard';
import StudentInbox from './components/StudentInbox';
import AdminPortal from './components/AdminPortal';
import UserLoginView from './components/UserLoginView';
import { dbService } from './services/db';

export default function App() {
  // Determine application mode from URL path or query string
  // /admin or ?app=admin -> App 1 (CampusCast Admin)
  // / or ?app=user -> App 2 (CampusCast User App)
  const [appMode] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('/admin') || search.includes('app=admin')) {
      return 'admin';
    }
    return 'user';
  });

  // User App logged-in state (starts NULL so LOGIN SCREEN is always the FIRST screen!)
  const [currentUser, setCurrentUser] = useState(null);

  // Cross-tab database synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'campuscast_master_data_v2') {
        dbService.reload();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user, role) => {
    if (role === 'student' || role === 'teacher') {
      setCurrentUser(user);
    }
  };

  // APP 1: CAMPUSCAST ADMIN (Strictly isolated at /admin, starts on Admin Login Screen!)
  if (appMode === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <AdminPortal />
      </div>
    );
  }

  // APP 2: CAMPUSCAST (Student & Teacher User App strictly isolated at /)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* RENDER USER LOGIN SCREEN IF NOT LOGGED IN */}
      {!currentUser ? (
        <UserLoginView onAuthSuccess={handleAuthSuccess} />
      ) : (
        <>
          <Navbar currentUser={currentUser} onLogout={handleLogout} />

          <main className="flex-1">
            {currentUser.role === 'student' && (
              <StudentInbox currentUser={currentUser} />
            )}
            {currentUser.role === 'teacher' && (
              <TeacherDashboard currentUser={currentUser} />
            )}
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">CAMPUSCAST</span>
            <span>— Precision School Communication System</span>
          </div>
          <span className="text-slate-500">Official Student & Teacher Portal</span>
        </div>
      </footer>

    </div>
  );
}
