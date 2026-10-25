// seedData.cjs - Realistic Seed Data for Splitbuddy (MongoDB format)

const MOCK_USERS = [
  {
    id: 1,
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    password: "password123",
    phone: "+91 98765 43210",
    age: 24,
    gender: "Female",
    lookingFor: "Female",
    profession: "UI/UX Designer",
    city: "Bangalore",
    budget: 22000,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    bio: "Hi! I'm a Product Designer working at a tech startup in HSR Layout. I love quiet coffee mornings, indoor plants, and clean minimalist spaces. Looking for a chill, like-minded female flatmate.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Vegetarian",
      socialHabits: "Quiet nights in",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 2,
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    password: "password123",
    phone: "+91 98123 45678",
    age: 26,
    gender: "Male",
    lookingFor: "Male",
    profession: "Software Engineer",
    city: "Bangalore",
    budget: 25000,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    bio: "Backend developer in Indiranagar. I enjoy board games, weekend runs, cooking pasta, and watching Formula 1. Respectful of personal space and keep common areas spotless.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Non-Vegetarian",
      socialHabits: "Mix of both",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 3,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    password: "password123",
    phone: "+91 97654 32109",
    age: 25,
    gender: "Female",
    lookingFor: "Any",
    profession: "Financial Analyst",
    city: "Mumbai",
    budget: 35000,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    bio: "Finance professional working in BKC. Early riser, avid reader, and tea enthusiast. Looking for a cozy room in Bandra or Santacruz. Easygoing and friendly!",
    preferences: {
      smoking: "No",
      drinking: "No",
      food: "Vegetarian",
      socialHabits: "Quiet nights in",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 4,
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    password: "password123",
    phone: "+91 99887 76655",
    age: 28,
    gender: "Male",
    lookingFor: "Any",
    profession: "Product Manager",
    city: "Gurgaon",
    budget: 30000,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    bio: "Fintech PM working near Cyber City. Big sports fan (Cricket & Football), love exploring rooftop cafes, and balanced lifestyle. Looking for a private room in a gated society.",
    preferences: {
      smoking: "Occasionally",
      drinking: "Socially",
      food: "Non-Vegetarian",
      socialHabits: "Mix of both",
      cleanliness: "Moderately clean"
    }
  },
  {
    id: 5,
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    password: "password123",
    phone: "+91 98450 11223",
    age: 23,
    gender: "Female",
    lookingFor: "Female",
    profession: "Content Strategist",
    city: "Pune",
    budget: 18000,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    bio: "Working remotely for a digital media agency. Love indie music, baking on weekends, and pet-friendly houses! Super neat and organized.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Eggetarian",
      socialHabits: "Party animal",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 6,
    name: "Aarav Joshi",
    email: "aarav.j@example.com",
    password: "password123",
    phone: "+91 97112 33445",
    age: 27,
    gender: "Male",
    lookingFor: "Male",
    profession: "Data Scientist",
    city: "Hyderabad",
    budget: 20000,
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    bio: "AI Researcher at HITEC City. Quiet during weekdays, gym lover, and occasional weekend trekker. Looking for a modern flatshare near Gachibowli or Madhapur.",
    preferences: {
      smoking: "No",
      drinking: "No",
      food: "Vegetarian",
      socialHabits: "Quiet nights in",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 7,
    name: "Kavya Reddy",
    email: "kavya.reddy@example.com",
    password: "password123",
    phone: "+91 96543 21876",
    age: 26,
    gender: "Female",
    lookingFor: "Female",
    profession: "Architect",
    city: "Bangalore",
    budget: 28000,
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    bio: "Architect who loves aesthetic interiors, filter coffee, and acoustic music. Looking for a bright flat in Koramangala or Domlur with good natural sunlight.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Non-Vegetarian",
      socialHabits: "Mix of both",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 8,
    name: "Siddharth Kapoor",
    email: "sid.kapoor@example.com",
    password: "password123",
    phone: "+91 98990 12345",
    age: 29,
    gender: "Male",
    lookingFor: "Any",
    profession: "Marketing Lead",
    city: "Mumbai",
    budget: 40000,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    bio: "Growth marketer working in Lower Parel. Friendly, foodie who knows the best spots in Mumbai, and dog lover. Looking for a spacious flat in Andheri West or Bandra.",
    preferences: {
      smoking: "Occasionally",
      drinking: "Yes",
      food: "Non-Vegetarian",
      socialHabits: "Party animal",
      cleanliness: "Moderately clean"
    }
  },
  {
    id: 9,
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    password: "password123",
    phone: "+91 99101 22334",
    age: 24,
    gender: "Female",
    lookingFor: "Female",
    profession: "HR Consultant",
    city: "Delhi NCR",
    budget: 22000,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    bio: "HR professional based in South Delhi. Love yoga, pottery, and movie marathons. Looking for clean, friendly female flatmates around Hauz Khas / Saket.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Vegetarian",
      socialHabits: "Mix of both",
      cleanliness: "Very tidy"
    }
  },
  {
    id: 10,
    name: "Ishan Nair",
    email: "ishan.nair@example.com",
    password: "password123",
    phone: "+91 97445 66778",
    age: 27,
    gender: "Male",
    lookingFor: "Male",
    profession: "DevOps Engineer",
    city: "Pune",
    budget: 19000,
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600",
    bio: "Working in IT park Hinjewadi. Tech geek, gamer, and enthusiast cook. Looking for a room in Baner or Wakad with high-speed internet and power backup.",
    preferences: {
      smoking: "No",
      drinking: "Socially",
      food: "Non-Vegetarian",
      socialHabits: "Mix of both",
      cleanliness: "Moderately clean"
    }
  }
];

const MOCK_LISTINGS = [
  {
    id: 1,
    ownerId: 1,
    title: "Luxury Master Room with Attached Balcony in 3BHK",
    city: "Bangalore",
    location: "HSR Layout Sector 1",
    rent: 22000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Washing Machine", "Power Backup", "Cook Available", "Balcony", "Security"],
    description: "Fully furnished spacious master bedroom available in a premium 3BHK flat in HSR Sector 1. Room includes king bed, 3-door wardrobe, work desk, and private bathroom with geyser. Flat has a fully equipped kitchen, high-speed fiber internet, and daily house cleaning maid.",
    phone: "+91 98765 43210",
    preferences: ["Female Preferred", "Non-smoker", "Working Professional"]
  },
  {
    id: 2,
    ownerId: 2,
    title: "Chic Private Room near Metro Station | Indiranagar",
    city: "Bangalore",
    location: "100ft Road, Indiranagar",
    rent: 25000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Gym", "Parking", "Washing Machine", "TV"],
    description: "Looking for 1 flatmate for a sunny private room in a modern 2BHK flat. Located just 5 mins walk from Indiranagar Metro. Flat features high ceiling, wooden flooring, Netflix setup, and a huge living area. Walkable distance to top cafes and pubs.",
    phone: "+91 98123 45678",
    preferences: ["Male Preferred", "Working Professional"]
  },
  {
    id: 3,
    ownerId: 3,
    title: "Sea View Private Room in Bandra West",
    city: "Mumbai",
    location: "Pali Hill, Bandra West",
    rent: 36000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Lift", "Security", "Maid Service", "Furnished Kitchen"],
    description: "Gorgeous room in a 3BHK flat on Pali Hill with sea view breeze. Quiet, green neighborhood with 24/7 security. Has split AC, wardrobe, queen bed. Looking for a responsible, clean flatmate.",
    phone: "+91 97654 32109",
    preferences: ["Female Preferred", "Tidy", "Respectful"]
  },
  {
    id: 4,
    ownerId: 4,
    title: "Sunlit Room in Premium Gated Society | DLF Phase 5",
    city: "Gurgaon",
    location: "Golf Course Road, DLF Phase 5",
    rent: 29000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Swimming Pool", "Gym", "Power Backup", "Clubhouse", "Parking"],
    description: "Private room available in a high-rise 4BHK apartment on Golf Course Road. Society amenities include swimming pool, gym, tennis court, and lush parks. Quick commute to Cyber Hub and Horizon Center.",
    phone: "+91 99887 76655",
    preferences: ["Working Professional", "Any Gender"]
  },
  {
    id: 5,
    ownerId: 5,
    title: "Cosy Furnished Room in Baner | Near High Street",
    city: "Pune",
    location: "Baner Road, Pune",
    rent: 17500,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "Washing Machine", "Balcony", "Fridge", "Water Purifier"],
    description: "Bright room with wooden wardrobe and attached washroom in a clean 2BHK flat. Close to Baner High Street cafes and IT parks. Friendly flatmates and relaxed vibe.",
    phone: "+91 98450 11223",
    preferences: ["Female Preferred", "Chill & Friendly"]
  },
  {
    id: 6,
    ownerId: 6,
    title: "Modern Shared Twin Room | Gachibowli",
    city: "Hyderabad",
    location: "Near Financial District, Gachibowli",
    rent: 11000,
    type: "Shared Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Power Backup", "Security", "Housekeeping"],
    description: "One bed available in a spacious shared room for male tech professional in Gachibowli. Walking distance to Amazon, Microsoft, and Wipro campuses. High-speed 300 Mbps internet & weekly cleaning included.",
    phone: "+91 97112 33445",
    preferences: ["Male Preferred", "IT Professional"]
  },
  {
    id: 7,
    ownerId: 7,
    title: "Aesthetic Studio Room in 3BHK | Koramangala 4th Block",
    city: "Bangalore",
    location: "Koramangala 4th Block",
    rent: 27000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Furnished Kitchen", "Balcony", "Washing Machine"],
    description: "Architect-designed 3BHK flat in prime Koramangala 4th block. Room comes with full-length mirror, workstation, plush bed, and serene balcony view. Ideal for someone who appreciates beautiful homes.",
    phone: "+91 96543 21876",
    preferences: ["Female Preferred", "Clean & Tidy"]
  },
  {
    id: 8,
    ownerId: 8,
    title: "Spacious Private Room in Luxury High-Rise | Powai",
    city: "Mumbai",
    location: "Hiranandani Gardens, Powai",
    rent: 38000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Gym", "Swimming Pool", "Clubhouse", "Parking", "Security"],
    description: "Extremely spacious room in Hiranandani Powai. World-class amenities, running track, shopping arcades nearby. Fully furnished with modular kitchen, microwave, washing machine, and 55-inch TV in living room.",
    phone: "+91 98990 12345",
    preferences: ["Any Gender", "Non-Smoker"]
  },
  {
    id: 9,
    ownerId: 9,
    title: "Heritage Flatshare near Deer Park | Hauz Khas",
    city: "Delhi NCR",
    location: "Hauz Khas Enclave, South Delhi",
    rent: 23000,
    type: "Private Room",
    mediaUrls: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Terrace Garden", "Cook Available", "Geyser"],
    description: "Quiet green haven in South Delhi overlooking Hauz Khas greenery. Shared rooftop terrace garden, spacious room with built-in cupboards, and home-cooked meals by resident cook.",
    phone: "+91 99101 22334",
    preferences: ["Female Preferred", "Vegetarian Preferred"]
  },
  {
    id: 10,
    ownerId: 10,
    title: "Entire 1BHK Apartment | Viman Nagar",
    city: "Pune",
    location: "Near Symbiosis, Viman Nagar",
    rent: 24000,
    type: "Entire Flat",
    mediaUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["WiFi", "AC", "Balcony", "Fridge", "Washing Machine", "Lift"],
    description: "Independent 1BHK flat for single occupancy or couple in Viman Nagar. Close to Pune Airport, Phoenix Marketcity mall, and IT parks. Fully furnished and move-in ready.",
    phone: "+91 97445 66778",
    preferences: ["Any Gender", "Professional or Student"]
  }
];

module.exports = { MOCK_USERS, MOCK_LISTINGS };
