require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // <-- Add this line

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Example: handle a custom event
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // You can broadcast or emit events here
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','https://localhost:5000'], // Change to your frontend URL
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register
app.post('/users/register', async (req, res) => {
  try {
    const { name, phone, email, password, dob } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, email, password: hashed, dob });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Example protected route
app.get('/users/check', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));