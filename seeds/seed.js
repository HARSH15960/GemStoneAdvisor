require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Gemstone = require('../models/Gemstone');
const Recommendation = require('../models/Recommendation');
const Favorite = require('../models/Favorite');

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gemstone-recommend';

const gemstonesData = [
  {
    name: "Ruby (Manik)",
    planet: "Sun",
    benefits: [
      "Enhances leadership capabilities and authority",
      "Boosts core self-confidence and will power",
      "Clears blockages in professional growth",
      "Protects physical vitality and cardiovascular health"
    ],
    description: "Ruby represents the Sun, the king of planets in Vedic astrology. It is a premium stone of power and dignity, ideal for individuals aiming for government posts, executive roles, or administrative authority. It radiates a warm energy that dispels self-doubt.",
    wearDay: "Sunday",
    metal: "Gold",
    priceRange: "₹15,000 - ₹35,000",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Leo", "Aries", "Sagittarius"],
    problemCategories: ["Career", "Health"]
  },
  {
    name: "Pearl (Moti)",
    planet: "Moon",
    benefits: [
      "Provides deep emotional stability and calming vibes",
      "Promotes peace of mind and controls anger",
      "Eases relationship distress and marital arguments",
      "Improves sleep patterns and cognitive clarity"
    ],
    description: "Pearl represents the Moon, the ruling celestial body of thoughts and emotions. It is widely recommended for individuals experiencing volatile mood swings, depression, or marital discord. Wearing it cools the mind and promotes domestic harmony.",
    wearDay: "Monday",
    metal: "Silver",
    priceRange: "₹3,000 - ₹8,000",
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Cancer", "Scorpio", "Pisces"],
    problemCategories: ["Health", "Marriage"]
  },
  {
    name: "Red Coral (Moonga)",
    planet: "Mars",
    benefits: [
      "Ignites motivation, courage, and stamina",
      "Assists in overcoming business competitors",
      "Helps clear financial debts and blocks",
      "Speeds up recovery from blood-related ailments"
    ],
    description: "Red Coral represents Mars, the planet of energy, ambition, and strength. It is highly beneficial for sluggish careers, competitive business strategies, and physical exhaustion. It instills the determination required to clear heavy liabilities.",
    wearDay: "Tuesday",
    metal: "Copper/Gold",
    priceRange: "₹5,000 - ₹12,000",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Aries", "Scorpio", "Leo"],
    problemCategories: ["Career", "Business", "Health"]
  },
  {
    name: "Emerald (Panna)",
    planet: "Mercury",
    benefits: [
      "Enhances intellectual capacity and logical reasoning",
      "Sharpens communication and business negotiation skills",
      "Attracts steady money flows and trade success",
      "Increases memory power and success in competitive tests"
    ],
    description: "Emerald represents Mercury, the planet of commerce, intellect, and calculations. It is a crucial gemstone for business analysts, accountants, students, and consultants. It aids in clear, influential speaking and sharp business foresight.",
    wearDay: "Wednesday",
    metal: "Gold/Silver",
    priceRange: "₹18,000 - ₹45,000 (Premium Segment)",
    image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Gemini", "Virgo", "Taurus", "Libra"],
    problemCategories: ["Business", "Money", "Education"]
  },
  {
    name: "Yellow Sapphire (Pukhraj)",
    planet: "Jupiter",
    benefits: [
      "Brings immense wisdom, spirituality, and judgment",
      "Triggers luck and high luxury wealth creation",
      "Facilitates marital compatibility and child birth harmony",
      "Ensures success in higher academics and law fields"
    ],
    description: "Yellow Sapphire represents Jupiter (Guru), the most benevolent planet governing wealth, wisdom, and marriages. Known for bringing abundance, it is highly recommended to neutralize marriage delays, remove education blocks, and build solid asset wealth.",
    wearDay: "Thursday",
    metal: "Gold",
    priceRange: "₹25,000 - ₹65,000 (Premium Segment)",
    image: "https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Sagittarius", "Pisces", "Aries", "Scorpio", "Cancer"],
    problemCategories: ["Career", "Money", "Education", "Marriage"]
  },
  {
    name: "Diamond (Heera)",
    planet: "Venus",
    benefits: [
      "Enhances creative arts and design talents",
      "Attracts high-class luxury and material prosperity",
      "Promotes romance, marital affection, and charisma",
      "Boosts status, lifestyle comfort, and public fame"
    ],
    description: "Diamond is the representative gem of Venus, the planet of beauty, luxury, and relationships. Perfect for creative professionals, diamonds boost public attractiveness, heal strained marriages, and draw elite comforts into life.",
    wearDay: "Friday",
    metal: "White Gold/Platinum",
    priceRange: "₹50,000 - ₹1,50,000 (Luxury Segment)",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Taurus", "Libra", "Gemini", "Virgo", "Aquarius"],
    problemCategories: ["Marriage", "Money", "Career"]
  },
  {
    name: "Blue Sapphire (Neelam)",
    planet: "Saturn",
    benefits: [
      "Accelerates professional promotion and structural gains",
      "Generates massive business revenue opportunities",
      "Wards off evil energies, black magic, and severe hurdles",
      "Acts as a powerful shield against accidents or failures"
    ],
    description: "Blue Sapphire represents Saturn, the strict taskmaster planet. It is the fastest-acting gemstone in astrology, bringing sudden changes. Recommended for career structures, industries, logistics, and removing severe lifetime blocks.",
    wearDay: "Saturday",
    metal: "Panchdhatu",
    priceRange: "₹35,000 - ₹90,000 (Luxury Segment)",
    image: "https://images.unsplash.com/photo-1611085583191-a3b1a20fdf54?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Capricorn", "Aquarius", "Taurus", "Libra"],
    problemCategories: ["Career", "Business", "Money"]
  },
  {
    name: "Hessonite (Gomed)",
    planet: "Rahu",
    benefits: [
      "Clears mental haze, anxiety, and confusion",
      "Accelerates success in tech, digital marketing, and stock trading",
      "Triggers sudden windfalls and unexpected financial profits",
      "Relieves digestive system issues and respiratory health"
    ],
    description: "Hessonite governs Rahu, the node of desires and sudden events. It is highly beneficial in the modern era to gain success in speculation, software, digital technology, and high-stakes business deals, removing negative illusions.",
    wearDay: "Saturday",
    metal: "Silver/Panchdhatu",
    priceRange: "₹4,000 - ₹10,000",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Taurus", "Gemini", "Virgo", "Libra", "Capricorn", "Aquarius"],
    problemCategories: ["Career", "Business"]
  },
  {
    name: "Cat's Eye (Lehsuniya)",
    planet: "Ketu",
    benefits: [
      "Promotes deep spiritual introspection and meditation flow",
      "Heals chronic illness and physical alignment blockages",
      "Protects wealth from sudden losses and speculation crashes",
      "Restores communication harmony in family relationships"
    ],
    description: "Cat's Eye represents Ketu, the spiritual node. It is highly protective, shielding users from unseen enemies, accidents, and sudden financial downward spirals. It is excellent for spiritual practitioners and health recovery.",
    wearDay: "Tuesday",
    metal: "Silver/Panchdhatu",
    priceRange: "₹3,500 - ₹9,500",
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=400&q=80",
    zodiacSigns: ["Aries", "Leo", "Sagittarius", "Pisces", "Scorpio"],
    problemCategories: ["Health", "Money", "Marriage"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log('Seed: Connected to Database...');

    // Clear collections
    console.log('Seed: Wiping old collections...');
    await User.deleteMany({});
    await Gemstone.deleteMany({});
    await Recommendation.deleteMany({});
    await Favorite.deleteMany({});

    // Seed Gemstones
    console.log('Seed: Cataloging gemstones...');
    const insertedGems = await Gemstone.insertMany(gemstonesData);
    console.log(`Seed: Successfully seeded ${insertedGems.length} gemstones.`);

    // Seed Default Admin
    console.log('Seed: Creating default Admin user...');
    await User.create({
      name: "Gemstone Advisor Admin",
      email: "admin@gemstoneadvisor.com",
      password: "adminpassword123", // Hashes automatically via pre-save hook
      role: "admin"
    });
    console.log('Seed: Admin user created [email: admin@gemstoneadvisor.com, password: adminpassword123]');

    // Seed Default User
    console.log('Seed: Creating default test User...');
    await User.create({
      name: "John Doe",
      email: "user@gemstoneadvisor.com",
      password: "userpassword123", // Hashes automatically via pre-save hook
      role: "user"
    });
    console.log('Seed: Test user created [email: user@gemstoneadvisor.com, password: userpassword123]');

    console.log('Seed: Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
