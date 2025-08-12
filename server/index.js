import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_me';

// In-memory mock data
const users = {
  // id: { id, role: 'employee'|'company', approved: boolean, profile: {...} }
};
const jobs = [];
const applications = [];
const notifications = [];

// helper to seed some data for testing
function seed() {
  const employeeId = uuidv4();
  const companyId = uuidv4();
  users[employeeId] = {
    id: employeeId,
    role: 'employee',
    approved: true,
    profile: { name: 'Jane Doe', skills: ['js', 'react'], categories: ['engineering'] },
  };
  users[companyId] = {
    id: companyId,
    role: 'company',
    approved: true,
    profile: { companyName: 'Acme Inc', location: 'Remote' },
  };
  const jobId = uuidv4();
  jobs.push({ id: jobId, companyId, title: 'Frontend Engineer', category: 'engineering', description: 'Build UIs', createdAt: new Date().toISOString() });
}
seed();

// Issue test tokens route (dev only)
app.get('/api/dev/token/:role', (req, res) => {
  const { role } = req.params;
  if (!['employee', 'company'].includes(role)) return res.status(400).json({ message: 'invalid role' });
  // pick any existing user for role
  const user = Object.values(users).find(u => u.role === role);
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
});

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users[payload.sub];
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  }
}

function requireApprovedCompany(req, res, next) {
  if (req.user.role !== 'company') return res.status(403).json({ message: 'Forbidden' });
  if (!req.user.approved) return res.status(403).json({ message: 'Company not approved' });
  next();
}

// Employee Routes
app.get('/api/employee/profile', authenticate, requireRole('employee'), (req, res) => {
  res.json({ profile: req.user.profile, id: req.user.id });
});

app.get('/api/employee/jobs', authenticate, requireRole('employee'), (req, res) => {
  const { category } = req.query;
  const filtered = category ? jobs.filter(j => j.category === category) : jobs;
  res.json({ jobs: filtered });
});

app.get('/api/employee/suggestions', authenticate, requireRole('employee'), (req, res) => {
  const { category } = req.query;
  const prefs = new Set([
    ...(req.user.profile?.categories || []),
    ...(category ? [category] : []),
  ]);
  const suggested = jobs.filter(j => prefs.size === 0 || prefs.has(j.category));
  res.json({ jobs: suggested.slice(0, 10) });
});

app.post('/api/employee/apply/:jobId', authenticate, requireRole('employee'), (req, res) => {
  const { jobId } = req.params;
  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const already = applications.find(a => a.jobId === jobId && a.employeeId === req.user.id);
  if (already) return res.status(409).json({ message: 'Already applied' });
  const application = { id: uuidv4(), jobId, employeeId: req.user.id, status: 'submitted', createdAt: new Date().toISOString() };
  applications.push(application);
  notifications.push({ id: uuidv4(), userId: job.companyId, message: `New applicant for ${job.title}`, createdAt: new Date().toISOString() });
  res.status(201).json({ application });
});

app.get('/api/employee/applications', authenticate, requireRole('employee'), (req, res) => {
  const mine = applications.filter(a => a.employeeId === req.user.id);
  res.json({ applications: mine });
});

app.get('/api/employee/notifications', authenticate, requireRole('employee'), (req, res) => {
  const mine = notifications.filter(n => n.userId === req.user.id);
  res.json({ notifications: mine });
});

// Company Routes
app.get('/api/company/profile', authenticate, requireRole('company'), requireApprovedCompany, (req, res) => {
  res.json({ profile: req.user.profile, id: req.user.id, approved: req.user.approved });
});

app.patch('/api/company/profile', authenticate, requireRole('company'), requireApprovedCompany, (req, res) => {
  const { profile } = req.body;
  req.user.profile = { ...(req.user.profile || {}), ...(profile || {}) };
  res.json({ profile: req.user.profile });
});

app.post('/api/company/job', authenticate, requireRole('company'), requireApprovedCompany, (req, res) => {
  const { title, category, description } = req.body;
  if (!title || !category) return res.status(400).json({ message: 'title and category required' });
  const job = { id: uuidv4(), companyId: req.user.id, title, category, description: description || '', createdAt: new Date().toISOString() };
  jobs.push(job);
  res.status(201).json({ job });
});

app.get('/api/company/jobs', authenticate, requireRole('company'), requireApprovedCompany, (req, res) => {
  const mine = jobs.filter(j => j.companyId === req.user.id);
  res.json({ jobs: mine });
});

app.get('/api/company/applicants/:jobId', authenticate, requireRole('company'), requireApprovedCompany, (req, res) => {
  const { jobId } = req.params;
  const job = jobs.find(j => j.id === jobId && j.companyId === req.user.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const jobApplications = applications.filter(a => a.jobId === jobId);
  res.json({ applicants: jobApplications });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});