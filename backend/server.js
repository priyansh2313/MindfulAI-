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
const Test = require('./models/Test');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const careConnectRoutes = require('./routes/careConnect');
const familyInvitationRoutes = require('./routes/familyInvitations');
const calendarRoutes = require('./routes/calendar');
const exotelRoutes = require('./routes/exotelRoutes');

const googleAuth = require("./routes/googleAuth");

const app = express();
const server = http.createServer(app);
console.log("Loaded MONGO_URI:", process.env.MONGO_URI); // <-- Add this line

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://localhost:5000',
      'https://mindfulv4.vercel.app',
      'http://localhost:5000',
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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("userJoined", ({ username, room }) => {
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
    socket.emit("previousMessages", {
      messages: roomMessages.get(room),
      room,
    });

    // Update online users for all users in the room
    updateOnlineUsers(room);
  });

  // Handle sending messages
  socket.on("sendMessage", (data) => {
    const { username, message, room, profilePicUrl, timestamp, senderId } = data;

    const messageData = {
      id: Date.now().toString(),
      username,
      message,
      room,
      profilePicUrl,
      timestamp,
      senderId,
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
    io.to(room).emit("receiveMessage", messageData);
  });

  // Handle typing indicator
  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("userTyping", username);
  });

  // Handle room changes
  socket.on("joinRoom", (room) => {
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
      socket.emit("previousMessages", {
        messages: roomMessages.get(room),
        room,
      });

      // Update online users
      updateOnlineUsers(room);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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
    .filter((user) => user.room === room)
    .map((user) => user.username);

  io.to(room).emit("updateUsers", usersInRoom);
}

// CORS configuration for different environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost:5000',
  'https://mindfulv4.vercel.app',
  'http://localhost:5000',
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
    
    // For debugging, allow all origins temporarily
    console.log('Request origin:', origin);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Temporarily allow all origins for debugging
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Google OAuth routes
app.use('/auth', googleAuth);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Use Care Connect routes
app.use('/api/care-connect', careConnectRoutes);

// Use Family Invitation routes
app.use('/api/family', familyInvitationRoutes);

// Use Calendar routes
app.use('/api/calendar', calendarRoutes);
app.use('/api/exotel', exotelRoutes);


// Simple test route in main server
app.get('/api/test', (req, res) => {
  res.json({ message: 'Main server routes are working!', timestamp: new Date() });
});

// Root test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date() });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Debug: Log all registered routes
console.log('Registered routes:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    console.log(`Router: ${middleware.regexp}`);
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Database name:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
  });

// Register
app.post("/users/register", async (req, res) => {
  try {
    const { name, phone, email, password, dob, age } = req.body;
    console.log(req.body);
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, email, password: hashed, dob, age, oauth: false });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { ...user.toObject(), password: undefined }, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Example protected route
app.get("/users/check", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get user profile by ID
app.get("/users/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
app.put("/users/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove password from update data if present
    delete updateData.password;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ data: user, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.post("/caseHistory", async (req, res) => {
  try {
    const { data } = req.body; // data is an object with q1, q2, ... or an array
    // Convert to array if needed:
    const responses = Array.isArray(data) ? data : Object.values(data);

    // Extract user ID from JWT token if available
    let userId = null;
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log('No valid token, creating anonymous case history');
      }
    }

    const caseHistory = await CaseHistory.create({
      responses,
      user: userId
    });

    res.json({ message: "Case history saved!", caseHistory });
  } catch (err) {
    res.status(500).json({ error: "Failed to save case history." });
  }
});

// Get case history
app.get('/caseHistory', async (req, res) => {
  try {
    // Extract user ID from JWT token if available
    let userId = null;
    const auth = req.headers.authorization;
    if (auth) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log('No valid token, fetching latest case history');
      }
    }

    let caseHistory;
    if (userId) {
      // Get case history for authenticated user
      caseHistory = await CaseHistory.findOne({ user: userId }).sort({ createdAt: -1 });
    } else {
      // Get latest case history (for anonymous users)
      caseHistory = await CaseHistory.findOne().sort({ createdAt: -1 });
    }
    
    res.json(caseHistory || {});
  } catch (err) {
    console.error('Case history fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch case history.' });
  }
});

// Get case history for specific user
app.get('/users/caseHistory/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const caseHistory = await CaseHistory.findOne({ user: userId }).sort({ createdAt: -1 });
    res.json(caseHistory || {});
  } catch (err) {
    console.error('Case history fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch case history.' });
  }
});

// Update case history for specific user
app.put('/users/updateCaseHistory/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Find existing case history or create new one
    let caseHistory = await CaseHistory.findOne({ user: userId });
    
    if (caseHistory) {
      // Update existing case history
      caseHistory.responses = updateData;
      await caseHistory.save();
    } else {
      // Create new case history
      caseHistory = await CaseHistory.create({
        user: userId,
        responses: updateData
      });
    }
    
    res.json({ message: 'Case history updated!', caseHistory });
  } catch (err) {
    console.error('Case history update error:', err);
    res.status(500).json({ error: 'Failed to update case history.' });
  }
});

// Create a new journal entry
app.post('/journals', async (req, res) => {
  try {
    console.log('Creating journal entry with data:', req.body);
    const { title, content, mood, sentiment } = req.body;
    // Optionally, associate with user: const userId = req.user.id;
    const journal = await Journal.create({ 
      title, 
      content, 
      mood, 
      sentiment: sentiment || 'neutral'
    });
    console.log('Journal created successfully:', journal._id);
    res.json({ message: 'Journal entry saved!', journal });
  } catch (err) {
    console.error('Journal save error:', err);
    res.status(500).json({ error: 'Failed to save journal entry.' });
  }
});

// Test route to check Journal model
app.get('/test-journal', async (req, res) => {
  try {
    console.log('Testing Journal model...');
    const count = await Journal.countDocuments();
    console.log('Journal count:', count);
    res.json({ message: 'Journal model working', count });
  } catch (err) {
    console.error('Journal test error:', err);
    res.status(500).json({ error: 'Journal model test failed', details: err.message });
  }
});

// Get all journal entries (optionally, filter by user)
app.get('/journals', async (req, res) => {
  try {
    console.log('Fetching journals...');
    const journals = await Journal.find().sort({ createdAt: -1 });
    console.log('Found journals:', journals.length);
    res.json(journals);
  } catch (err) {
    console.error('Journal fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch journals.' });
  }
});

// POST endpoint to save test results
app.post('/test', async (req, res) => {
  try {
    console.log('Saving test results:', req.body);
    const { score, anxiety, depression, insomnia, stress, selfEsteem } = req.body;
    
    // Extract user ID from JWT token
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    
    const token = auth.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    
    const testData = {
      user: userId,
      score,
      categories: {
        anxiety: anxiety || 0,
        depression: depression || 0,
        insomnia: insomnia || 0,
        stress: stress || 0,
        selfEsteem: selfEsteem || 0
      }
    };
    
    const test = await Test.create(testData);
    
    console.log('Test saved successfully for user:', userId, test._id);
    res.json({ message: 'Test results saved!', test });
  } catch (err) {
    console.error('Test save error:', err);
    res.status(500).json({ error: 'Failed to save test results.' });
  }
});

// GET endpoint to fetch test results
app.get('/test', async (req, res) => {
  try {
    console.log('Fetching test results...');
    
    // Extract user ID from JWT token
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    
    const token = auth.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    
    // Only fetch test results for the authenticated user
    const testResults = await Test.find({ user: userId }).sort({ timestamp: -1 });
    console.log('Found test results for user:', userId, testResults.length);
    res.json({ testResults });
  } catch (err) {
    console.error('Test fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch test results.' });
  }
});

app.use('auth', googleAuth);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
