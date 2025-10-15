const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date(),
    status: 'success'
  });
});

// Mock data for testing without MongoDB
const mockUsers = [
  { id: 1, username: 'testclient', email: 'client@test.com', role: 'client' },
  { id: 2, username: 'testfreelancer', email: 'freelancer@test.com', role: 'freelancer' }
];

const mockProjects = [
  {
    id: 1,
    title: 'Website Development',
    description: 'Need a modern website for my business',
    budget: 5000,
    category: 'web-development',
    status: 'open',
    client: { username: 'testclient' }
  },
  {
    id: 2,
    title: 'Mobile App Design',
    description: 'Create UI/UX design for mobile app',
    budget: 3000,
    category: 'design',
    status: 'open',
    client: { username: 'testclient' }
  }
];

// Mock API routes
app.get('/api/projects', (req, res) => {
  res.json({ projects: mockProjects, total: mockProjects.length });
});

app.get('/api/projects/:id', (req, res) => {
  const project = mockProjects.find(p => p.id == req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.post('/api/projects', (req, res) => {
  const newProject = {
    id: mockProjects.length + 1,
    ...req.body,
    status: 'open',
    client: { username: 'testclient' }
  };
  mockProjects.push(newProject);
  res.status(201).json({ project: newProject });
});

// Mock auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user && password === 'password') {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, role } = req.body;
  const newUser = {
    id: mockUsers.length + 1,
    username,
    email,
    role
  };
  mockUsers.push(newUser);
  
  res.status(201).json({
    message: 'User created successfully',
    token: 'mock-jwt-token',
    user: newUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'client',
    profile: {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📝 This is a mock server - no MongoDB required!`);
  console.log(`🔑 Test login: email: client@test.com, password: password`);
  console.log('📝 Press Ctrl+C to stop the server');
});



