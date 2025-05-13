-- Seed data for development environment

-- 1. Insert users (password hashes are for: 'admin123', 'recruiter123', 'seeker123')
INSERT INTO users (name, email, password_hash, role) 
VALUES 
  ('Admin User', 'admin@alcatraz.com', '$2b$10$4FZzQDVzl.HBH8/4lc4AeuwqUspuNVZmlV5eNP6H.jP9HErvBK6NG', 'admin'),
  ('Recruiter User', 'recruiter@alcatraz.com', '$2b$10$hzLdy.Y3XKzSY2M4ob1oIurVbXFxPnKw0.xMq.R6AGGaVKQeykdGe', 'recruiter'),
  ('Job Seeker', 'seeker@example.com', '$2b$10$EPy9hzQMX0eI1QXQMUh3FeIsnTJkXmxDDrZ7yDKVLLaiKlS7GQgey', 'job_seeker')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert jobs
INSERT INTO jobs (title, category, description, requirements, salary, location, posted_by, status)
VALUES
  ('Prison Guard', 'Security', 'Responsible for maintaining security within the prison facility.', 'Law enforcement experience preferred. Must pass background check.', '$45,000 - $60,000', 'Alcatraz Island', 2, 'approved'),
  ('Kitchen Staff', 'Food Service', 'Prepare meals for prison inmates and staff.', 'Food handling certification required.', '$35,000 - $45,000', 'Alcatraz Island', 2, 'approved'),
  ('Maintenance Worker', 'Facilities', 'Handle repairs and maintenance around the prison facility.', 'Experience with plumbing, electrical, and general repairs.', '$40,000 - $50,000', 'Alcatraz Island', 2, 'pending'),
  ('Administrative Assistant', 'Office', 'Provide administrative support to prison management.', 'Office experience and proficiency in Microsoft Office required.', '$38,000 - $48,000', 'Alcatraz Island', 2, 'approved'),
  ('Medical Officer', 'Healthcare', 'Provide medical care to inmates.', 'Medical degree and license required. Experience in emergency care preferred.', '$70,000 - $90,000', 'Alcatraz Island', 2, 'approved')
ON CONFLICT DO NOTHING;

-- 3. Insert questionnaire responses for job seeker
INSERT INTO questionnaire_responses (user_id, answers)
VALUES
  (3, '{"security_experience": true, "works_well_with_others": true, "comfortable_high_stress": true, "previous_prison_work": false, "willing_to_relocate": true}')
ON CONFLICT DO NOTHING;

-- 4. Insert sample application
INSERT INTO applications (user_id, job_id, cv_url, cover_note, status)
VALUES
  (3, 1, 'cv_sample.pdf', 'I am very interested in this position and believe my experience makes me a good fit.', 'submitted')
ON CONFLICT DO NOTHING; 