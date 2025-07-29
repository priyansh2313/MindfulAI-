require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const http = require('http');
const { Server } = require('socket.io');
const CaseHistory = require('./models/CaseHistory');
const Journal = require('./models/Journal');

const app = express();
const server = http.createServer(app);
console.log('Loaded MONGO_URI:', process.env.MONGO_URI); // <-- Add this line

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5000',
      'https://mindfulv4.vercel.app',
      'https://mindfulai-wv9z.onrender.com',
      'https://mindfulai-pi.vercel.app',
      'https://mindfulai-pi.vercel.app/',
      'http://localhost:5174',
      'http://localhost:4173'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store connected users and their rooms
const connectedUsers = new Map();
const roomMessages = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining
  socket.on('userJoined', ({ username, room }) => {
    console.log(`${username} joined room: ${room}`);
    
    // Store user info
    connectedUsers.set(socket.id, { username, room });
    
    // Join the room
    socket.join(room);
    
    // Initialize room messages if not exists
    if (!roomMessages.has(room)) {
      roomMessages.set(room, []);
    }
    
    // Send previous messages to the user
    socket.emit('previousMessages', {
      messages: roomMessages.get(room),
      room
    });
    
    // Update online users for all users in the room
    updateOnlineUsers(room);
  });

  // Handle sending messages
  socket.on('sendMessage', (data) => {
    const { username, message, room, profilePicUrl, timestamp, senderId } = data;
    
    const messageData = {
      id: Date.now().toString(),
      username,
      message,
      room,
      profilePicUrl,
      timestamp,
      senderId
    };
    
    // Store message in room
    if (!roomMessages.has(room)) {
      roomMessages.set(room, []);
    }
    roomMessages.get(room).push(messageData);
    
    // Keep only last 100 messages per room
    if (roomMessages.get(room).length > 100) {
      roomMessages.set(room, roomMessages.get(room).slice(-100));
    }
    
    // Broadcast message to all users in the room
    io.to(room).emit('receiveMessage', messageData);
  });

  // Handle typing indicator
  socket.on('typing', ({ username, room }) => {
    socket.to(room).emit('userTyping', username);
  });

  // Handle room changes
  socket.on('joinRoom', (room) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Leave previous room
      socket.leave(user.room);
      
      // Update user's room
      user.room = room;
      connectedUsers.set(socket.id, user);
      
      // Join new room
      socket.join(room);
      
      // Send previous messages for new room
      if (!roomMessages.has(room)) {
        roomMessages.set(room, []);
      }
      socket.emit('previousMessages', {
        messages: roomMessages.get(room),
        room
      });
      
      // Update online users
      updateOnlineUsers(room);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      updateOnlineUsers(user.room);
    }
  });
});

// Helper function to update online users for a room
function updateOnlineUsers(room) {
  const usersInRoom = Array.from(connectedUsers.values())
    .filter(user => user.room === room)
    .map(user => user.username);
  
  io.to(room).emit('updateUsers', usersInRoom);
}

app.use(express.json());

// CORS configuration for different environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost:5000',
  'https://mindfulv4.vercel.app',
  'https://mindfulai-wv9z.onrender.com',
  // Your actual frontend URL
  'https://mindfulai-pi.vercel.app',
  'https://mindfulai-pi.vercel.app/',
  // Add your local development URLs
  'http://localhost:5174',
  'http://localhost:4173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // For development, allow all origins temporarily
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register
app.post('/users/register', async (req, res) => {
  try {
    const { name, phone, email, password, dob, age } = req.body;
    console.log(req.body);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, email, password: hashed, dob, age });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    console.error("Registration error:", err);
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

app.post('/caseHistory', async (req, res) => {
  try {
    const { data } = req.body; // data is an object with q1, q2, ... or an array
    // Convert to array if needed:
    const responses = Array.isArray(data) ? data : Object.values(data);

    const caseHistory = await CaseHistory.create({
      responses,
      // user: userId, // If you want to associate with a user, add user extraction from JWT
    });

    res.json({ message: 'Case history saved!', caseHistory });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save case history.' });
  }
});

// Create a new journal entry
app.post('/journals', async (req, res) => {
  try {
    const { content } = req.body;
    // Optionally, associate with user: const userId = req.user.id;
    const journal = await Journal.create({ content });
    res.json({ message: 'Journal entry saved!', journal });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save journal entry.' });
  }
});

// Get all journal entries (optionally, filter by user)
app.get('/journals', async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journals.' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));