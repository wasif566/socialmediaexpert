const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userAuthDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Signup
app.post('/signup', async (req, res) => {
  const { username, email, whatsapp, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.send('User already exists. Please login.');

    const newUser = new User({ username, email, whatsapp, password });
    await newUser.save();

    res.send('Signup successful. <a href="/login.html">Go to login</a>');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.send('Invalid credentials.');

    res.redirect('/admin.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get all users for admin
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
