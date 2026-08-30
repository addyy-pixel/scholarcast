import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  Lock, 
  BookOpen, 
  Home, 
  Layers, 
  UserCheck,
  BellRing,
  Search,
  Award
} from 'lucide-react';
import { dbService } from '../services/db';

export default function StudentInbox({ currentUser }) {
  const [inboxMessages, setInboxMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationState, setRegistrationState] = useState({});

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      loadInbox();
    }
  }, [currentUser]);

  const loadInbox = () => {
    const msgs = dbService.getStudentInbox(currentUser.id);
    setInboxMessages(msgs);

    const regMap = {};
    msgs.forEach(msg => {
      if (msg.category === 'event') {
        regMap[msg.id] = dbService.isStudentRegistered(msg.id, currentUser.id);
      }
    });
    setRegistrationState(regMap);
  };

  const handleToggleRegistration = (eventId) => {
    const result = dbService.toggleEventRegistration(
      eventId, 
      currentUser.id, 
      currentUser.name,
      currentUser.class,
      currentUser.section,
      currentUser.house
    );
    setRegistrationState(prev => ({
      ...prev,
      [eventId]: result.registered
    }));
  };

  const filteredMessages = inboxMessages.filter(msg => 
    msg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-scholars-900 via-scholars-800 to-scholars-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-4 border-sky-500 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-400" /> Achieve • Believe • Create
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-header">
            Welcome, {currentUser?.name}
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Your personal feed for Class {currentUser?.class} ({currentUser?.section}) & {currentUser?.house} House broadcast alerts.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center space-x-4 shrink-0 relative z-10">
          <div className="text-center px-2">
            <span className="text-[11px] text-blue-200 uppercase font-bold block">Targeted Alerts</span>
            <span className="text-2xl font-extrabold text-white">{inboxMessages.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Read-Only Locked Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 sticky top-24 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-scholars-50 rounded-xl border border-scholars-200">
                  <img 
                    src="/scholars_home_logo.png" 
                    alt="Scholars Home Logo" 
                    className="h-9 w-auto object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-scholars-900">Student Profile</h3>
                  <p className="text-[11px] text-slate-500 font-mono">ID: {currentUser.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Read-Only</span>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-scholars-800" /> Class & Section
                </span>
                <span className="font-bold text-scholars-900 bg-scholars-100 border border-scholars-200 px-2.5 py-0.5 rounded-lg">
                  Class {currentUser.class} ({currentUser.section})
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-sky-700" /> Stream
                </span>
                <span className="font-bold text-sky-900 bg-sky-100 border border-sky-200 px-2.5 py-0.5 rounded-lg">
                  {currentUser.stream}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-600" /> House
                </span>
                <span className="font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                  {currentUser.house} House
                </span>
              </div>

              {/* Main Subjects */}
              <div>
                <span className="text-slate-500 font-semibold block mb-1 text-[11px] uppercase tracking-wider">Main Subjects:</span>
                <div className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-medium leading-relaxed">
                  {[currentUser.subject1, currentUser.subject2, currentUser.subject3, currentUser.subject4, currentUser.subject5].filter(Boolean).join(', ')}
                </div>
              </div>

              {/* Optional Subjects */}
              <div className="space-y-1.5 pt-1">
                <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-rose-600" /> Optional Subjects (Max 2):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.optionalSubject1 && (
                    <span className="text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-xl">
                      {currentUser.optionalSubject1}
                    </span>
                  )}
                  {currentUser.optionalSubject2 && (
                    <span className="text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-xl">
                      {currentUser.optionalSubject2}
                    </span>
                  )}
                  {!currentUser.optionalSubject1 && !currentUser.optionalSubject2 && (
                    <span className="text-slate-400 italic text-xs">None enrolled</span>
                  )}
                </div>
              </div>

            </div>

            <div className="p-3 bg-scholars-50 border border-scholars-200 rounded-2xl text-[11px] text-scholars-900 font-medium">
              Academic tags are locked and maintained centrally by Scholars Home School Administration.
            </div>

          </div>
        </div>

        {/* Right Column: Personal Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <h2 className="font-bold text-base text-scholars-900">Official Announcements & Events</h2>
            
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search inbox..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-scholars-800"
              />
            </div>
          </div>

          {/* Empty State vs Feed List */}
          {filteredMessages.length === 0 ? (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-lg text-scholars-900">No announcements yet.</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                You have no pending announcements or event invitations matching your profile at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map(msg => {
                const isRegistered = registrationState[msg.id];

                return (
                  <div 
                    key={msg.id}
                    className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-slate-800 relative hover:border-scholars-800/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                        msg.category === 'event' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'bg-scholars-50 border-scholars-200 text-scholars-800'
                      }`}>
                        {msg.category === 'event' ? '📅 Event RSVP' : '📢 Official Notice'}
                      </span>

                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-scholars-900">{msg.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>
                    </div>

                    {msg.category === 'event' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 text-xs">
                          {msg.eventDate && (
                            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                              <Calendar className="w-4 h-4 text-emerald-600" />
                              <span>{new Date(msg.eventDate).toLocaleString()}</span>
                            </div>
                          )}
                          {msg.eventLocation && (
                            <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                              <MapPin className="w-4 h-4 text-sky-600" />
                              <span>{msg.eventLocation}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleToggleRegistration(msg.id)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shrink-0 ${
                            isRegistered
                              ? 'bg-emerald-600 text-white shadow hover:bg-emerald-500'
                              : 'bg-white hover:bg-slate-50 border-2 border-emerald-600 text-emerald-700'
                          }`}
                        >
                          {isRegistered ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Registered for Event</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              <span>Register Now</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Sender: <strong className="text-scholars-900">{msg.senderName}</strong></span>
                      <span className="italic">Read-only Scholars Home broadcast</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
