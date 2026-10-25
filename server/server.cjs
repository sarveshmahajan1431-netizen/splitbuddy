// server.cjs - Express API Backend with MongoDB Atlas

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const {
  User,
  Listing,
  Message,
  SavedListing,
  getNextId,
  initDatabase
} = require('./database.cjs');
const { MOCK_USERS, MOCK_LISTINGS } = require('./seedData.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Format DB User object for client consumption
function formatUser(doc) {
  if (!doc) return null;
  const user = doc.toObject ? doc.toObject() : doc;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    phone: user.phone,
    age: user.age,
    gender: user.gender,
    lookingFor: user.lookingFor,
    profession: user.profession,
    city: user.city,
    budget: user.budget,
    imageUrl: user.imageUrl,
    bio: user.bio,
    preferences: user.preferences || {}
  };
}

// Format DB Listing object for client consumption
function formatListing(doc) {
  if (!doc) return null;
  const listing = doc.toObject ? doc.toObject() : doc;
  return {
    id: listing.id,
    ownerId: listing.ownerId,
    title: listing.title,
    city: listing.city,
    location: listing.location,
    rent: listing.rent,
    type: listing.type,
    mediaUrls: listing.mediaUrls || [],
    amenities: listing.amenities || [],
    description: listing.description || '',
    phone: listing.phone,
    preferences: listing.preferences || []
  };
}

// Root Route - Redirect to Vite Frontend or return info
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Splitbuddy API Server</title></head>
      <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
        <h2>Splitbuddy MongoDB Atlas Express API Server</h2>
        <p>API Server is running on port 3001.</p>
        <p><a href="http://localhost:5173" style="font-size: 1.2rem; color: #2563eb;">👉 Open Splitbuddy Web Application (http://localhost:5173)</a></p>
      </body>
    </html>
  `);
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'MongoDB Atlas', timestamp: new Date() });
});

// Reset / Seed Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await SavedListing.deleteMany({});
    await Message.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});

    await User.insertMany(MOCK_USERS);
    await Listing.insertMany(MOCK_LISTINGS);

    const { Counter } = require('./database.cjs');
    const maxUserId = Math.max(...MOCK_USERS.map(u => u.id));
    const maxListingId = Math.max(...MOCK_LISTINGS.map(l => l.id));
    await Counter.findByIdAndUpdate('userId', { seq: maxUserId }, { upsert: true });
    await Counter.findByIdAndUpdate('listingId', { seq: maxListingId }, { upsert: true });
    await Counter.findByIdAndUpdate('messageId', { seq: 0 }, { upsert: true });

    res.json({ message: 'Database reset and re-seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- AUTH API ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const existing = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const defaultPrefs = {
      smoking: 'No',
      drinking: 'Socially',
      food: 'Vegetarian',
      socialHabits: 'Mix of both',
      cleanliness: 'Moderately clean'
    };

    const newId = await getNextId('userId');
    const newUser = await User.create({
      id: newId,
      name,
      email,
      password,
      age: 25,
      gender: 'Prefer not to say',
      lookingFor: 'Any',
      profession: 'New User',
      city: 'Any',
      budget: 20000,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
      bio: 'Just joined Splitbuddy! Looking for a great place to live.',
      preferences: defaultPrefs
    });

    res.status(201).json(formatUser(newUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- USERS API ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ id: 1 });
    res.json(users.map(formatUser));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: Number(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { name, age, gender, lookingFor, profession, city, budget, imageUrl, bio, preferences, phone } = req.body;
  try {
    const updated = await User.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        $set: {
          name,
          age,
          gender,
          lookingFor,
          profession,
          city,
          budget,
          imageUrl,
          bio,
          preferences,
          phone: phone || null
        }
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- SAVED LISTINGS API ---
app.get('/api/users/:userId/saved-listings', async (req, res) => {
  try {
    const saved = await SavedListing.find({ userId: Number(req.params.userId) });
    res.json(saved.map(s => s.listingId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:userId/saved-listings', async (req, res) => {
  const { savedIds } = req.body;
  const userId = Number(req.params.userId);
  try {
    await SavedListing.deleteMany({ userId });
    if (Array.isArray(savedIds) && savedIds.length > 0) {
      const records = savedIds.map(listingId => ({ userId, listingId }));
      await SavedListing.insertMany(records, { ordered: false }).catch(() => {});
    }
    res.json({ success: true, savedListings: savedIds || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- LISTINGS API ---
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find({}).sort({ id: 1 });
    res.json(listings.map(formatListing));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listings', async (req, res) => {
  const { ownerId, title, city, location, rent, type, mediaUrls, amenities, description, phone, preferences } = req.body;
  try {
    const newId = await getNextId('listingId');
    const newListing = await Listing.create({
      id: newId,
      ownerId,
      title,
      city,
      location,
      rent,
      type,
      mediaUrls: mediaUrls || [],
      amenities: amenities || [],
      description: description || '',
      phone: phone || '',
      preferences: preferences || []
    });

    res.status(201).json(formatListing(newListing));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/listings/:id', async (req, res) => {
  const { title, city, location, rent, type, mediaUrls, amenities, description, phone, preferences } = req.body;
  try {
    const updated = await Listing.findOneAndUpdate(
      { id: Number(req.params.id) },
      {
        $set: {
          title,
          city,
          location,
          rent,
          type,
          mediaUrls: mediaUrls || [],
          amenities: amenities || [],
          description: description || '',
          phone: phone || '',
          preferences: preferences || []
        }
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json(formatListing(updated));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/listings/:id', async (req, res) => {
  try {
    await Listing.deleteOne({ id: Number(req.params.id) });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- MESSAGES API ---
app.get('/api/messages', async (req, res) => {
  const { user1Id, user2Id, userId } = req.query;
  try {
    let query = {};
    if (user1Id && user2Id) {
      const u1 = Number(user1Id);
      const u2 = Number(user2Id);
      query = {
        $or: [
          { fromId: u1, toId: u2 },
          { fromId: u2, toId: u1 }
        ]
      };
    } else if (userId) {
      const u = Number(userId);
      query = {
        $or: [{ fromId: u }, { toId: u }]
      };
    }

    const messages = await Message.find(query).sort({ timestamp: 1 });
    res.json(messages.map(m => ({
      id: m.id,
      fromId: m.fromId,
      toId: m.toId,
      text: m.text,
      timestamp: m.timestamp,
      readBy: m.readBy || []
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  const { fromId, toId, text } = req.body;
  if (!fromId || !toId || !text) {
    return res.status(400).json({ error: 'fromId, toId, and text are required' });
  }

  const timestamp = Date.now();
  try {
    const newId = await getNextId('messageId');
    const msg = await Message.create({
      id: newId,
      fromId: Number(fromId),
      toId: Number(toId),
      text,
      timestamp,
      readBy: [Number(fromId)]
    });

    res.status(201).json({
      id: msg.id,
      fromId: msg.fromId,
      toId: msg.toId,
      text: msg.text,
      timestamp: msg.timestamp,
      readBy: msg.readBy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages/read', async (req, res) => {
  const { userId, partnerId } = req.body;
  try {
    const result = await Message.updateMany(
      {
        fromId: Number(partnerId),
        toId: Number(userId),
        readBy: { $ne: Number(userId) }
      },
      {
        $addToSet: { readBy: Number(userId) }
      }
    );
    res.json({ success: true, updatedCount: result.modifiedCount || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server - Connect to MongoDB first, then listen
async function startServer() {
  try {
    await initDatabase();
    console.log('MongoDB initialization & seeding completed.');
  } catch (err) {
    console.error('Database connection error:', err);
  }

  const server = app.listen(PORT, () => {
    console.log(`Splitbuddy MongoDB Atlas Express API server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}

startServer();
