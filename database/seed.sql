-- Learnova AI — Curriculum Seed Data (Mathematics, Physics, Chemistry for Grades 6–12)

-- 1. Insert Core Subjects
INSERT INTO subjects (id, name, color_code, icon_name, description) VALUES
('math', 'Mathematics', '#2563eb', 'Calculator', 'Master algebra, geometry, trigonometry, and calculus through step-by-step problem solving.'),
('physics', 'Physics', '#7c3aed', 'Atom', 'Explore mechanics, energy, electromagnetism, and modern physics through visual concepts.'),
('chemistry', 'Chemistry', '#059669', 'FlaskConical', 'Understand atomic structure, chemical reactions, periodic table, and organic compounds.')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Grade 8-10 STEM Topics
INSERT INTO topics (id, subject_id, grade, title, slug, order_index, description, prerequisites, key_formulas) VALUES
-- Mathematics
('math-alg-lin', 'math', 9, 'Linear Equations in Two Variables', 'linear-equations', 1, 'Solving simultaneous equations, graph representations, and algebraic word problems.', '{"Algebraic Expressions"}', '[{"name": "Standard Form", "latex": "ax + by + c = 0"}]'),
('math-alg-quad', 'math', 10, 'Quadratic Equations', 'quadratic-equations', 2, 'Roots of quadratic equations, discriminant nature, factoring, and quadratic formula.', '{"Linear Equations", "Polynomials"}', '[{"name": "Quadratic Formula", "latex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"}, {"name": "Discriminant", "latex": "D = b^2 - 4ac"}]'),
('math-geom-tri', 'math', 9, 'Triangles & Similarity', 'triangles-similarity', 3, 'Pythagorean theorem, congruence, similarity criteria, and geometric proofs.', '{"Lines and Angles"}', '[{"name": "Pythagoras", "latex": "a^2 + b^2 = c^2"}]'),
('math-trig-intro', 'math', 10, 'Introduction to Trigonometry', 'intro-trigonometry', 4, 'Trigonometric ratios (sin, cos, tan), standard values, and identity relationships.', '{"Triangles & Similarity"}', '[{"name": "Identity 1", "latex": "\\sin^2\\theta + \\cos^2\\theta = 1"}]'),
('math-arith-prog', 'math', 10, 'Arithmetic Progressions', 'arithmetic-progressions', 5, 'Sequences, nth term formula, sum of first n terms, and real-life patterns.', '{"Linear Patterns"}', '[{"name": "nth term", "latex": "a_n = a + (n-1)d"}, {"name": "Sum", "latex": "S_n = \\frac{n}{2}[2a + (n-1)d]"}]'),

-- Physics
('phys-motion-1d', 'physics', 9, 'Motion & Kinematics', 'motion-kinematics', 1, 'Velocity, acceleration, distance-time graphs, and equations of uniformly accelerated motion.', '{"Basic Units"}', '[{"name": "First Equation", "latex": "v = u + at"}, {"name": "Second Equation", "latex": "s = ut + \\frac{1}{2}at^2"}, {"name": "Third Equation", "latex": "v^2 = u^2 + 2as"}]'),
('phys-force-laws', 'physics', 9, 'Force & Newton''s Laws', 'force-newtons-laws', 2, 'Inertia, momentum, action-reaction pairs, and friction fundamentals.', '{"Motion & Kinematics"}', '[{"name": "Newton''s 2nd Law", "latex": "F = ma"}, {"name": "Momentum", "latex": "p = mv"}]'),
('phys-elec-circuits', 'physics', 10, 'Electricity & Ohm''s Law', 'electricity-ohms-law', 3, 'Electric current, potential difference, Ohm''s law, series & parallel resistors, electrical power.', '{"Basic Atomic Structure"}', '[{"name": "Ohm''s Law", "latex": "V = IR"}, {"name": "Electrical Power", "latex": "P = VI = I^2R = \\frac{V^2}{R}"}]'),
('phys-light-optics', 'physics', 10, 'Light: Reflection & Refraction', 'light-optics', 4, 'Spherical mirrors, mirror formula, refractive index, Snell''s law, and thin lens formula.', '{"Geometric Angles"}', '[{"name": "Mirror Formula", "latex": "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}"}, {"name": "Snell''s Law", "latex": "n = \\frac{\\sin i}{\\sin r}"}]'),
('phys-work-energy', 'physics', 9, 'Work, Energy & Power', 'work-energy-power', 5, 'Kinetic energy, gravitational potential energy, law of conservation of energy, and mechanical power.', '{"Force & Newton''s Laws"}', '[{"name": "Work", "latex": "W = F \\cdot s \\cos\\theta"}, {"name": "Kinetic Energy", "latex": "E_k = \\frac{1}{2}mv^2"}]'),

-- Chemistry
('chem-reac-eq', 'chemistry', 10, 'Chemical Reactions & Equations', 'chemical-reactions', 1, 'Balancing chemical equations, combination, decomposition, displacement, and redox reactions.', '{"Elements & Compounds"}', '[{"name": "General Reaction", "latex": "aA + bB \\rightarrow cC + dD"}]'),
('chem-acids-bases', 'chemistry', 10, 'Acids, Bases & Salts', 'acids-bases-salts', 2, 'pH scale, indicator properties, neutralization reactions, and common salts in daily life.', '{"Chemical Reactions"}', '[{"name": "pH definition", "latex": "\\text{pH} = -\\log[H^+]"}]'),
('chem-atom-struc', 'chemistry', 9, 'Structure of the Atom', 'structure-of-atom', 3, 'Subatomic particles (electrons, protons, neutrons), Bohr model, valency, isotopes.', '{"Matter in Surroundings"}', '[{"name": "Mass Number", "latex": "A = Z + N"}]'),
('chem-periodic-table', 'chemistry', 10, 'Periodic Classification of Elements', 'periodic-classification', 4, 'Modern periodic law, periods, groups, atomic radius trends, metallic character.', '{"Structure of the Atom"}', '[{"name": "Periodic Law", "latex": "\\text{Properties} = f(\\text{Atomic Number})"}]'),
('chem-carbon-comp', 'chemistry', 10, 'Carbon and its Compounds', 'carbon-compounds', 5, 'Covalent bonding, allotropes of carbon, homologous series, functional groups.', '{"Valency & Chemical Bonding"}', '[{"name": "Alkane General Formula", "latex": "C_n H_{2n+2}"}]')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Gamification Achievements
INSERT INTO achievements (id, title, description, badge_icon, xp_reward, category) VALUES
('ach-first-step', 'First Curious Step', 'Completed your very first AI tutoring session.', 'Sparkles', 50, 'learning'),
('ach-math-solver', 'Algebra Apprentice', 'Solved 5 mathematics problems step-by-step.', 'Brain', 100, 'math'),
('ach-streak-3', '3-Day Momentum', 'Maintained a 3-day active learning streak.', 'Flame', 150, 'streak'),
('ach-formula-master', 'Formula Specialist', 'Explored and reviewed 10 scientific formulas in the hub.', 'BookOpen', 75, 'learning'),
('ach-quiz-champion', 'Concept Conqueror', 'Scored 100% on a topic quiz.', 'Trophy', 200, 'quiz'),
('ach-vision-lab', 'Vision Explorer', 'Uploaded and solved a handwritten equation or diagram.', 'Camera', 120, 'vision')
ON CONFLICT (id) DO NOTHING;
