const User = require('../models/User');
const Gemstone = require('../models/Gemstone');
const Recommendation = require('../models/Recommendation');
const Favorite = require('../models/Favorite');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalGemstones = await Gemstone.countDocuments();
    const totalRecommendations = await Recommendation.countDocuments();
    const totalFavorites = await Favorite.countDocuments();

    let mostRecommendedGem = { name: 'None', count: 0 };
    try {
      const popularGems = await Recommendation.aggregate([
        { $unwind: "$recommendedGemstones" },
        { $group: { _id: "$recommendedGemstones", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);
      if (popularGems.length > 0) {
        const gem = await Gemstone.findById(popularGems[0]._id);
        if (gem) {
          mostRecommendedGem = { name: gem.name, count: popularGems[0].count };
        }
      }
    } catch (aggErr) {
      console.error('Aggregation error for popular gemstones:', aggErr);
    }

    const recentRecommendations = await Recommendation.find()
      .populate('user', 'name email')
      .populate('recommendedGemstones', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      stats: {
        users: totalUsers,
        gemstones: totalGemstones,
        recommendations: totalRecommendations,
        favorites: totalFavorites,
        mostRecommended: mostRecommendedGem
      },
      recentRecommendations
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Admin dashboard failed to load', error: err });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.session.userId } })
      .sort({ createdAt: -1 });

    res.render('admin/users', { users });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to retrieve users', error: err });
  }
};

exports.toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).render('error', { message: 'User not found', error: { status: 404 } });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to change user role', error: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).render('error', { message: 'User not found', error: { status: 404 } });
    }
    await Recommendation.deleteMany({ user: userId });
    await Favorite.deleteMany({ user: userId });

    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete user', error: err });
  }
};

exports.getGemstones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const search = req.query.q || '';
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { planet: { $regex: search, $options: 'i' } },
          { problemCategories: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const totalGemstones = await Gemstone.countDocuments(query);
    const totalPages = Math.ceil(totalGemstones / limit);

    const gemstones = await Gemstone.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('admin/gemstones', {
      gemstones,
      search,
      currentPage: page,
      totalPages,
      totalGemstones
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to retrieve gemstones', error: err });
  }
};

exports.getAddGemstone = (req, res) => {
  res.render('admin/gemstone-form', {
    gemstone: null,
    editing: false,
    error: null
  });
};

exports.createGemstone = async (req, res) => {
  const { name, planet, benefits, description, wearDay, metal, priceRange, image, zodiacSigns, problemCategories } = req.body;

  try {
    const benefitsArr = typeof benefits === 'string' ? benefits.split(',').map(item => item.trim()).filter(Boolean) : (benefits || []);
    const zodiacArr = typeof zodiacSigns === 'string' ? zodiacSigns.split(',').map(item => item.trim()).filter(Boolean) : (zodiacSigns || []);
    const categoryArr = typeof problemCategories === 'string' ? problemCategories.split(',').map(item => item.trim()).filter(Boolean) : (problemCategories || []);

    const gemExists = await Gemstone.findOne({ name });
    if (gemExists) {
      return res.render('admin/gemstone-form', {
        gemstone: req.body,
        editing: false,
        error: 'Gemstone with this name already exists'
      });
    }

    await Gemstone.create({
      name,
      planet,
      benefits: benefitsArr,
      description,
      wearDay,
      metal,
      priceRange,
      image: image || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=400&q=80',
      zodiacSigns: zodiacArr,
      problemCategories: categoryArr
    });

    res.redirect('/admin/gemstones');
  } catch (err) {
    console.error(err);
    res.render('admin/gemstone-form', {
      gemstone: req.body,
      editing: false,
      error: err.message || 'Validation failed. Check your fields.'
    });
  }
};

exports.getEditGemstone = async (req, res) => {
  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) {
      return res.status(404).render('error', { message: 'Gemstone not found', error: { status: 404 } });
    }

    res.render('admin/gemstone-form', {
      gemstone,
      editing: true,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to retrieve gemstone for editing', error: err });
  }
};

exports.updateGemstone = async (req, res) => {
  const { name, planet, benefits, description, wearDay, metal, priceRange, image, zodiacSigns, problemCategories } = req.body;

  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) {
      return res.status(404).render('error', { message: 'Gemstone not found', error: { status: 404 } });
    }

    const benefitsArr = typeof benefits === 'string' ? benefits.split(',').map(item => item.trim()).filter(Boolean) : (benefits || []);
    const zodiacArr = typeof zodiacSigns === 'string' ? zodiacSigns.split(',').map(item => item.trim()).filter(Boolean) : (zodiacSigns || []);
    const categoryArr = typeof problemCategories === 'string' ? problemCategories.split(',').map(item => item.trim()).filter(Boolean) : (problemCategories || []);

    if (name !== gemstone.name) {
      const gemExists = await Gemstone.findOne({ name });
      if (gemExists) {
        return res.render('admin/gemstone-form', {
          gemstone: { ...req.body, _id: gemstone._id },
          editing: true,
          error: 'Gemstone with this name already exists'
        });
      }
    }

    gemstone.name = name;
    gemstone.planet = planet;
    gemstone.benefits = benefitsArr;
    gemstone.description = description;
    gemstone.wearDay = wearDay;
    gemstone.metal = metal;
    gemstone.priceRange = priceRange;
    gemstone.image = image || gemstone.image;
    gemstone.zodiacSigns = zodiacArr;
    gemstone.problemCategories = categoryArr;

    await gemstone.save();

    res.redirect('/admin/gemstones');
  } catch (err) {
    console.error(err);
    res.render('admin/gemstone-form', {
      gemstone: { ...req.body, _id: req.params.id },
      editing: true,
      error: err.message || 'Update validation failed.'
    });
  }
};

exports.deleteGemstone = async (req, res) => {
  try {
    const gemstone = await Gemstone.findByIdAndDelete(req.params.id);
    if (!gemstone) {
      return res.status(404).render('error', { message: 'Gemstone not found', error: { status: 404 } });
    }

    // Remove from user favorites
    await Favorite.deleteMany({ gemstone: req.params.id });

    res.redirect('/admin/gemstones');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to delete gemstone', error: err });
  }
};
