/**
 * CAMPUSCAST & CAMPUSCAST ADMIN - SHARED RELATIONAL DATABASE SERVICE
 * Shares real-time database state across both applications (CampusCast Admin & CampusCast User App).
 * Supports Admin Credential Changes, Excel Import/Export, and Single Login Role Detection.
 */

import * as XLSX from 'xlsx';

const STORAGE_KEY = 'campuscast_master_data_v2';

export const OFFICIAL_OPTIONAL_SUBJECTS = [
  'Painting',
  'Computer Science',
  'Informatics Practices',
  'Entrepreneurship',
  'Legal Studies',
  'Psychology',
  'Home Science',
  'Physical Education',
  'Mathematics'
];

export const OFFICIAL_SECTIONS = ['A/B', 'C', 'D/E', 'F'];
export const OFFICIAL_CLASSES = ['9', '10', '11', '12'];
export const OFFICIAL_STREAMS = ['PCM', 'PCB', 'Commerce', 'Humanities'];
export const OFFICIAL_HOUSES = [
  { name: 'Vikram', colour: 'Yellow' },
  { name: 'Vishal', colour: 'Blue' },
  { name: 'Shivaji', colour: 'Red' },
  { name: 'Ashoka', colour: 'Green' }
];

const INITIAL_MASTER_DB = {
  adminAccount: {
    id: 'ADM-001',
    name: 'Dr. Vinod Rana (School Principal / Admin)',
    password: 'admin123'
  },
  students: [
    {
      studentRecordNo: 'STU-1001',
      name: 'Ananya Sharma',
      class: '12',
      section: 'A/B',
      stream: 'PCM',
      house: 'Vikram',
      subject1: 'Physics',
      subject2: 'Chemistry',
      subject3: 'Mathematics',
      subject4: 'English Core',
      subject5: 'General Studies',
      optionalSubject1: 'Painting',
      optionalSubject2: 'Psychology',
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-STU-1001',
      generatedPassword: 'passAnanya123'
    },
    {
      studentRecordNo: 'STU-1002',
      name: 'Rahul Gupta',
      class: '11',
      section: 'C',
      stream: 'PCB',
      house: 'Vishal',
      subject1: 'Physics',
      subject2: 'Chemistry',
      subject3: 'Biology',
      subject4: 'English Core',
      subject5: 'General Studies',
      optionalSubject1: 'Physical Education',
      optionalSubject2: 'Informatics Practices',
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-STU-1002',
      generatedPassword: 'passRahul123'
    },
    {
      studentRecordNo: 'STU-1003',
      name: 'Priya Patel',
      class: '12',
      section: 'A/B',
      stream: 'Commerce',
      house: 'Vikram',
      subject1: 'Accountancy',
      subject2: 'Economics',
      subject3: 'Business Studies',
      subject4: 'English Core',
      subject5: 'General Studies',
      optionalSubject1: 'Painting',
      optionalSubject2: 'Mathematics',
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-STU-1003',
      generatedPassword: 'passPriya123'
    },
    {
      studentRecordNo: 'STU-1004',
      name: 'Aarav Mehta',
      class: '12',
      section: 'D/E',
      stream: 'Humanities',
      house: 'Shivaji',
      subject1: 'History',
      subject2: 'Political Science',
      subject3: 'Sociology',
      subject4: 'English Core',
      subject5: 'General Studies',
      optionalSubject1: 'Painting',
      optionalSubject2: 'Legal Studies',
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-STU-1004',
      generatedPassword: 'passAarav123'
    },
    {
      studentRecordNo: 'STU-1005',
      name: 'Sneha Roy',
      class: '10',
      section: 'F',
      stream: 'General',
      house: 'Ashoka',
      subject1: 'Mathematics',
      subject2: 'Science',
      subject3: 'Social Science',
      subject4: 'English',
      subject5: 'Hindi',
      optionalSubject1: 'Computer Science',
      optionalSubject2: '',
      credentialStatus: 'Not Generated',
      accountStatus: 'Active',
      generatedId: '',
      generatedPassword: ''
    }
  ],
  teachers: [
    {
      teacherRecordNo: 'TCH-2001',
      name: 'Mrs. S. Sharma',
      department: 'Fine Arts & Painting',
      subjectsTaught: ['Painting', 'Fine Arts'],
      authorizedClasses: ['9', '10', '11', '12'],
      authorizedSections: ['A/B', 'C', 'D/E', 'F'],
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-TCH-2001',
      generatedPassword: 'passTeacher123'
    },
    {
      teacherRecordNo: 'TCH-2002',
      name: 'Mr. R. K. Verma',
      department: 'Physics',
      subjectsTaught: ['Physics'],
      authorizedClasses: ['11', '12'],
      authorizedSections: ['A/B', 'C'],
      credentialStatus: 'Generated',
      accountStatus: 'Active',
      generatedId: 'CC-TCH-2002',
      generatedPassword: 'passTeacher123'
    }
  ],
  credentials: [
    {
      recordNo: 'STU-1001',
      personName: 'Ananya Sharma',
      role: 'Student',
      generatedId: 'CC-STU-1001',
      generatedPassword: 'passAnanya123',
      generatedOn: '2026-08-28T10:00:00.000Z',
      status: 'Active'
    },
    {
      recordNo: 'STU-1002',
      personName: 'Rahul Gupta',
      role: 'Student',
      generatedId: 'CC-STU-1002',
      generatedPassword: 'passRahul123',
      generatedOn: '2026-08-28T10:05:00.000Z',
      status: 'Active'
    },
    {
      recordNo: 'STU-1003',
      personName: 'Priya Patel',
      role: 'Student',
      generatedId: 'CC-STU-1003',
      generatedPassword: 'passPriya123',
      generatedOn: '2026-08-28T10:10:00.000Z',
      status: 'Active'
    },
    {
      recordNo: 'STU-1004',
      personName: 'Aarav Mehta',
      role: 'Student',
      generatedId: 'CC-STU-1004',
      generatedPassword: 'passAarav123',
      generatedOn: '2026-08-28T10:15:00.000Z',
      status: 'Active'
    },
    {
      recordNo: 'TCH-2001',
      personName: 'Mrs. S. Sharma',
      role: 'Teacher',
      generatedId: 'CC-TCH-2001',
      generatedPassword: 'passTeacher123',
      generatedOn: '2026-08-28T09:00:00.000Z',
      status: 'Active'
    },
    {
      recordNo: 'TCH-2002',
      personName: 'Mr. R. K. Verma',
      role: 'Teacher',
      generatedId: 'CC-TCH-2002',
      generatedPassword: 'passTeacher123',
      generatedOn: '2026-08-28T09:15:00.000Z',
      status: 'Active'
    }
  ],
  messages: [
    {
      id: 'MSG-5001',
      senderId: 'CC-TCH-2001',
      senderName: 'Mrs. S. Sharma (Painting Dept)',
      senderRole: 'Teacher',
      title: 'Grade 12 Painting Portfolio Exhibition & Practical Submission',
      content: 'Important notice for Grade 12 students taking Painting as an Optional Subject: Practical portfolio submission is scheduled for Thursday. Bring canvas boards and oil color still-life series to Art Studio 2 before 2:00 PM.',
      category: 'event',
      eventDate: '2026-09-03T14:00',
      eventLocation: 'Art Studio 2 (Block B)',
      createdAt: '2026-08-29T10:00:00.000Z',
      targetFilters: {
        classes: ['12'],
        sections: ['A/B'],
        streams: [],
        houses: ['Vikram'],
        optionalSubject: 'Painting',
        isSchoolWide: false
      }
    }
  ],
  eventRegistrations: [
    {
      id: 'REG-8001',
      eventId: 'MSG-5001',
      studentId: 'CC-STU-1001',
      studentName: 'Ananya Sharma',
      studentClass: '12',
      studentSection: 'A/B',
      studentHouse: 'Vikram',
      registeredAt: '2026-08-29T11:00:00.000Z'
    }
  ]
};

class DatabaseService {
  constructor() {
    this.init();
  }

  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.db = INITIAL_MASTER_DB;
      this.save();
    } else {
      try {
        this.db = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to load database, resetting to master seed', err);
        this.db = INITIAL_MASTER_DB;
        this.save();
      }
    }
  }

  reload() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.db = JSON.parse(raw);
      } catch (e) {}
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  resetToDefaults() {
    this.db = JSON.parse(JSON.stringify(INITIAL_MASTER_DB));
    this.save();
    return this.db;
  }

  // --- ADMIN LOGIN & CREDENTIAL CHANGE ---
  adminLogin(id, password) {
    this.reload();
    if (id.trim().toUpperCase() === this.db.adminAccount.id.toUpperCase() && password === this.db.adminAccount.password) {
      return { success: true, user: { ...this.db.adminAccount, role: 'admin' } };
    }
    return { success: false, message: 'Invalid Admin Credentials.' };
  }

  updateAdminCredentials(newId, newPassword) {
    if (!newId || !newPassword) return { success: false, message: 'ID and Password cannot be empty.' };
    this.db.adminAccount.id = newId.trim();
    this.db.adminAccount.password = newPassword;
    this.save();
    return { success: true, adminAccount: this.db.adminAccount, message: 'Admin login credentials updated successfully!' };
  }

  // --- UNIFIED USER LOGIN (ROLE DETECTION) ---
  loginWithRoleDetection(generatedId, password) {
    this.reload();
    const idClean = generatedId.trim().toUpperCase();

    // Check Admin account
    if (idClean === this.db.adminAccount.id.toUpperCase() && password === this.db.adminAccount.password) {
      return { success: true, role: 'admin', user: { ...this.db.adminAccount, role: 'admin' } };
    }

    // Search credentials table case-insensitively
    const cred = this.db.credentials.find(c => (c.generatedId || '').toUpperCase() === idClean);
    if (!cred) {
      return { success: false, message: `Invalid Credentials. No account found with ID "${generatedId}".` };
    }
    if (cred.status !== 'Active') {
      return { success: false, message: 'Account credential has been revoked by Administration.' };
    }
    if (cred.generatedPassword !== password) {
      return { success: false, message: 'Incorrect Password.' };
    }

    if (cred.role.toLowerCase() === 'student') {
      const student = this.db.students.find(s => 
        s.studentRecordNo === cred.recordNo || 
        (s.generatedId || '').toUpperCase() === idClean
      );
      if (!student) return { success: false, message: 'Student database record missing.' };
      return {
        success: true,
        role: 'student',
        user: {
          id: cred.generatedId,
          recordNo: student.studentRecordNo,
          name: student.name,
          role: 'student',
          class: student.class,
          section: student.section,
          stream: student.stream,
          house: student.house,
          subject1: student.subject1,
          subject2: student.subject2,
          subject3: student.subject3,
          subject4: student.subject4,
          subject5: student.subject5,
          optionalSubject1: student.optionalSubject1,
          optionalSubject2: student.optionalSubject2
        }
      };
    } else if (cred.role.toLowerCase() === 'teacher') {
      const teacher = this.db.teachers.find(t => 
        t.teacherRecordNo === cred.recordNo || 
        (t.generatedId || '').toUpperCase() === idClean
      );
      if (!teacher) return { success: false, message: 'Teacher database record missing.' };
      return {
        success: true,
        role: 'teacher',
        user: {
          id: cred.generatedId,
          recordNo: teacher.teacherRecordNo,
          name: teacher.name,
          role: 'teacher',
          department: teacher.department,
          subjectsTaught: teacher.subjectsTaught,
          authorizedClasses: teacher.authorizedClasses,
          authorizedSections: teacher.authorizedSections
        }
      };
    }

    return { success: false, message: 'Role detection failed.' };
  }

  // --- CREDENTIAL GENERATION ---
  generateStudentCredentials(studentRecordNo) {
    this.reload();
    const student = this.db.students.find(s => s.studentRecordNo === studentRecordNo);
    if (!student) return { success: false, message: 'Student record not found.' };

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const genId = `CC-STU-${randomSuffix}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let genPass = '';
    for (let i = 0; i < 8; i++) {
      genPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    student.credentialStatus = 'Generated';
    student.generatedId = genId;
    student.generatedPassword = genPass;

    const existingIndex = this.db.credentials.findIndex(c => c.recordNo === studentRecordNo);
    const credEntry = {
      recordNo: studentRecordNo,
      personName: student.name,
      role: 'Student',
      generatedId: genId,
      generatedPassword: genPass,
      generatedOn: new Date().toISOString(),
      status: 'Active'
    };

    if (existingIndex !== -1) {
      this.db.credentials[existingIndex] = credEntry;
    } else {
      this.db.credentials.unshift(credEntry);
    }

    this.save();
    return { success: true, credentials: credEntry, student };
  }

  regenerateStudentCredentials(studentRecordNo) {
    return this.generateStudentCredentials(studentRecordNo);
  }

  generateTeacherCredentials(teacherRecordNo) {
    this.reload();
    const teacher = this.db.teachers.find(t => t.teacherRecordNo === teacherRecordNo);
    if (!teacher) return { success: false, message: 'Teacher record not found.' };

    const randomSuffix = Math.floor(2000 + Math.random() * 8000);
    const genId = `CC-TCH-${randomSuffix}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let genPass = '';
    for (let i = 0; i < 8; i++) {
      genPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    teacher.credentialStatus = 'Generated';
    teacher.generatedId = genId;
    teacher.generatedPassword = genPass;

    const existingIndex = this.db.credentials.findIndex(c => c.recordNo === teacherRecordNo);
    const credEntry = {
      recordNo: teacherRecordNo,
      personName: teacher.name,
      role: 'Teacher',
      generatedId: genId,
      generatedPassword: genPass,
      generatedOn: new Date().toISOString(),
      status: 'Active'
    };

    if (existingIndex !== -1) {
      this.db.credentials[existingIndex] = credEntry;
    } else {
      this.db.credentials.unshift(credEntry);
    }

    this.save();
    return { success: true, credentials: credEntry, teacher };
  }

  // --- FILTER ENGINE ---
  calculateMatchingStudents(filters) {
    this.reload();
    const students = this.db.students;

    if (filters.isSchoolWide) {
      return { count: students.length, matchingStudents: students };
    }

    const matching = students.filter(student => {
      if (filters.classes && filters.classes.length > 0 && !filters.classes.includes(student.class)) return false;
      if (filters.sections && filters.sections.length > 0 && !filters.sections.includes(student.section)) return false;
      if (filters.streams && filters.streams.length > 0 && !filters.streams.includes(student.stream)) return false;
      if (filters.houses && filters.houses.length > 0 && !filters.houses.includes(student.house)) return false;
      
      if (filters.optionalSubject && filters.optionalSubject.trim() !== '') {
        const targetOpt = filters.optionalSubject.trim().toLowerCase();
        const opt1Matches = (student.optionalSubject1 || '').toLowerCase() === targetOpt;
        const opt2Matches = (student.optionalSubject2 || '').toLowerCase() === targetOpt;
        if (!opt1Matches && !opt2Matches) return false;
      }
      return true;
    });

    return { count: matching.length, matchingStudents: matching };
  }

  // --- BROADCAST & RSVP ---
  sendBroadcast(senderUser, messageData) {
    this.reload();
    const matchInfo = this.calculateMatchingStudents(messageData.targetFilters);

    const newMessage = {
      id: `MSG-${Date.now()}`,
      senderId: senderUser.id,
      senderName: senderUser.name,
      senderRole: senderUser.role,
      title: messageData.title,
      content: messageData.content,
      category: messageData.category || 'announcement',
      eventDate: messageData.eventDate || '',
      eventLocation: messageData.eventLocation || '',
      createdAt: new Date().toISOString(),
      targetFilters: messageData.targetFilters,
      matchingStudentCount: matchInfo.count
    };

    this.db.messages.unshift(newMessage);
    this.save();
    return { success: true, message: newMessage, recipientCount: matchInfo.count };
  }

  getStudentInbox(generatedStudentId) {
    this.reload();
    const idClean = (generatedStudentId || '').trim().toUpperCase();
    const student = this.db.students.find(s => 
      (s.generatedId || '').toUpperCase() === idClean ||
      (s.studentRecordNo || '').toUpperCase() === idClean
    );
    if (!student) return [];

    return this.db.messages.filter(msg => {
      const filters = msg.targetFilters;
      if (filters.isSchoolWide) return true;

      if (filters.classes && filters.classes.length > 0 && !filters.classes.includes(student.class)) return false;
      if (filters.sections && filters.sections.length > 0 && !filters.sections.includes(student.section)) return false;
      if (filters.streams && filters.streams.length > 0 && !filters.streams.includes(student.stream)) return false;
      if (filters.houses && filters.houses.length > 0 && !filters.houses.includes(student.house)) return false;
      
      if (filters.optionalSubject && filters.optionalSubject.trim() !== '') {
        const target = filters.optionalSubject.trim().toLowerCase();
        const opt1 = (student.optionalSubject1 || '').toLowerCase();
        const opt2 = (student.optionalSubject2 || '').toLowerCase();
        if (opt1 !== target && opt2 !== target) return false;
      }
      return true;
    });
  }

  toggleEventRegistration(eventId, studentId, studentName, studentClass, studentSection, studentHouse) {
    this.reload();
    const existingIndex = this.db.eventRegistrations.findIndex(r => r.eventId === eventId && r.studentId === studentId);

    if (existingIndex !== -1) {
      this.db.eventRegistrations.splice(existingIndex, 1);
      this.save();
      return { registered: false, message: 'Registration cancelled.' };
    } else {
      const reg = {
        id: `REG-${Date.now()}`,
        eventId,
        studentId,
        studentName,
        studentClass,
        studentSection,
        studentHouse,
        registeredAt: new Date().toISOString()
      };
      this.db.eventRegistrations.push(reg);
      this.save();
      return { registered: true, message: 'Registered for event!' };
    }
  }

  isStudentRegistered(eventId, studentId) {
    this.reload();
    return this.db.eventRegistrations.some(r => r.eventId === eventId && r.studentId === studentId);
  }

  getRegistrationsForEvent(eventId) {
    this.reload();
    return this.db.eventRegistrations.filter(r => r.eventId === eventId);
  }

  // --- EXCEL ---
  exportToExcel() {
    this.reload();
    const wb = XLSX.utils.book_new();

    const studentsData = this.db.students.map(s => ({
      'Student Record No.': s.studentRecordNo,
      'Student Name': s.name,
      'Class': s.class,
      'Section': s.section,
      'Stream': s.stream,
      'House': s.house,
      'Subject 1': s.subject1,
      'Subject 2': s.subject2,
      'Subject 3': s.subject3,
      'Subject 4': s.subject4,
      'Subject 5': s.subject5,
      'Optional Subject 1': s.optionalSubject1,
      'Optional Subject 2': s.optionalSubject2,
      'Credential Status': s.credentialStatus,
      'Account Status': s.accountStatus
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(studentsData), 'STUDENTS');

    const teachersData = this.db.teachers.map(t => ({
      'Teacher Record No.': t.teacherRecordNo,
      'Teacher Name': t.name,
      'Department': t.department,
      'Subjects Taught': (t.subjectsTaught || []).join(', '),
      'Authorized Classes': (t.authorizedClasses || []).join(', '),
      'Authorized Sections': (t.authorizedSections || []).join(', '),
      'Credential Status': t.credentialStatus,
      'Account Status': t.accountStatus
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(teachersData), 'TEACHERS');

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(OFFICIAL_OPTIONAL_SUBJECTS.map(s => ({ 'Optional Subject': s }))), 'SUBJECTS');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(OFFICIAL_HOUSES.map(h => ({ 'House': h.name, 'Colour': h.colour }))), 'HOUSES');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(this.db.credentials), 'CREDENTIALS');

    XLSX.writeFile(wb, 'CampusCast_Data.xlsx');
  }

  importFromExcel(fileArrayBuffer) {
    try {
      const wb = XLSX.read(fileArrayBuffer, { type: 'array' });
      const errors = [];

      if (wb.SheetNames.includes('STUDENTS')) {
        const rawStudents = XLSX.utils.sheet_to_json(wb.Sheets['STUDENTS']);
        const importedStudents = [];

        rawStudents.forEach((row, idx) => {
          const lineNo = idx + 2;
          const name = row['Student Name'] || row['name'];
          if (!name) {
            errors.push(`Row ${lineNo}: Missing Student Name.`);
            return;
          }
          const cls = String(row['Class'] || row['class'] || '');
          if (!OFFICIAL_CLASSES.includes(cls)) {
            errors.push(`Row ${lineNo} (${name}): Invalid Class "${cls}". Must be 9, 10, 11, or 12.`);
          }
          const sec = String(row['Section'] || row['section'] || '');
          if (!OFFICIAL_SECTIONS.includes(sec)) {
            errors.push(`Row ${lineNo} (${name}): Invalid Section "${sec}". Must be A/B, C, D/E, or F.`);
          }
          const opt1 = row['Optional Subject 1'] || row['optionalSubject1'] || '';
          const opt2 = row['Optional Subject 2'] || row['optionalSubject2'] || '';
          if (opt1 && opt2 && opt1 === opt2) {
            errors.push(`Row ${lineNo} (${name}): Optional Subjects 1 & 2 cannot be identical ("${opt1}").`);
          }

          importedStudents.push({
            studentRecordNo: row['Student Record No.'] || `STU-${1000 + idx + 1}`,
            name,
            class: cls,
            section: sec,
            stream: row['Stream'] || 'General',
            house: row['House'] || 'Vikram',
            subject1: row['Subject 1'] || 'English',
            subject2: row['Subject 2'] || '',
            subject3: row['Subject 3'] || '',
            subject4: row['Subject 4'] || '',
            subject5: row['Subject 5'] || '',
            optionalSubject1: opt1,
            optionalSubject2: opt2,
            credentialStatus: row['Credential Status'] || 'Not Generated',
            accountStatus: row['Account Status'] || 'Active',
            generatedId: row['Generated ID'] || '',
            generatedPassword: row['Generated Password'] || ''
          });
        });

        if (errors.length > 0) return { success: false, errors };
        this.db.students = importedStudents;
      }

      this.save();
      return { success: true, message: 'CampusCast_Data.xlsx imported successfully!' };
    } catch (err) {
      return { success: false, errors: [`Failed to parse Excel workbook: ${err.message}`] };
    }
  }

  // GETTERS
  getAllStudents() { this.reload(); return this.db.students; }
  getAllTeachers() { this.reload(); return this.db.teachers; }
  getAllCredentials() { this.reload(); return this.db.credentials; }
  getAllMessages() { this.reload(); return this.db.messages; }
  getAdminAccount() { this.reload(); return this.db.adminAccount; }
}

export const dbService = new DatabaseService();
