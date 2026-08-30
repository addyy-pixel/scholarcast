import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Send, 
  History, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Megaphone,
  BookOpen,
  Home,
  Tag,
  Clock,
  UserCheck,
  Eye,
  Award
} from 'lucide-react';
import { dbService, OFFICIAL_OPTIONAL_SUBJECTS, OFFICIAL_SECTIONS, OFFICIAL_CLASSES, OFFICIAL_STREAMS, OFFICIAL_HOUSES } from '../services/db';

export default function TeacherDashboard({ currentUser, onBroadcastSent }) {
  const [activeTab, setActiveTab] = useState('broadcast');
  
  const [selectedClasses, setSelectedClasses] = useState(['12']);
  const [selectedSections, setSelectedSections] = useState(['A/B']);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedHouses, setSelectedHouses] = useState([]);
  const [selectedOptionalSubject, setSelectedOptionalSubject] = useState('Painting');
  const [isSchoolWide, setIsSchoolWide] = useState(false);

  const [category, setCategory] = useState('event');
  const [title, setTitle] = useState('Grade 12 Painting Practical Submission & Exhibition');
  const [content, setContent] = useState('Important notice for Grade 12 students taking Painting as an Optional Subject: Practical portfolio submission is scheduled for Thursday. Bring canvas boards and oil color still-life series to Art Studio 2 before 2:00 PM.');
  const [eventDate, setEventDate] = useState('2026-09-03T14:00');
  const [eventLocation, setEventLocation] = useState('Art Studio 2 (Block B)');

  const [matchInfo, setMatchInfo] = useState({ count: 0, matchingStudents: [] });
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  const [sentHistory, setSentHistory] = useState([]);
  const [activeEventRegistrations, setActiveEventRegistrations] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const updateMatch = async () => {
      const filters = {
        classes: selectedClasses,
        sections: selectedSections,
        streams: selectedStreams,
        houses: selectedHouses,
        optionalSubject: selectedOptionalSubject,
        isSchoolWide
      };
      const res = await dbService.calculateMatchingStudents(filters);
      if (isMounted) setMatchInfo(res);
    };
    updateMatch();
    return () => { isMounted = false; };
  }, [selectedClasses, selectedSections, selectedStreams, selectedHouses, selectedOptionalSubject, isSchoolWide]);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      if (currentUser) {
        const msgs = await dbService.getAllMessages();
        const history = msgs.filter(m => m.senderId === currentUser.id || currentUser.role === 'admin');
        if (isMounted) setSentHistory(history);
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, [currentUser, activeTab, sendSuccess]);

  const toggleArrayItem = (array, setArray, item) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and message details.');
      return;
    }

    setIsSending(true);

    const messageData = {
      title,
      content,
      category,
      eventDate: category === 'event' ? eventDate : '',
      eventLocation: category === 'event' ? eventLocation : '',
      targetFilters: {
        classes: selectedClasses,
        sections: selectedSections,
        streams: selectedStreams,
        houses: selectedHouses,
        optionalSubject: selectedOptionalSubject,
        isSchoolWide
      }
    };

    const result = await dbService.sendBroadcast(currentUser, messageData);
    setIsSending(false);
    if (result.success) {
      setSendSuccess(result);
      if (onBroadcastSent) onBroadcastSent(result.message);
      setTimeout(() => setSendSuccess(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-scholars-900 via-scholars-800 to-scholars-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-4 border-sky-500">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-sky-500/20 border border-sky-400/40 text-sky-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-sky-400" /> Achieve • Believe • Create
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-header">
            Teacher Broadcast Routing Engine
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Select database audience filters (Class, Exact Section A/B, House, Optional Subject) to target students with zero noise.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shrink-0">
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'broadcast'
                ? 'bg-white text-scholars-900 shadow-md'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>New Broadcast</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-scholars-900 shadow-md'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Sent History & RSVPs ({sentHistory.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'broadcast' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Relational Database Filters */}
          <div className="lg:col-span-7 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-scholars-100 border border-scholars-200 flex items-center justify-center text-scholars-800">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-scholars-900">Database Audience Filters</h2>
                  <p className="text-xs text-slate-500">Cross-reference student tags with precision</p>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={isSchoolWide}
                  onChange={(e) => setIsSchoolWide(e.target.checked)}
                  className="w-4 h-4 rounded text-scholars-800 focus:ring-scholars-800 border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700">School-Wide Notice</span>
              </label>
            </div>

            {!isSchoolWide && (
              <div className="space-y-5">
                
                {/* Class Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-scholars-800" /> Class
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OFFICIAL_CLASSES.map(c => {
                      const selected = selectedClasses.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleArrayItem(selectedClasses, setSelectedClasses, c)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                            selected
                              ? 'bg-scholars-800 border-scholars-800 text-white shadow'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          Class {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section Filter (Exact A/B, C, D/E, F) */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> Section (Exact School Format: A/B, C, D/E, F)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OFFICIAL_SECTIONS.map(s => {
                      const selected = selectedSections.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleArrayItem(selectedSections, setSelectedSections, s)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                            selected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          Section {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stream Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" /> Academic Stream
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OFFICIAL_STREAMS.map(st => {
                      const selected = selectedStreams.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => toggleArrayItem(selectedStreams, setSelectedStreams, st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                            selected
                              ? 'bg-sky-600 border-sky-600 text-white shadow'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* House Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-600" /> House
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {OFFICIAL_HOUSES.map(h => {
                      const selected = selectedHouses.includes(h.name);
                      return (
                        <button
                          key={h.name}
                          type="button"
                          onClick={() => toggleArrayItem(selectedHouses, setSelectedHouses, h.name)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border-2 ${
                            selected
                              ? 'bg-amber-600 border-amber-600 text-white shadow'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {h.name} House
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* DUAL OPTIONAL SUBJECT FILTER */}
                <div className="p-4 bg-scholars-50 border border-scholars-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold uppercase text-scholars-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-rose-600" /> Optional Subject Filter (Stream Independent)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Filters students who take this subject as either Optional Subject 1 or Optional Subject 2.
                  </p>
                  <select
                    value={selectedOptionalSubject}
                    onChange={(e) => setSelectedOptionalSubject(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-scholars-800"
                  >
                    <option value="">No Optional Subject Filter (All)</option>
                    {OFFICIAL_OPTIONAL_SUBJECTS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>
            )}

            {/* Dynamic Counter Box */}
            <div className="p-4 bg-scholars-900 text-white rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-blue-200 font-bold uppercase tracking-wider">
                    Recipient Match Count
                  </div>
                  <div className="text-xl font-extrabold text-white flex items-center gap-2">
                    <span>{matchInfo.count} Students Match</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-xs font-bold text-white flex items-center space-x-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPreview ? 'Hide List' : 'Preview Student List'}</span>
              </button>
            </div>

            {/* Preview Table */}
            {showPreview && (
              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 animate-fade-in">
                <h4 className="font-bold text-xs text-scholars-900 uppercase tracking-wider">Matching Students Preview ({matchInfo.count})</h4>
                {matchInfo.matchingStudents.length === 0 ? (
                  <p className="text-xs text-slate-500">No students match current filter combination.</p>
                ) : (
                  <div className="overflow-x-auto max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Class</th>
                          <th className="p-2">Section</th>
                          <th className="p-2">Stream</th>
                          <th className="p-2">House</th>
                          <th className="p-2">Optional Subjects</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {matchInfo.matchingStudents.map(s => (
                          <tr key={s.studentRecordNo}>
                            <td className="p-2 font-bold text-scholars-900">{s.name}</td>
                            <td className="p-2 text-slate-700">{s.class}</td>
                            <td className="p-2 text-scholars-800">{s.section}</td>
                            <td className="p-2 text-sky-800">{s.stream}</td>
                            <td className="p-2 text-amber-800">{s.house}</td>
                            <td className="p-2 text-rose-700">
                              {[s.optionalSubject1, s.optionalSubject2].filter(Boolean).join(', ') || 'None'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Draft Editor */}
          <div className="lg:col-span-5 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between text-slate-800">
            <div className="space-y-4">
              <h2 className="font-bold text-lg text-scholars-900 border-b border-slate-100 pb-3">Draft Broadcast Message</h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('announcement')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      category === 'announcement' ? 'bg-scholars-50 border-scholars-800 text-scholars-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">📢 Announcement</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('event')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      category === 'event' ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="text-xs">📅 School Event</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-scholars-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Message Details</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none focus:border-scholars-800"
                />
              </div>

              {category === 'event' && (
                <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold">Event Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 p-2 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase font-bold">Venue</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 p-2 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              {sendSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Delivered to {sendSuccess.recipientCount} student inboxes!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={isSending || matchInfo.count === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 uppercase ${
                  matchInfo.count === 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-scholars-800 hover:bg-scholars-900 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Broadcast to {matchInfo.count} Matching Students</span>
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* Sent History & Real-Time Event RSVPs */
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 text-slate-800">
          <h2 className="font-bold text-lg text-scholars-900 border-b border-slate-100 pb-3">Sent Broadcast History & Live RSVPs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sentHistory.map(msg => {
              const regs = dbService.getRegistrationsForEvent(msg.id);
              return (
                <div key={msg.id} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      msg.category === 'event' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-scholars-100 text-scholars-900 border-scholars-200'
                    }`}>
                      {msg.category === 'event' ? '📅 Event' : '📢 Announcement'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-bold text-base text-scholars-900">{msg.title}</h3>
                  <p className="text-xs text-slate-700">{msg.content}</p>

                  {msg.category === 'event' && (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-800">Live Registrations ({regs.length} Students)</span>
                        <button
                          onClick={() => setActiveEventRegistrations(activeEventRegistrations?.id === msg.id ? null : msg)}
                          className="text-[10px] text-scholars-800 underline font-semibold"
                        >
                          {activeEventRegistrations?.id === msg.id ? 'Hide List' : 'View Registered Students'}
                        </button>
                      </div>

                      {activeEventRegistrations?.id === msg.id && (
                        <div className="space-y-1 pt-1 border-t border-slate-100 max-h-36 overflow-y-auto">
                          {regs.length === 0 ? (
                            <p className="text-[11px] text-slate-400 italic">No registrations recorded yet.</p>
                          ) : (
                            regs.map(r => (
                              <div key={r.id} className="text-[11px] flex items-center justify-between text-slate-700">
                                <span>{r.studentName} (Class {r.studentClass}-{r.studentSection})</span>
                                <span className="text-amber-700 font-bold">{r.studentHouse} House</span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
