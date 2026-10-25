// database.cjs - MongoDB Atlas Database with Mongoose

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://sarveshmahajan1431_db_user:Sam1431@cluster0.eiptwq2.mongodb.net/splitbuddy?retryWrites=true&w=majority';

// --- Schemas ---
const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  age: Number,
  gender: String,
  lookingFor: String,
  profession: String,
  city: String,
  budget: Number,
  imageUrl: String,
  bio: String,
  preferences: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  ownerId: { type: Number, required: true },
  title: { type: String, required: true },
  city: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  type: { type: String, required: true },
  mediaUrls: { type: [String], default: [] },
  amenities: { type: [String], default: [] },
  description: String,
  phone: String,
  preferences: { type: [String], default: [] }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  fromId: { type: Number, required: true },
  toId: { type: Number, required: true },
  text: { type: String, required: true },
  timestamp: { type: Number, required: true },
  readBy: { type: [Number], default: [] }
});

const savedListingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  listingId: { type: Number, required: true }
});
savedListingSchema.index({ userId: 1, listingId: 1 }, { unique: true });

// --- Auto-increment counter ---
const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);
const Message = mongoose.model('Message', messageSchema);
const SavedListing = mongoose.model('SavedListing', savedListingSchema);
const Counter = mongoose.model('Counter', counterSchema);

async function getNextId(name) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return counter.seq;
}

// Initialize database connection and seed if empty
async function initDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB Atlas (splitbuddy database)');

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const { MOCK_USERS, MOCK_LISTINGS } = require('./seedData.cjs');
    console.log('Seeding MongoDB with 10 realistic flatmates and 10 realistic listings...');

    await User.insertMany(MOCK_USERS);
    await Listing.insertMany(MOCK_LISTINGS);

    // Initialize counters to the max seed IDs
    const maxUserId = Math.max(...MOCK_USERS.map(u => u.id));
    const maxListingId = Math.max(...MOCK_LISTINGS.map(l => l.id));
    await Counter.findByIdAndUpdate('userId', { seq: maxUserId }, { upsert: true });
    await Counter.findByIdAndUpdate('listingId', { seq: maxListingId }, { upsert: true });
    await Counter.findByIdAndUpdate('messageId', { seq: 0 }, { upsert: true });

    console.log('Successfully seeded MongoDB with dummy data!');
  } else {
    console.log(`Database already has ${userCount} users. Skipping seed.`);
  }
}

module.exports = { User, Listing, Message, SavedListing, Counter, getNextId, initDatabase };
