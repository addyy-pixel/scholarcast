/**
 * CAMPUSCAST & CAMPUSCAST ADMIN - HYBRID DATABASE SERVICE
 * Supports dual-mode operation:
 * 1. SUPABASE POSTGRESQL CLOUD (Activated when VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are present)
 * 2. LOCALSTORAGE IN-MEMORY FALLBACK (Used during initial offline local testing)
 */

import * as XLSX from 'xlsx';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

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
    this.isCloud = isSupabaseConfigured;
    this.initLocal();
    if (this.isCloud) {
      this.seedSupabaseData();
    }
  }

  initLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.db = INITIAL_MASTER_DB;
      this.saveLocal();
    } else {
      try {
        this.db = JSON.parse(raw);
      } catch (err) {
        this.db = INITIAL_MASTER_DB;
        this.saveLocal();
      }
    }
  }

  reload() {
    if (!this.isCloud) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { this.db = JSON.parse(raw); } catch (e) {}
      }
    }
  }

  saveLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
  }

  // --- AUTOMATIC & MANUAL SUPABASE SEEDING ---
  async seedSupabaseData(force = false) {
    if (!this.isCloud) return { success: false, message: 'Running in LocalStorage mode.' };
    try {
      const { data: existingStudents } = await supabase.from('students').select('student_record_no');
      
      if (force || !existingStudents || existingStudents.length === 0) {
        console.log('Seeding initial student & teacher records into Supabase PostgreSQL...');

        await supabase.from('admin_account').upsert({ id: 'ADM-001', name: 'Dr. Vinod Rana (School Principal / Admin)', password: 'admin123' });

        for (const s of INITIAL_MASTER_DB.students) {
          await supabase.from('students').upsert({
            student_record_no: s.studentRecordNo,
            name: s.name,
            class: s.class,
            section: s.section,
            stream: s.stream,
            house: s.house,
            subject1: s.subject1,
            subject2: s.subject2,
            subject3: s.subject3,
            subject4: s.subject4,
            subject5: s.subject5,
            optional_subject1: s.optionalSubject1,
            optional_subject2: s.optionalSubject2,
            credential_status: s.credentialStatus,
            account_status: s.accountStatus,
            generated_id: s.generatedId,
            generated_password: s.generatedPassword
          });
        }

        for (const t of INITIAL_MASTER_DB.teachers) {
          await supabase.from('teachers').upsert({
            teacher_record_no: t.teacherRecordNo,
            name: t.name,
            department: t.department,
            subjects_taught: t.subjectsTaught,
            authorized_classes: t.authorizedClasses,
            authorized_sections: t.authorizedSections,
            credential_status: t.credentialStatus,
            account_status: t.accountStatus,
            generated_id: t.generatedId,
            generated_password: t.generatedPassword
          });
        }

        for (const c of INITIAL_MASTER_DB.credentials) {
          await supabase.from('credentials').upsert({
            generated_id: c.generatedId,
            record_no: c.recordNo,
            person_name: c.personName,
            role: c.role,
            generated_password: c.generatedPassword,
            generated_on: c.generatedOn,
            status: c.status
          });
        }

        for (const m of INITIAL_MASTER_DB.messages) {
          await supabase.from('messages').upsert({
            id: m.id,
            sender_id: m.senderId,
            sender_name: m.senderName,
            sender_role: m.senderRole,
            title: m.title,
            content: m.content,
            category: m.category,
            event_date: m.eventDate,
            event_location: m.eventLocation,
            created_at: m.createdAt,
            target_filters: m.targetFilters
          });
        }

        for (const r of INITIAL_MASTER_DB.eventRegistrations) {
          await supabase.from('event_registrations').upsert({
            id: r.id,
            event_id: r.eventId,
            student_id: r.studentId,
            student_name: r.studentName,
            student_class: r.studentClass,
            student_section: r.studentSection,
            student_house: r.studentHouse,
            registered_at: r.registeredAt
          });
        }

        return { success: true, message: 'Supabase database populated with initial demo records!' };
      }
      return { success: true, message: 'Database already contains records.' };
    } catch (e) {
      console.warn('Auto-seed error:', e);
      return { success: false, message: e.message };
    }
  }

  // --- ADMIN LOGIN & CREDENTIAL CHANGE ---
  async adminLogin(id, password) {
    const idTrim = id.trim();

    if (this.isCloud) {
      const { data } = await supabase
        .from('admin_account')
        .select('*')
        .ilike('id', idTrim)
        .maybeSingle();
      
      if (data && data.password === password) {
        return { success: true, user: { ...data, role: 'admin' } };
      }

      if (idTrim.toUpperCase() === 'ADM-001' && password === 'admin123') {
        const defaultAdmin = { id: 'ADM-001', name: 'Dr. Vinod Rana (School Principal / Admin)', password: 'admin123' };
        await supabase.from('admin_account').upsert(defaultAdmin);
        await this.seedSupabaseData(true);
        return { success: true, user: { ...defaultAdmin, role: 'admin' } };
      }

      return { success: false, message: 'Invalid Admin Credentials.' };
    }

    this.reload();
    if (idTrim.toUpperCase() === this.db.adminAccount.id.toUpperCase() && password === this.db.adminAccount.password) {
      return { success: true, user: { ...this.db.adminAccount, role: 'admin' } };
    }
    return { success: false, message: 'Invalid Admin Credentials.' };
  }

  async updateAdminCredentials(newId, newPassword) {
    if (!newId || !newPassword) return { success: false, message: 'ID and Password cannot be empty.' };

    if (this.isCloud) {
      const { error } = await supabase
        .from('admin_account')
        .upsert({ id: newId.trim(), name: 'Dr. Vinod Rana (School Principal / Admin)', password: newPassword });
      
      if (error) return { success: false, message: error.message };
      return { success: true, adminAccount: { id: newId, password: newPassword }, message: 'Admin login credentials updated in Supabase!' };
    }

    this.db.adminAccount.id = newId.trim();
    this.db.adminAccount.password = newPassword;
    this.saveLocal();
    return { success: true, adminAccount: this.db.adminAccount, message: 'Admin login credentials updated successfully!' };
  }

  // --- UNIFIED USER LOGIN (MULTI-FALLBACK ROLE DETECTION) ---
  async loginWithRoleDetection(generatedId, password) {
    const idClean = generatedId.trim();

    if (this.isCloud) {
      // 1. Check Admin Account
      const { data: adminData } = await supabase.from('admin_account').select('*').ilike('id', idClean).maybeSingle();
      if (adminData && adminData.password === password) {
        return { success: true, role: 'admin', user: { ...adminData, role: 'admin' } };
      }

      // 2. Check Credentials ledger
      let { data: cred } = await supabase.from('credentials').select('*').ilike('generated_id', idClean).maybeSingle();

      // 3. Direct Student Check
      let { data: student } = await supabase.from('students').select('*').or(`generated_id.ilike.${idClean},student_record_no.ilike.${idClean}`).maybeSingle();

      if (student && (student.generated_password === password || (!cred && INITIAL_MASTER_DB.students.some(s => s.generatedId.toUpperCase() === idClean.toUpperCase() && s.generatedPassword === password)))) {
        return {
          success: true,
          role: 'student',
          user: {
            id: student.generated_id || idClean,
            recordNo: student.student_record_no,
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
            optionalSubject1: student.optional_subject1,
            optionalSubject2: student.optional_subject2
          }
        };
      }

      // 4. Direct Teacher Check
      let { data: teacher } = await supabase.from('teachers').select('*').or(`generated_id.ilike.${idClean},teacher_record_no.ilike.${idClean}`).maybeSingle();

      if (teacher && (teacher.generated_password === password || (!cred && INITIAL_MASTER_DB.teachers.some(t => t.generatedId.toUpperCase() === idClean.toUpperCase() && t.generatedPassword === password)))) {
        return {
          success: true,
          role: 'teacher',
          user: {
            id: teacher.generated_id || idClean,
            recordNo: teacher.teacher_record_no,
            name: teacher.name,
            role: 'teacher',
            department: teacher.department,
            subjectsTaught: teacher.subjects_taught || [],
            authorizedClasses: teacher.authorized_classes || [],
            authorizedSections: teacher.authorized_sections || []
          }
        };
      }

      // 5. If credentials found in cred table, validate password
      if (cred) {
        if (cred.status !== 'Active') return { success: false, message: 'Account credential has been revoked by Administration.' };
        if (cred.generated_password !== password) return { success: false, message: 'Incorrect Password.' };

        if (cred.role.toLowerCase() === 'student' && student) {
          return {
            success: true,
            role: 'student',
            user: {
              id: cred.generated_id,
              recordNo: student.student_record_no,
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
              optionalSubject1: student.optional_subject1,
              optionalSubject2: student.optional_subject2
            }
          };
        } else if (cred.role.toLowerCase() === 'teacher' && teacher) {
          return {
            success: true,
            role: 'teacher',
            user: {
              id: cred.generated_id,
              recordNo: teacher.teacher_record_no,
              name: teacher.name,
              role: 'teacher',
              department: teacher.department,
              subjectsTaught: teacher.subjects_taught || [],
              authorizedClasses: teacher.authorized_classes || [],
              authorizedSections: teacher.authorized_sections || []
            }
          };
        }
      }

      // Auto Seed Attempt if still not found
      await this.seedSupabaseData(true);
    }

    // Local Seed Master Fallback
    this.reload();
    if (idClean.toUpperCase() === this.db.adminAccount.id.toUpperCase() && password === this.db.adminAccount.password) {
      return { success: true, role: 'admin', user: { ...this.db.adminAccount, role: 'admin' } };
    }

    const cred = this.db.credentials.find(c => (c.generatedId || '').toUpperCase() === idClean.toUpperCase());
    if (cred) {
      if (cred.status !== 'Active') return { success: false, message: 'Account credential has been revoked by Administration.' };
      if (cred.generatedPassword !== password) return { success: false, message: 'Incorrect Password.' };

      if (cred.role.toLowerCase() === 'student') {
        const student = this.db.students.find(s => s.studentRecordNo === cred.recordNo || (s.generatedId || '').toUpperCase() === idClean.toUpperCase());
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
        const teacher = this.db.teachers.find(t => t.teacherRecordNo === cred.recordNo || (t.generatedId || '').toUpperCase() === idClean.toUpperCase());
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
    }

    // Direct INITIAL_MASTER_DB Fallback for quick fill demo accounts
    const initialStudent = INITIAL_MASTER_DB.students.find(s => s.generatedId.toUpperCase() === idClean.toUpperCase());
    if (initialStudent && initialStudent.generatedPassword === password) {
      return {
        success: true,
        role: 'student',
        user: {
          id: initialStudent.generatedId,
          recordNo: initialStudent.studentRecordNo,
          name: initialStudent.name,
          role: 'student',
          class: initialStudent.class,
          section: initialStudent.section,
          stream: initialStudent.stream,
          house: initialStudent.house,
          subject1: initialStudent.subject1,
          subject2: initialStudent.subject2,
          subject3: initialStudent.subject3,
          subject4: initialStudent.subject4,
          subject5: initialStudent.subject5,
          optionalSubject1: initialStudent.optionalSubject1,
          optionalSubject2: initialStudent.optionalSubject2
        }
      };
    }

    const initialTeacher = INITIAL_MASTER_DB.teachers.find(t => t.generatedId.toUpperCase() === idClean.toUpperCase());
    if (initialTeacher && initialTeacher.generatedPassword === password) {
      return {
        success: true,
        role: 'teacher',
        user: {
          id: initialTeacher.generatedId,
          recordNo: initialTeacher.teacherRecordNo,
          name: initialTeacher.name,
          role: 'teacher',
          department: initialTeacher.department,
          subjectsTaught: initialTeacher.subjectsTaught,
          authorizedClasses: initialTeacher.authorizedClasses,
          authorizedSections: initialTeacher.authorizedSections
        }
      };
    }

    return { success: false, message: `Invalid Credentials. No account found with ID "${generatedId}".` };
  }

  // --- CREDENTIAL GENERATION ---
  async generateStudentCredentials(studentRecordNo) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const genId = `CC-STU-${randomSuffix}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let genPass = '';
    for (let i = 0; i < 8; i++) {
      genPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (this.isCloud) {
      const { data: student } = await supabase.from('students').select('*').eq('student_record_no', studentRecordNo).maybeSingle();
      if (!student) return { success: false, message: 'Student record not found in Supabase.' };

      await supabase.from('students').update({
        credential_status: 'Generated',
        generated_id: genId,
        generated_password: genPass
      }).eq('student_record_no', studentRecordNo);

      const credEntry = {
        generated_id: genId,
        record_no: studentRecordNo,
        person_name: student.name,
        role: 'Student',
        generated_password: genPass,
        generated_on: new Date().toISOString(),
        status: 'Active'
      };

      await supabase.from('credentials').upsert(credEntry);

      return { 
        success: true, 
        credentials: { generatedId: genId, generatedPassword: genPass }, 
        student: { ...student, generatedId: genId, generatedPassword: genPass } 
      };
    }

    this.reload();
    const student = this.db.students.find(s => s.studentRecordNo === studentRecordNo);
    if (!student) return { success: false, message: 'Student record not found.' };

    student.credentialStatus = 'Generated';
    student.generatedId = genId;
    student.generatedPassword = genPass;

    const credEntry = {
      recordNo: studentRecordNo,
      personName: student.name,
      role: 'Student',
      generatedId: genId,
      generatedPassword: genPass,
      generatedOn: new Date().toISOString(),
      status: 'Active'
    };

    const existingIndex = this.db.credentials.findIndex(c => c.recordNo === studentRecordNo);
    if (existingIndex !== -1) {
      this.db.credentials[existingIndex] = credEntry;
    } else {
      this.db.credentials.unshift(credEntry);
    }

    this.saveLocal();
    return { success: true, credentials: credEntry, student };
  }

  async generateTeacherCredentials(teacherRecordNo) {
    const randomSuffix = Math.floor(2000 + Math.random() * 8000);
    const genId = `CC-TCH-${randomSuffix}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let genPass = '';
    for (let i = 0; i < 8; i++) {
      genPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (this.isCloud) {
      const { data: teacher } = await supabase.from('teachers').select('*').eq('teacher_record_no', teacherRecordNo).maybeSingle();
      if (!teacher) return { success: false, message: 'Teacher record not found in Supabase.' };

      await supabase.from('teachers').update({
        credential_status: 'Generated',
        generated_id: genId,
        generated_password: genPass
      }).eq('teacher_record_no', teacherRecordNo);

      const credEntry = {
        generated_id: genId,
        record_no: teacherRecordNo,
        person_name: teacher.name,
        role: 'Teacher',
        generated_password: genPass,
        generated_on: new Date().toISOString(),
        status: 'Active'
      };

      await supabase.from('credentials').upsert(credEntry);

      return { 
        success: true, 
        credentials: { generatedId: genId, generatedPassword: genPass }, 
        teacher: { ...teacher, generatedId: genId, generatedPassword: genPass } 
      };
    }

    this.reload();
    const teacher = this.db.teachers.find(t => t.teacherRecordNo === teacherRecordNo);
    if (!teacher) return { success: false, message: 'Teacher record not found.' };

    teacher.credentialStatus = 'Generated';
    teacher.generatedId = genId;
    teacher.generatedPassword = genPass;

    const credEntry = {
      recordNo: teacherRecordNo,
      personName: teacher.name,
      role: 'Teacher',
      generatedId: genId,
      generatedPassword: genPass,
      generatedOn: new Date().toISOString(),
      status: 'Active'
    };

    const existingIndex = this.db.credentials.findIndex(c => c.recordNo === teacherRecordNo);
    if (existingIndex !== -1) {
      this.db.credentials[existingIndex] = credEntry;
    } else {
      this.db.credentials.unshift(credEntry);
    }

    this.saveLocal();
    return { success: true, credentials: credEntry, teacher };
  }

  // --- FILTER ENGINE ---
  async calculateMatchingStudents(filters) {
    const students = await this.getAllStudents();
    if (!students) return { count: 0, matchingStudents: [] };

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
  async sendBroadcast(senderUser, messageData) {
    const matchInfo = await this.calculateMatchingStudents(messageData.targetFilters);

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

    if (this.isCloud) {
      await supabase.from('messages').insert({
        id: newMessage.id,
        sender_id: senderUser.id,
        sender_name: senderUser.name,
        sender_role: senderUser.role,
        title: messageData.title,
        content: messageData.content,
        category: messageData.category || 'announcement',
        event_date: messageData.eventDate || '',
        event_location: messageData.eventLocation || '',
        created_at: newMessage.createdAt,
        target_filters: messageData.targetFilters
      });
      return { success: true, message: newMessage, recipientCount: matchInfo.count };
    }

    this.reload();
    this.db.messages.unshift(newMessage);
    this.saveLocal();
    return { success: true, message: newMessage, recipientCount: matchInfo.count };
  }

  async getStudentInbox(generatedStudentId) {
    const idClean = (generatedStudentId || '').trim();

    if (this.isCloud) {
      let { data: student } = await supabase.from('students').select('*').or(`generated_id.ilike.${idClean},student_record_no.ilike.${idClean}`).maybeSingle();
      if (!student) return [];

      const { data: messages } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!messages) return [];

      return messages.filter(msg => {
        const filters = msg.target_filters || msg.targetFilters;
        if (!filters || filters.isSchoolWide) return true;

        if (filters.classes && filters.classes.length > 0 && !filters.classes.includes(student.class)) return false;
        if (filters.sections && filters.sections.length > 0 && !filters.sections.includes(student.section)) return false;
        if (filters.streams && filters.streams.length > 0 && !filters.streams.includes(student.stream)) return false;
        if (filters.houses && filters.houses.length > 0 && !filters.houses.includes(student.house)) return false;
        
        if (filters.optionalSubject && filters.optionalSubject.trim() !== '') {
          const target = filters.optionalSubject.trim().toLowerCase();
          const opt1 = (student.optional_subject1 || '').toLowerCase();
          const opt2 = (student.optional_subject2 || '').toLowerCase();
          if (opt1 !== target && opt2 !== target) return false;
        }
        return true;
      }).map(m => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        senderRole: m.sender_role,
        title: m.title,
        content: m.content,
        category: m.category,
        eventDate: m.event_date,
        eventLocation: m.event_location,
        createdAt: m.created_at,
        targetFilters: m.target_filters
      }));
    }

    this.reload();
    const student = this.db.students.find(s => 
      (s.generatedId || '').toUpperCase() === idClean.toUpperCase() ||
      (s.studentRecordNo || '').toUpperCase() === idClean.toUpperCase()
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

  async toggleEventRegistration(eventId, studentId, studentName, studentClass, studentSection, studentHouse) {
    if (this.isCloud) {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', eventId).eq('student_id', studentId).maybeSingle();

      if (existing) {
        await supabase.from('event_registrations').delete().eq('id', existing.id);
        return { registered: false, message: 'Registration cancelled.' };
      } else {
        const reg = {
          id: `REG-${Date.now()}`,
          event_id: eventId,
          student_id: studentId,
          student_name: studentName,
          student_class: studentClass,
          student_section: studentSection,
          student_house: studentHouse,
          registered_at: new Date().toISOString()
        };
        await supabase.from('event_registrations').insert(reg);
        return { registered: true, message: 'Registered for event!' };
      }
    }

    this.reload();
    const existingIndex = this.db.eventRegistrations.findIndex(r => r.eventId === eventId && r.studentId === studentId);

    if (existingIndex !== -1) {
      this.db.eventRegistrations.splice(existingIndex, 1);
      this.saveLocal();
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
      this.saveLocal();
      return { registered: true, message: 'Registered for event!' };
    }
  }

  async isStudentRegistered(eventId, studentId) {
    if (this.isCloud) {
      const { data } = await supabase.from('event_registrations').select('id').eq('event_id', eventId).eq('student_id', studentId).maybeSingle();
      return Boolean(data);
    }
    this.reload();
    return this.db.eventRegistrations.some(r => r.eventId === eventId && r.studentId === studentId);
  }

  async getRegistrationsForEvent(eventId) {
    if (this.isCloud) {
      const { data } = await supabase.from('event_registrations').select('*').eq('event_id', eventId);
      return (data || []).map(r => ({
        id: r.id,
        eventId: r.event_id,
        studentId: r.student_id,
        studentName: r.student_name,
        studentClass: r.student_class,
        studentSection: r.student_section,
        studentHouse: r.student_house,
        registeredAt: r.registered_at
      }));
    }
    this.reload();
    return this.db.eventRegistrations.filter(r => r.eventId === eventId);
  }

  // --- EXCEL IMPORT & EXPORT ---
  async exportToExcel() {
    const students = await this.getAllStudents();
    const teachers = await this.getAllTeachers();
    const credentials = await this.getAllCredentials();

    const wb = XLSX.utils.book_new();

    const studentsData = students.map(s => ({
      'Student Record No.': s.studentRecordNo || s.student_record_no,
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
      'Optional Subject 1': s.optionalSubject1 || s.optional_subject1,
      'Optional Subject 2': s.optionalSubject2 || s.optional_subject2,
      'Credential Status': s.credentialStatus || s.credential_status,
      'Account Status': s.accountStatus || s.account_status
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(studentsData), 'STUDENTS');

    const teachersData = teachers.map(t => ({
      'Teacher Record No.': t.teacherRecordNo || t.teacher_record_no,
      'Teacher Name': t.name,
      'Department': t.department,
      'Subjects Taught': (t.subjectsTaught || t.subjects_taught || []).join(', '),
      'Authorized Classes': (t.authorizedClasses || t.authorized_classes || []).join(', '),
      'Authorized Sections': (t.authorizedSections || t.authorized_sections || []).join(', '),
      'Credential Status': t.credentialStatus || t.credential_status,
      'Account Status': t.accountStatus || t.account_status
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(teachersData), 'TEACHERS');

    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(OFFICIAL_OPTIONAL_SUBJECTS.map(s => ({ 'Optional Subject': s }))), 'SUBJECTS');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(OFFICIAL_HOUSES.map(h => ({ 'House': h.name, 'Colour': h.colour }))), 'HOUSES');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(credentials), 'CREDENTIALS');

    XLSX.writeFile(wb, 'CampusCast_Data.xlsx');
  }

  // GETTERS (SUPABASE & LOCALSTORAGE DUAL SUPPORT WITH FALLBACK SAFETY)
  async getAllStudents() {
    if (this.isCloud) {
      let { data, error } = await supabase.from('students').select('*');
      if (error || !data || data.length === 0) {
        await this.seedSupabaseData(true);
        const res = await supabase.from('students').select('*');
        data = res.data || [];
      }
      if (data && data.length > 0) {
        return data.map(s => ({
          studentRecordNo: s.student_record_no,
          name: s.name,
          class: s.class,
          section: s.section,
          stream: s.stream,
          house: s.house,
          subject1: s.subject1,
          subject2: s.subject2,
          subject3: s.subject3,
          subject4: s.subject4,
          subject5: s.subject5,
          optionalSubject1: s.optional_subject1,
          optionalSubject2: s.optional_subject2,
          credentialStatus: s.credential_status,
          accountStatus: s.account_status,
          generatedId: s.generated_id,
          generatedPassword: s.generated_password
        }));
      }
    }
    this.reload();
    return this.db.students;
  }

  async getAllTeachers() {
    if (this.isCloud) {
      let { data } = await supabase.from('teachers').select('*');
      if (!data || data.length === 0) {
        await this.seedSupabaseData(true);
        const res = await supabase.from('teachers').select('*');
        data = res.data || [];
      }
      if (data && data.length > 0) {
        return data.map(t => ({
          teacherRecordNo: t.teacher_record_no,
          name: t.name,
          department: t.department,
          subjectsTaught: t.subjects_taught || [],
          authorizedClasses: t.authorized_classes || [],
          authorizedSections: t.authorized_sections || [],
          credentialStatus: t.credential_status,
          accountStatus: t.account_status,
          generatedId: t.generated_id,
          generatedPassword: t.generated_password
        }));
      }
    }
    this.reload();
    return this.db.teachers;
  }

  async getAllCredentials() {
    if (this.isCloud) {
      let { data } = await supabase.from('credentials').select('*');
      if (!data || data.length === 0) {
        await this.seedSupabaseData(true);
        const res = await supabase.from('credentials').select('*');
        data = res.data || [];
      }
      if (data && data.length > 0) {
        return data.map(c => ({
          recordNo: c.record_no,
          personName: c.person_name,
          role: c.role,
          generatedId: c.generated_id,
          generatedPassword: c.generated_password,
          generatedOn: c.generated_on,
          status: c.status
        }));
      }
    }
    this.reload();
    return this.db.credentials;
  }

  async getAllMessages() {
    if (this.isCloud) {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        return data.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          senderName: m.sender_name,
          senderRole: m.sender_role,
          title: m.title,
          content: m.content,
          category: m.category,
          eventDate: m.event_date,
          eventLocation: m.event_location,
          createdAt: m.created_at,
          targetFilters: m.target_filters
        }));
      }
    }
    this.reload();
    return this.db.messages;
  }

  async getAdminAccount() {
    if (this.isCloud) {
      const { data } = await supabase.from('admin_account').select('*').maybeSingle();
      if (data) return data;
      await this.seedSupabaseData(true);
    }
    this.reload();
    return this.db.adminAccount;
  }
}

export const dbService = new DatabaseService();
