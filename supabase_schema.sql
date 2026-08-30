-- ====================================================================
-- CAMPUSCAST - SUPABASE POSTGRESQL FULL DATABASE SCHEMA & SEED DATA
-- Copy and paste this ENTIRE script into Supabase SQL Editor and click RUN.
-- ====================================================================

-- 1. DROP EXISTING TABLES IF ANY (Clean Reset)
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS admin_account CASCADE;

-- 2. CREATE ADMIN ACCOUNT TABLE
CREATE TABLE admin_account (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL
);

-- 3. CREATE STUDENTS TABLE
CREATE TABLE students (
  student_record_no TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  stream TEXT NOT NULL,
  house TEXT NOT NULL,
  subject1 TEXT,
  subject2 TEXT,
  subject3 TEXT,
  subject4 TEXT,
  subject5 TEXT,
  optional_subject1 TEXT,
  optional_subject2 TEXT,
  credential_status TEXT DEFAULT 'Not Generated',
  account_status TEXT DEFAULT 'Active',
  generated_id TEXT DEFAULT '',
  generated_password TEXT DEFAULT ''
);

-- 4. CREATE TEACHERS TABLE
CREATE TABLE teachers (
  teacher_record_no TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  subjects_taught TEXT[] DEFAULT '{}',
  authorized_classes TEXT[] DEFAULT '{}',
  authorized_sections TEXT[] DEFAULT '{}',
  credential_status TEXT DEFAULT 'Not Generated',
  account_status TEXT DEFAULT 'Active',
  generated_id TEXT DEFAULT '',
  generated_password TEXT DEFAULT ''
);

-- 5. CREATE CREDENTIALS LEDGER TABLE
CREATE TABLE credentials (
  generated_id TEXT PRIMARY KEY,
  record_no TEXT NOT NULL,
  person_name TEXT NOT NULL,
  role TEXT NOT NULL,
  generated_password TEXT NOT NULL,
  generated_on TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'Active'
);

-- 6. CREATE MESSAGES (BROADCASTS) TABLE
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'announcement',
  event_date TEXT DEFAULT '',
  event_location TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  target_filters JSONB NOT NULL
);

-- 7. CREATE EVENT REGISTRATIONS TABLE
CREATE TABLE event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  student_section TEXT NOT NULL,
  student_house TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ENABLE RLS AND GRANT PUBLIC ACCESS POLICIES
ALTER TABLE admin_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all on admin_account" ON admin_account;
DROP POLICY IF EXISTS "Allow public all on students" ON students;
DROP POLICY IF EXISTS "Allow public all on teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public all on credentials" ON credentials;
DROP POLICY IF EXISTS "Allow public all on messages" ON messages;
DROP POLICY IF EXISTS "Allow public all on event_registrations" ON event_registrations;

CREATE POLICY "Allow public all on admin_account" ON admin_account FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on credentials" ON credentials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on event_registrations" ON event_registrations FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- 9. ENABLE SUPABASE REALTIME FOR LIVE BROADCAST NOTIFICATIONS
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE messages, event_registrations;
COMMIT;

-- ====================================================================
-- SEED DATA (INITIAL MASTER DATA)
-- ====================================================================

-- Seed Admin Account
INSERT INTO admin_account (id, name, password) VALUES 
('ADM-001', 'Dr. Vinod Rana (School Principal / Admin)', 'admin123');

-- Seed Students
INSERT INTO students (student_record_no, name, class, section, stream, house, subject1, subject2, subject3, subject4, subject5, optional_subject1, optional_subject2, credential_status, account_status, generated_id, generated_password) VALUES
('STU-1001', 'Ananya Sharma', '12', 'A/B', 'PCM', 'Vikram', 'Physics', 'Chemistry', 'Mathematics', 'English Core', 'General Studies', 'Painting', 'Psychology', 'Generated', 'Active', 'CC-STU-1001', 'passAnanya123'),
('STU-1002', 'Rahul Gupta', '11', 'C', 'PCB', 'Vishal', 'Physics', 'Chemistry', 'Biology', 'English Core', 'General Studies', 'Physical Education', 'Informatics Practices', 'Generated', 'Active', 'CC-STU-1002', 'passRahul123'),
('STU-1003', 'Priya Patel', '12', 'A/B', 'Commerce', 'Vikram', 'Accountancy', 'Economics', 'Business Studies', 'English Core', 'General Studies', 'Painting', 'Mathematics', 'Generated', 'Active', 'CC-STU-1003', 'passPriya123'),
('STU-1004', 'Aarav Mehta', '12', 'D/E', 'Humanities', 'Shivaji', 'History', 'Political Science', 'Sociology', 'English Core', 'General Studies', 'Painting', 'Legal Studies', 'Generated', 'Active', 'CC-STU-1004', 'passAarav123'),
('STU-1005', 'Sneha Roy', '10', 'F', 'General', 'Ashoka', 'Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer Science', '', 'Not Generated', 'Active', '', '');

-- Seed Teachers
INSERT INTO teachers (teacher_record_no, name, department, subjects_taught, authorized_classes, authorized_sections, credential_status, account_status, generated_id, generated_password) VALUES
('TCH-2001', 'Mrs. S. Sharma', 'Fine Arts & Painting', ARRAY['Painting', 'Fine Arts'], ARRAY['9', '10', '11', '12'], ARRAY['A/B', 'C', 'D/E', 'F'], 'Generated', 'Active', 'CC-TCH-2001', 'passTeacher123'),
('TCH-2002', 'Mr. R. K. Verma', 'Physics', ARRAY['Physics'], ARRAY['11', '12'], ARRAY['A/B', 'C'], 'Generated', 'Active', 'CC-TCH-2002', 'passTeacher123');

-- Seed Credentials Ledger
INSERT INTO credentials (record_no, person_name, role, generated_id, generated_password, generated_on, status) VALUES
('STU-1001', 'Ananya Sharma', 'Student', 'CC-STU-1001', 'passAnanya123', '2026-08-28T10:00:00.000Z', 'Active'),
('STU-1002', 'Rahul Gupta', 'Student', 'CC-STU-1002', 'passRahul123', '2026-08-28T10:05:00.000Z', 'Active'),
('STU-1003', 'Priya Patel', 'Student', 'CC-STU-1003', 'passPriya123', '2026-08-28T10:10:00.000Z', 'Active'),
('STU-1004', 'Aarav Mehta', 'Student', 'CC-STU-1004', 'passAarav123', '2026-08-28T10:15:00.000Z', 'Active'),
('TCH-2001', 'Mrs. S. Sharma', 'Teacher', 'CC-TCH-2001', 'passTeacher123', '2026-08-28T09:00:00.000Z', 'Active'),
('TCH-2002', 'Mr. R. K. Verma', 'Teacher', 'CC-TCH-2002', 'passTeacher123', '2026-08-28T09:15:00.000Z', 'Active');

-- Seed Demo Message
INSERT INTO messages (id, sender_id, sender_name, sender_role, title, content, category, event_date, event_location, created_at, target_filters) VALUES
('MSG-5001', 'CC-TCH-2001', 'Mrs. S. Sharma (Painting Dept)', 'Teacher', 'Grade 12 Painting Portfolio Exhibition & Practical Submission', 'Important notice for Grade 12 students taking Painting as an Optional Subject: Practical portfolio submission is scheduled for Thursday. Bring canvas boards and oil color still-life series to Art Studio 2 before 2:00 PM.', 'event', '2026-09-03T14:00', 'Art Studio 2 (Block B)', '2026-08-29T10:00:00.000Z', '{"classes": ["12"], "sections": ["A/B"], "streams": [], "houses": ["Vikram"], "optionalSubject": "Painting", "isSchoolWide": false}'::jsonb);

-- Seed Demo Event Registration
INSERT INTO event_registrations (id, event_id, student_id, student_name, student_class, student_section, student_house, registered_at) VALUES
('REG-8001', 'MSG-5001', 'CC-STU-1001', 'Ananya Sharma', '12', 'A/B', 'Vikram', '2026-08-29T11:00:00.000Z');
