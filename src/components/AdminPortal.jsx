import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  KeyRound, 
  FileSpreadsheet, 
  Search, 
  Copy, 
  Check, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  X,
  Settings,
  Lock,
  LogOut,
  Award
} from 'lucide-react';
import { dbService, OFFICIAL_OPTIONAL_SUBJECTS, OFFICIAL_SECTIONS, OFFICIAL_CLASSES, OFFICIAL_STREAMS, OFFICIAL_HOUSES } from '../services/db';

export default function AdminPortal({ onOpenUserApp }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminIdInput, setAdminIdInput] = useState('ADM-001');
  const [adminPassInput, setAdminPassInput] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [animationStarted, setAnimationStarted] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [settingsMsg, setSettingsMsg] = useState(null);

  const [studentSearch, setStudentSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  const [credentialModal, setCredentialModal] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [regenerateConfirm, setRegenerateConfirm] = useState(null);
  const [excelImportStatus, setExcelImportStatus] = useState(null);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    setAnimationStarted(true);
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn, activeTab, credentialModal]);

  const loadData = async () => {
    const s = await dbService.getAllStudents();
    const t = await dbService.getAllTeachers();
    const c = await dbService.getAllCredentials();
    setStudents(s);
    setTeachers(t);
    setCredentials(c);

    const adm = await dbService.getAdminAccount();
    if (adm) {
      setNewAdminId(adm.id);
      setNewAdminPass(adm.password);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await dbService.adminLogin(adminIdInput, adminPassInput);
    if (res.success) {
      setIsAdminLoggedIn(true);
    } else {
      setLoginError(res.message);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminPassInput('');
  };

  const handleUpdateAdminCredentials = async (e) => {
    e.preventDefault();
    setSettingsMsg(null);
    const res = await dbService.updateAdminCredentials(newAdminId, newAdminPass);
    if (res.success) {
      setSettingsMsg({ type: 'success', message: res.message });
      setAdminIdInput(newAdminId);
      setAdminPassInput(newAdminPass);
    } else {
      setSettingsMsg({ type: 'error', message: res.message });
    }
  };

  const handleGenerateStudentCreds = async (recordNo) => {
    const res = await dbService.generateStudentCredentials(recordNo);
    if (res.success) {
      setCredentialModal({
        personName: res.student.name,
        role: 'Student',
        generatedId: res.credentials.generatedId,
        password: res.credentials.generatedPassword,
        recordNo
      });
      loadData();
    }
  };

  const handleGenerateTeacherCreds = async (recordNo) => {
    const res = await dbService.generateTeacherCredentials(recordNo);
    if (res.success) {
      setCredentialModal({
        personName: res.teacher.name,
        role: 'Teacher',
        generatedId: res.credentials.generatedId,
        password: res.credentials.generatedPassword,
        recordNo
      });
      loadData();
    }
  };

  const handleRegenerateConfirm = async () => {
    if (!regenerateConfirm) return;
    const res = await dbService.generateStudentCredentials(regenerateConfirm);
    if (res.success) {
      setCredentialModal({
        personName: res.student.name,
        role: 'Student',
        generatedId: res.credentials.generatedId,
        password: res.credentials.generatedPassword,
        recordNo: regenerateConfirm
      });
      setRegenerateConfirm(null);
      loadData();
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCopyBoth = (id, pass) => {
    const text = `User ID: ${id}\nPassword: ${pass}`;
    navigator.clipboard.writeText(text);
    setCopiedField('both');
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleExportExcel = () => {
    dbService.exportToExcel();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const buffer = evt.target.result;
      const res = dbService.importFromExcel(buffer);
      if (res.success) {
        setExcelImportStatus({ success: true, message: res.message });
        loadData();
      } else {
        setExcelImportStatus({ success: false, errors: res.errors });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentRecordNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.generatedId || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.optionalSubject1 || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.optionalSubject2 || '').toLowerCase().includes(studentSearch.toLowerCase());

    const matchesClass = classFilter === 'all' || s.class === classFilter;
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;

    return matchesSearch && matchesClass && matchesSection;
  });

  // IF NOT LOGGED IN AS ADMIN: RENDER STAGE REVEAL & GLASSMORPHIC ADMIN LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 bg-scholars-950 font-sans overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-110 opacity-50 transition-all duration-1000"
          style={{ backgroundImage: `url('/stage_bg.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-scholars-950/80 via-scholars-900/85 to-scholars-950/90" />

        {/* Stage Curtains */}
        <div className="fixed inset-0 pointer-events-none z-30 flex">
          <div 
            className={`w-1/2 h-full border-r-4 border-amber-400/60 shadow-2xl relative ${
              animationStarted ? 'animate-curtain-left' : ''
            }`}
            style={{
              backgroundImage: `radial-gradient(ellipse at left, rgba(120, 20, 20, 0.9), rgba(40, 5, 5, 0.95)), url('/stage_bg.png')`,
              backgroundBlendMode: 'overlay',
              backgroundSize: 'cover'
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-400/40 to-transparent" />
            <div className="absolute inset-y-0 right-2 w-1 bg-amber-400/80 shadow-[0_0_15px_#f59e0b]" />
          </div>

          <div 
            className={`w-1/2 h-full border-l-4 border-amber-400/60 shadow-2xl relative ${
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

        {/* Centered Glassmorphic Admin Dialog */}
        <div className="relative z-20 w-full max-w-lg my-8 animate-glass-in">
          <div className="text-center space-y-3 mb-6">
            <div className="inline-block p-3.5 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-scholars-800/30">
              <img 
                src="/scholars_home_logo.png" 
                alt="Scholars Home Logo" 
                className="h-28 sm:h-32 object-contain mx-auto"
              />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider font-serif-header uppercase drop-shadow-md">
                SCHOLARS HOME ADMIN
              </h1>
              
              <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Achieve • Believe • Create</span>
              </div>

              <p className="text-xs text-blue-200/90 max-w-sm mx-auto pt-1 font-medium">
                CampusCast Admin • Master Record & Credential Panel
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-2xl border-2 border-white/80 p-8 rounded-3xl space-y-6 soft-card-shadow-lg text-slate-800">
            <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-lg text-scholars-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-scholars-800" /> Admin Sign In
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">Authorized Administrative Control</p>
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-scholars-900 mb-1.5">
                  Admin User ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. ADM-001"
                  value={adminIdInput}
                  onChange={(e) => setAdminIdInput(e.target.value)}
                  className="w-full bg-slate-50/80 border-2 border-slate-200 focus:border-scholars-800 focus:bg-white rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-mono outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-scholars-900 mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  className="w-full bg-slate-50/80 border-2 border-slate-200 focus:border-scholars-800 focus:bg-white rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-mono outline-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-scholars-800 to-scholars-900 hover:from-scholars-900 hover:to-scholars-950 text-white font-extrabold rounded-2xl shadow-lg shadow-scholars-900/30 transition-all text-sm uppercase tracking-wider transform active:scale-98"
              >
                Sign In to Admin Dashboard
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200/60 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">Default Admin Account:</span>
              <div className="inline-block bg-scholars-50 px-3 py-1 rounded-xl border border-scholars-200 text-xs font-mono text-scholars-800 font-bold">
                ID: ADM-001 | Pass: admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN SCHOLARS HOME ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-scholars-900 border-b-2 border-scholars-800 text-white sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-2">
            
            <div className="flex items-center space-x-3.5">
              <div className="p-1.5 bg-white rounded-2xl shadow-md border border-scholars-200">
                <img 
                  src="/scholars_home_logo.png" 
                  alt="Scholars Home Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-wider font-serif-header text-white">
                  SCHOLARS HOME ADMIN
                </span>
                <span className={`ml-2 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  dbService.isCloud 
                    ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40' 
                    : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                }`}>
                  {dbService.isCloud ? '⚡ Supabase Cloud' : '💾 LocalStorage'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={async () => {
                  const res = await dbService.seedSupabaseData(true);
                  alert(res?.message || 'Demo records populated into database!');
                  await loadData();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow transition-all"
                title="Populate/Restore demo student and teacher records into database"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Seed Demo Records</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow transition-all"
                title="Download CampusCast_Data.xlsx"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export CampusCast_Data.xlsx</span>
              </button>

              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-400/40 rounded-xl text-xs font-bold transition-all shadow"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Admin Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-3xl border-2 border-slate-200 soft-card-shadow">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-scholars-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-scholars-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Student Records ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'teachers' ? 'bg-scholars-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Teacher Records ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'credentials' ? 'bg-scholars-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Credentials Ledger ({credentials.length})
          </button>
          <button
            onClick={() => setActiveTab('excel')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'excel' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Excel Import/Export
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admin Security Settings
          </button>
        </div>

        {/* DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase block">Total Students</span>
                <span className="text-2xl font-extrabold text-scholars-900 mt-1 block">{students.length}</span>
              </div>
              <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase block">Total Teachers</span>
                <span className="text-2xl font-extrabold text-sky-700 mt-1 block">{teachers.length}</span>
              </div>
              <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase block">Credentials Generated</span>
                <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                  {students.filter(s => s.credentialStatus === 'Generated').length}
                </span>
              </div>
              <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase block">Pending Credentials</span>
                <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
                  {students.filter(s => s.credentialStatus !== 'Generated').length}
                </span>
              </div>
              <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-[11px] font-extrabold text-slate-500 uppercase block">Active Accounts</span>
                <span className="text-2xl font-extrabold text-scholars-800 mt-1 block">
                  {students.filter(s => s.accountStatus === 'Active').length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-bold text-base text-scholars-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-scholars-800" /> Student Credentials Generator
                </h3>
                <p className="text-xs text-slate-600">
                  Generate unique login IDs (`CC-STU-xxxx`) and passwords for students.
                </p>
                <button
                  onClick={() => setActiveTab('students')}
                  className="px-4 py-2.5 bg-scholars-800 hover:bg-scholars-900 text-white rounded-2xl text-xs font-bold shadow"
                >
                  Manage Student Directory ➔
                </button>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-4 soft-card-shadow hover:-translate-y-0.5 transition-all duration-300">
                <h3 className="font-bold text-base text-scholars-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Master Excel Sync (`CampusCast_Data.xlsx`)
                </h3>
                <p className="text-xs text-slate-600">
                  Import or export your school's master Excel workbook containing STUDENTS, TEACHERS, and SUBJECTS.
                </p>
                <button
                  onClick={() => setActiveTab('excel')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow"
                >
                  Open Excel Manager ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT MANAGEMENT TABLE */}
        {activeTab === 'students' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 soft-card-shadow">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search student, ID, or optional subject..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-scholars-800"
                />
              </div>

              <div className="flex items-center space-x-3 w-full md:w-auto">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 outline-none font-semibold"
                >
                  <option value="all">All Classes</option>
                  {OFFICIAL_CLASSES.map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>

                <select
                  value={sectionFilter}
                  onChange={(e) => setSectionFilter(e.target.value)}
                  className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-3 py-2 text-xs text-slate-900 outline-none font-semibold"
                >
                  <option value="all">All Sections (Exact: A/B, C, D/E, F)</option>
                  {OFFICIAL_SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3">Record No</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Stream</th>
                    <th className="p-3">House</th>
                    <th className="p-3">Optional Subject 1</th>
                    <th className="p-3">Optional Subject 2</th>
                    <th className="p-3">Credential Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map(s => {
                    const hasCreds = s.credentialStatus === 'Generated';
                    return (
                      <tr key={s.studentRecordNo} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500">{s.studentRecordNo}</td>
                        <td className="p-3 font-bold text-scholars-900">{s.name}</td>
                        <td className="p-3">
                          <span className="bg-scholars-100 text-scholars-800 border border-scholars-200 px-2 py-0.5 rounded font-bold">
                            {s.class} ({s.section})
                          </span>
                        </td>
                        <td className="p-3 text-sky-800 font-semibold">{s.stream}</td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                            {s.house}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-rose-700">{s.optionalSubject1 || '—'}</td>
                        <td className="p-3 font-semibold text-teal-700">{s.optionalSubject2 || '—'}</td>
                        <td className="p-3">
                          {hasCreds ? (
                            <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-bold flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Generated
                            </span>
                          ) : (
                            <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {hasCreds ? (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setCredentialModal({
                                  personName: s.name,
                                  role: 'Student',
                                  generatedId: s.generatedId,
                                  password: s.generatedPassword,
                                  recordNo: s.studentRecordNo
                                })}
                                className="px-2.5 py-1 bg-scholars-50 hover:bg-scholars-100 border border-scholars-200 text-scholars-900 rounded-xl font-semibold flex items-center space-x-1 shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5 text-scholars-800" />
                                <span>View / Copy</span>
                              </button>
                              <button
                                onClick={() => setRegenerateConfirm(s.studentRecordNo)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl"
                                title="Regenerate Credentials"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleGenerateStudentCreds(s.studentRecordNo)}
                              className="px-3.5 py-1.5 bg-scholars-800 hover:bg-scholars-900 text-white font-bold rounded-xl shadow text-xs"
                            >
                              Generate ID & Password
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TEACHER MANAGEMENT TABLE */}
        {activeTab === 'teachers' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 soft-card-shadow">
            <h2 className="font-bold text-lg text-scholars-900">Teacher Records Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3">Record No</th>
                    <th className="p-3">Teacher Name</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Subjects Taught</th>
                    <th className="p-3">Authorized Classes</th>
                    <th className="p-3">Credential Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map(t => {
                    const hasCreds = t.credentialStatus === 'Generated';
                    return (
                      <tr key={t.teacherRecordNo} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-500">{t.teacherRecordNo}</td>
                        <td className="p-3 font-bold text-scholars-900">{t.name}</td>
                        <td className="p-3 text-sky-800 font-semibold">{t.department}</td>
                        <td className="p-3 text-slate-700">{t.subjectsTaught?.join(', ')}</td>
                        <td className="p-3 text-slate-600">{t.authorizedClasses?.join(', ')}</td>
                        <td className="p-3">
                          {hasCreds ? (
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                              Generated ({t.generatedId})
                            </span>
                          ) : (
                            <span className="text-amber-800">Pending</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleGenerateTeacherCreds(t.teacherRecordNo)}
                            className="px-3.5 py-1.5 bg-scholars-800 hover:bg-scholars-900 text-white font-bold rounded-xl text-xs shadow"
                          >
                            {hasCreds ? 'View / Re-Generate' : 'Generate ID & Password'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CREDENTIALS LEDGER */}
        {activeTab === 'credentials' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 soft-card-shadow">
            <h2 className="font-bold text-lg text-scholars-900">Generated Credentials Master Ledger</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b-2 border-slate-200">
                  <tr>
                    <th className="p-3">Record No</th>
                    <th className="p-3">Person Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Generated ID</th>
                    <th className="p-3">Password</th>
                    <th className="p-3">Generated On</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {credentials.map(c => (
                    <tr key={c.generatedId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{c.recordNo}</td>
                      <td className="p-3 font-bold text-scholars-900">{c.personName}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                          c.role === 'Student' ? 'bg-emerald-100 text-emerald-800' : 'bg-scholars-100 text-scholars-900'
                        }`}>
                          {c.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-scholars-800">{c.generatedId}</td>
                      <td className="p-3 font-mono text-slate-700">{c.generatedPassword}</td>
                      <td className="p-3 text-slate-500">{new Date(c.generatedOn).toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleCopyBoth(c.generatedId, c.generatedPassword)}
                          className="px-3 py-1 bg-scholars-50 hover:bg-scholars-100 border border-scholars-200 text-scholars-900 rounded-xl text-xs font-semibold shadow-sm"
                        >
                          Copy Both
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXCEL IMPORT / EXPORT */}
        {activeTab === 'excel' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 soft-card-shadow max-w-3xl mx-auto">
            <h2 className="font-bold text-xl text-scholars-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              CampusCast_Data.xlsx Workbook Sync
            </h2>

            <div className="space-y-6">
              <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-scholars-900">1. Export CampusCast_Data.xlsx</h3>
                <p className="text-xs text-slate-600">Download current student and teacher master spreadsheets.</p>
                <button
                  onClick={handleExportExcel}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CampusCast_Data.xlsx</span>
                </button>
              </div>

              <div className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                <h3 className="font-bold text-sm text-scholars-900">2. Import Updated Excel File</h3>
                <p className="text-xs text-slate-600">Upload Excel spreadsheet to update student records.</p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-scholars-800 file:text-white cursor-pointer"
                />

                {excelImportStatus && (
                  <div className="pt-2">
                    {excelImportStatus.success ? (
                      <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{excelImportStatus.message}</span>
                      </div>
                    ) : (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 space-y-1">
                        <div className="font-bold text-rose-800">Validation Errors:</div>
                        <ul className="list-disc pl-4 space-y-0.5">
                          {excelImportStatus.errors?.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN SECURITY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 space-y-6 soft-card-shadow max-w-md mx-auto">
            <div className="border-b border-slate-200 pb-3 flex items-center space-x-2 text-scholars-800">
              <Settings className="w-5 h-5" />
              <h2 className="font-bold text-lg text-scholars-900">Admin Security Settings</h2>
            </div>

            {settingsMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                settingsMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {settingsMsg.message}
              </div>
            )}

            <form onSubmit={handleUpdateAdminCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Admin User ID</label>
                <input
                  type="text"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 text-xs text-slate-900 font-mono outline-none focus:border-scholars-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">New Admin Password</label>
                <input
                  type="text"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 text-xs text-slate-900 font-mono outline-none focus:border-scholars-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-scholars-800 hover:bg-scholars-900 text-white font-bold rounded-2xl text-xs shadow transition-all uppercase tracking-wider"
              >
                Update Admin Login Credentials
              </button>
            </form>
          </div>
        )}

      </div>

      {/* CREDENTIAL MODAL */}
      {credentialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-scholars-800/30 w-full max-w-md p-6 rounded-3xl space-y-5 shadow-2xl relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-scholars-100 border border-scholars-200 flex items-center justify-center text-scholars-800">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-scholars-900">Generated Credentials</h3>
                  <p className="text-[11px] text-slate-500">For {credentialModal.personName} ({credentialModal.role})</p>
                </div>
              </div>
              <button onClick={() => setCredentialModal(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Generated ID</span>
                  <span className="font-mono text-sm font-extrabold text-scholars-800">{credentialModal.generatedId}</span>
                </div>
                <button
                  onClick={() => handleCopy(credentialModal.generatedId, 'id')}
                  className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg flex items-center space-x-1 hover:bg-slate-50"
                >
                  {copiedField === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'id' ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Password</span>
                  <span className="font-mono text-sm font-extrabold text-emerald-700">{credentialModal.password}</span>
                </div>
                <button
                  onClick={() => handleCopy(credentialModal.password, 'password')}
                  className="px-3 py-1 bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg flex items-center space-x-1 hover:bg-slate-50"
                >
                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'password' ? 'Copied' : 'Copy Password'}</span>
                </button>
              </div>

              <button
                onClick={() => handleCopyBoth(credentialModal.generatedId, credentialModal.password)}
                className="w-full py-3.5 bg-scholars-800 hover:bg-scholars-900 text-white font-bold rounded-2xl shadow text-xs flex items-center justify-center space-x-2 uppercase tracking-wider"
              >
                {copiedField === 'both' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'both' ? 'Both Copied!' : 'Copy Both (ID & Password)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGENERATE CONFIRMATION DIALOG */}
      {regenerateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-2 border-slate-200 w-full max-w-sm p-6 rounded-3xl space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Regenerate Credentials?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regenerating credentials will invalidate current login credentials. Continue?
            </p>
            <div className="flex space-x-2 pt-2">
              <button onClick={() => setRegenerateConfirm(null)} className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200">
                Cancel
              </button>
              <button onClick={handleRegenerateConfirm} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700">
                Yes, Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
