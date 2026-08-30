import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Megaphone, 
  Calendar, 
  Database, 
  KeyRound, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Search,
  Sparkles,
  Lock,
  Layers,
  BookOpen,
  Home,
  Copy
} from 'lucide-react';
import { dbService } from '../services/db';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'students' | 'schoolwide' | 'allevents'

  // Activation ID Generator form state
  const [genRole, setGenRole] = useState('student');
  const [genName, setGenName] = useState('');
  const [genGrade, setGenGrade] = useState('12');
  const [genSection, setGenSection] = useState('C');
  const [genStream, setGenStream] = useState('PCM');
  const [genHouse, setGenHouse] = useState('Vikram');
  const [genSubjects, setGenSubjects] = useState('Physics, Chemistry, Mathematics, Painting');
  const [genCustomId, setGenCustomId] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);

  // Student & User lists
  const [students, setStudents] = useState([]);
  const [activationTokens, setActivationTokens] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editGrade, setEditGrade] = useState('');
  const [editHouse, setEditHouse] = useState('');

  // Schoolwide Broadcast state
  const [schoolTitle, setSchoolTitle] = useState('');
  const [schoolContent, setSchoolContent] = useState('');
  const [schoolCategory, setSchoolCategory] = useState('announcement');
  const [schoolEventDate, setSchoolEventDate] = useState('');
  const [schoolEventLocation, setSchoolEventLocation] = useState('');
  const [broadcastDone, setBroadcastDone] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, [activeTab, generatedToken]);

  const loadAdminData = () => {
    setStudents(dbService.getAllStudents());
    setActivationTokens(dbService.getActivationTokens());
  };

  const handleGenerateId = (e) => {
    e.preventDefault();
    if (!genName.trim()) {
      alert('Please enter user name.');
      return;
    }

    const payload = {
      id: genCustomId.trim() || undefined,
      name: genName,
      role: genRole,
      grade: genGrade,
      section: genSection,
      stream: genStream,
      house: genHouse,
      subjects: genSubjects.split(',').map(s => s.trim()).filter(Boolean)
    };

    const res = dbService.generateActivationToken(payload);
    if (res.success) {
      setGeneratedToken(res.token);
      setGenName('');
      setGenCustomId('');
    }
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    dbService.updateStudentProfile(selectedStudent.id, {
      grade: editGrade,
      house: editHouse
    });

    setSelectedStudent(null);
    loadAdminData();
    alert('Student record updated successfully!');
  };

  const handleSchoolwideSend = (e) => {
    e.preventDefault();
    if (!schoolTitle.trim() || !schoolContent.trim()) {
      alert('Please fill in title and message details.');
      return;
    }

    dbService.sendBroadcast(currentUser, {
      title: schoolTitle,
      content: schoolContent,
      category: schoolCategory,
      eventDate: schoolCategory === 'event' ? schoolEventDate : '',
      eventLocation: schoolCategory === 'event' ? schoolEventLocation : '',
      targetFilters: {
        grades: [],
        sections: [],
        streams: [],
        houses: [],
        subjects: [],
        isSchoolWide: true
      }
    });

    setSchoolTitle('');
    setSchoolContent('');
    setBroadcastDone(true);
    setTimeout(() => setBroadcastDone(false), 4000);
  };

  const allEvents = dbService.getSentHistory('', true).filter(m => m.category === 'event');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-800 to-indigo-950 p-6 rounded-3xl border border-purple-500/20 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>School IT / Admin Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Campus Database & Access Control
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Generate activation IDs, manage locked student profiles, and send central school-wide announcements.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/60 shrink-0">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'generator' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ID Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Profiles</span>
          </button>
          <button
            onClick={() => setActiveTab('schoolwide')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schoolwide' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Central Broadcast</span>
          </button>
          <button
            onClick={() => setActiveTab('allevents')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'allevents' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>School Events</span>
          </button>
        </div>
      </div>

      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Generator Form */}
          <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">Generate User Activation Token / ID</h2>
                <p className="text-xs text-slate-400">Create linked accounts for teachers and students</p>
              </div>
            </div>

            <form onSubmit={handleGenerateId} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">User Role</label>
                  <select
                    value={genRole}
                    onChange={(e) => setGenRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Custom ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={genCustomId}
                    onChange={(e) => setGenCustomId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sneha Roy"
                  value={genName}
                  onChange={(e) => setGenName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              {genRole === 'student' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Grade</label>
                    <input
                      type="text"
                      value={genGrade}
                      onChange={(e) => setGenGrade(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Section</label>
                    <input
                      type="text"
                      value={genSection}
                      onChange={(e) => setGenSection(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Stream</label>
                    <input
                      type="text"
                      value={genStream}
                      onChange={(e) => setGenStream(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">House</label>
                    <input
                      type="text"
                      value={genHouse}
                      onChange={(e) => setGenHouse(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Enrolled Subjects (Comma separated)</label>
                <input
                  type="text"
                  value={genSubjects}
                  onChange={(e) => setGenSubjects(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all text-xs flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate & Link Activation Token</span>
              </button>
            </form>

            {generatedToken && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 animate-fade-in">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activation Token Generated!</span>
                </div>
                <div className="text-xs text-slate-200">
                  User: <strong>{generatedToken.name}</strong> ({generatedToken.role})
                </div>
                <div className="p-2 bg-slate-950 rounded-xl border border-emerald-500/40 font-mono text-emerald-300 font-bold text-center text-sm flex items-center justify-center space-x-2">
                  <span>{generatedToken.code}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Provide this ID code to the user. They can click "Activate ID" on the navbar to set their password.
                </p>
              </div>
            )}

          </div>

          {/* Pending Tokens List */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white">Pending Activation IDs ({activationTokens.length})</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {activationTokens.map(tok => (
                <div key={tok.code} className="p-3 bg-slate-900/80 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">{tok.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {tok.role} • Grade {tok.grade}-{tok.section} • {tok.house}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                    {tok.code}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <div>
              <h2 className="font-bold text-lg text-white">Student Database Directory & Locked Tag Management</h2>
              <p className="text-xs text-slate-400">View and update official student tags locked from student edit access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(s => (
              <div key={s.id} className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{s.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {s.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Grade & Stream</span>
                    <span className="font-semibold text-blue-300">{s.grade}-{s.section} ({s.stream})</span>
                  </div>
                  <div className="p-2 bg-slate-800/60 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">House</span>
                    <span className="font-semibold text-amber-300">{s.house}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300">
                  <strong>Subjects:</strong> {s.subjects?.join(', ')}
                </div>

                <button
                  onClick={() => {
                    setSelectedStudent(s);
                    setEditGrade(s.grade);
                    setEditHouse(s.house);
                  }}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Edit Locked Tags</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-base text-white">Edit Database Profile: {selectedStudent.name}</h3>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Grade</label>
                  <input
                    type="text"
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">House</label>
                  <input
                    type="text"
                    value={editHouse}
                    onChange={(e) => setEditHouse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 p-2 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateStudent}
                    className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {activeTab === 'schoolwide' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5 max-w-3xl mx-auto">
          <div className="flex items-center space-x-2 border-b border-slate-700/60 pb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Central School-Wide Announcement</h2>
              <p className="text-xs text-slate-400">Broadcasts to all student feeds across every grade and house</p>
            </div>
          </div>

          <form onSubmit={handleSchoolwideSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Annual Sports Day Dates & Chief Guest Notice"
                value={schoolTitle}
                onChange={(e) => setSchoolTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={schoolCategory}
                onChange={(e) => setSchoolCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none"
              >
                <option value="announcement">General Announcement</option>
                <option value="event">School-Wide Event (Students can register)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message Content</label>
              <textarea
                rows={4}
                placeholder="Details of the announcement..."
                value={schoolContent}
                onChange={(e) => setSchoolContent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-xs flex items-center justify-center space-x-2"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast School-Wide</span>
            </button>

            {broadcastDone && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-center font-bold">
                Broadcast delivered school-wide to all students!
              </div>
            )}
          </form>
        </div>
      )}

      {activeTab === 'allevents' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
            <div>
              <h2 className="font-bold text-lg text-white">Central School Events Directory</h2>
              <p className="text-xs text-slate-400">All registered events across campus with student registration tallies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allEvents.map(ev => {
              const regs = dbService.getRegistrationsForEvent(ev.id);
              return (
                <div key={ev.id} className="bg-slate-900/80 border border-slate-700/70 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      📅 School Event
                    </span>
                    <span className="text-xs text-slate-400">{new Date(ev.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-bold text-base text-white">{ev.title}</h3>
                  <p className="text-xs text-slate-300">{ev.content}</p>

                  <div className="p-3 bg-slate-950 rounded-xl text-xs text-slate-300 space-y-1">
                    <div><strong>Venue:</strong> {ev.eventLocation || 'School Campus'}</div>
                    <div><strong>Date & Time:</strong> {new Date(ev.eventDate).toLocaleString()}</div>
                    <div className="text-emerald-400 font-bold mt-1">
                      Total Student Registrations: {regs.length}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
