const User = require('../models/User');
const Gemstone = require('../models/Gemstone');
const Recommendation = require('../models/Recommendation');
const Favorite = require('../models/Favorite');

const dynamicDescriptions = {
  "Ruby": {
    "Career": "Ruby is the primary crystal of the Sun, igniting your solar plexus energy. For Career, it directly channels leadership presence, clears authority blocks, and amplifies self-confidence, leading to long-term professional success and decision-making clarity.",
    "Health": "Ruby channels life-giving solar forces to strengthen your physical vitality, bolster heart health, and rejuvenate overall stamina.",
    "Business": "Ruby provides the commanding confidence and resilience necessary to lead business deals, establish authority over competitors, and close high-value partnerships.",
    "Money": "Ruby brings status and recognition, which naturally draws financial opportunities, professional raises, and wealthy assets into your sphere.",
    "Marriage": "Ruby fosters loyalty, warm affection, and commitment, clearing obstacles to stable family relations.",
    "Education": "Ruby enhances your executive concentration, mental stamina, and confidence during competitive exams."
  },
  "Pearl": {
    "Career": "Pearl channels calming lunar energy to provide mental clarity, clear decision-making focus, and eliminate workplace stress.",
    "Health": "Pearl is highly recommended for mental peace, easing anxiety, balancing internal biological cycles, and restoring restorative sleep.",
    "Business": "Pearl aids in calm negotiation and emotional intelligence, preventing impulsive decisions in partnership deals.",
    "Money": "Pearl stabilizes volatile financial fluctuations and helps structure consistent wealth retention.",
    "Marriage": "Pearl represents emotional harmony, relationship compatibility, and domestic bliss, helping dissolve marriage delays and family friction.",
    "Education": "Pearl calms exam-related anxiety, allowing students to maintain focus and compose their minds during studies."
  },
  "Red Coral": {
    "Career": "Red Coral, ruled by Mars, activates your drive, ambition, and confidence to overcome professional stagnation and succeed in challenging roles.",
    "Health": "Red Coral boosts physical stamina, enhances blood circulation vitality, and speeds up cellular recovery.",
    "Business": "Red Coral provides competitive courage, helping trade businesses win client bids and outshine competitors.",
    "Money": "Red Coral clears financial liabilities, helps pay off debts, and unlocks blocked money streams.",
    "Marriage": "Red Coral helps balance relationship energies and clear emotional obstacles to long-term union.",
    "Education": "Red Coral builds memory power and the energetic determination required for technical studies."
  },
  "Emerald": {
    "Career": "Emerald provides sharp analytical thinking, communication eloquence, and intellectual authority, leading to swift professional promotions.",
    "Health": "Emerald restores nervous system balance, eases mental fatigue, and aids in emotional decompression.",
    "Business": "Emerald is the ultimate trade stone, sharpening business negotiations, improving commerce intelligence, and closing profitable deals.",
    "Money": "Emerald draws liquid money flow, stimulates prosperous investments, and creates business capital growth.",
    "Marriage": "Emerald heals communication issues between couples, fostering understanding and mutual respect.",
    "Education": "Emerald enhances memory retention, cognitive focus, logical reasoning, and academic success."
  },
  "Yellow Sapphire": {
    "Career": "Yellow Sapphire represents Jupiter, bringing wisdom and professional growth. It enhances strategic decision-making and draws executive authority.",
    "Health": "Yellow Sapphire purifies overall digestion energy, expands spiritual calm, and guards physical immunity.",
    "Business": "Yellow Sapphire brings massive expansion luck, commercial wisdom, and highly profitable long-term deals.",
    "Money": "Yellow Sapphire is the stone of abundance, attracting luxury assets, stable income flows, and financial luck.",
    "Marriage": "Yellow Sapphire resolves marriage delays, ensures compatibility, and fosters child-birth harmony.",
    "Education": "Yellow Sapphire expands intelligence, ideal for higher academics, law, and philosophical research studies."
  },
  "Diamond": {
    "Career": "Diamond channels Venusian energy to enhance your creative presentation, professional charm, and public recognition.",
    "Health": "Diamond optimizes sensory vitality, reduces tension, and promotes physical harmony.",
    "Business": "Diamond brings creative branding intelligence, attracting premium clients and luxury segment deals.",
    "Money": "Diamond attracts premium luxury comforts, rich assets, and material prosperity.",
    "Marriage": "Diamond represents relationship romance, deep marital compatibility, and relationship healing.",
    "Education": "Diamond boosts artistic focus, fine arts skills, and creative learning talents."
  },
  "Blue Sapphire": {
    "Career": "Blue Sapphire, governed by Saturn, brings swift professional growth, organizational promotions, and clears complex administrative blocks.",
    "Health": "Blue Sapphire forms an energy shield, protecting you from health accidents and chronic fatigue.",
    "Business": "Blue Sapphire triggers rapid trade expansion, massive revenue gains, and protects against commercial losses.",
    "Money": "Blue Sapphire clears long-standing money stagnation and unlocks heavy wealth assets.",
    "Marriage": "Blue Sapphire clears chronic relationship delays, building long-term emotional loyalty.",
    "Education": "Blue Sapphire instills deep focus, structure, and academic discipline."
  },
  "Hessonite": {
    "Career": "Hessonite brings mental clarity, helping digital professionals, programmers, and stock analysts achieve professional success and decision-making growth.",
    "Health": "Hessonite relieves sudden digestive fatigue and reduces skin allergies.",
    "Business": "Hessonite unlocks speculative gains, helping traders secure high-risk business deals.",
    "Money": "Hessonite attracts unexpected financial windfalls and recovers blocked funds.",
    "Marriage": "Hessonite clears communication misunderstandings and restores domestic balance.",
    "Education": "Hessonite sharpens investigative focus, research capabilities, and technical logic."
  },
  "Cat's Eye": {
    "Career": "Cat's Eye clears career path obstructions, shielding you from workplace office politics and professional hurdles.",
    "Health": "Cat's Eye protects against sudden illnesses, supports nerve health, and clears chronic fatigue.",
    "Business": "Cat's Eye acts as a guard against sudden commercial losses and protects business assets.",
    "Money": "Cat's Eye shields your wealth from sudden speculation crashes and stabilizes cash flows.",
    "Marriage": "Cat's Eye clears marriage delays caused by planetary obstacles, restoring family harmony.",
    "Education": "Cat's Eye enhances intuitive intelligence, focus, and memory power."
  }
};

const dynamicBenefits = {
  "Career": [
    "Professional Growth",
    "Leadership Development",
    "Strategic Decision Making",
    "Career Advancement",
    "Confidence Building",
    "Workplace Recognition"
  ],
  "Business": [
    "Business Expansion",
    "Financial Stability",
    "Better Investments",
    "Strategic Partnerships",
    "Entrepreneurial Success"
  ],
  "Money": [
    "Wealth Creation",
    "Financial Discipline",
    "Prosperity",
    "Better Resource Management",
    "Financial Opportunities"
  ],
  "Marriage": [
    "Relationship Harmony",
    "Marital Compatibility",
    "Emotional Understanding",
    "Family Stability",
    "Positive Partnerships"
  ],
  "Health": [
    "Mental Wellness",
    "Emotional Balance",
    "Positive Energy",
    "Stress Reduction",
    "Lifestyle Improvement"
  ],
  "Education": [
    "Academic Success",
    "Better Focus",
    "Learning Ability",
    "Knowledge Growth",
    "Examination Confidence"
  ]
};

function getDynamicDescription(gemName, category) {
  for (const key in dynamicDescriptions) {
    if (gemName.includes(key)) {
      return dynamicDescriptions[key][category] || dynamicDescriptions[key]["Career"];
    }
  }
  return "Aligns planetary influences to dissolve life hurdles and bring positive cosmic energy.";
}

function getWhyExplanation(zodiacSign, problemCategory, gemstoneName, planet) {
  const benefitMap = {
    "Career": "leadership, professional success, confidence, better decision making, and growth opportunities",
    "Business": "trade success, commercial growth, negotiations, and strategic investments",
    "Money": "wealth attraction, saving stability, asset growth, and financial protection",
    "Marriage": "marital bliss, relationship compatibility, mutual understanding, and family harmony",
    "Education": "concentration, focus, memory retention, logical reasoning, and academic success",
    "Health": "physical vitality, mental peace, stress recovery, stamina, and biological rejuvenation"
  };
  const benefits = benefitMap[problemCategory] || "overall life alignment";
  return `Based on your ${zodiacSign} zodiac sign and ${problemCategory}-focused goal, this gemstone (ruled by ${planet}) aligns with planetary influences traditionally associated with dissolving ${problemCategory.toLowerCase()} hurdles. It activates positive cosmic channels to support ${benefits}.`;
}

// @desc    User Dashboard
// @route   GET /user/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalRecommendations = await Recommendation.countDocuments({ user: req.session.userId });
    const totalFavorites = await Favorite.countDocuments({ user: req.session.userId });
    
    // Fetch user details for Member Since calculation
    const user = await User.findById(req.session.userId);
    const memberSince = user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Fetch user recommendation history to compute user dashboard stats
    const userRecs = await Recommendation.find({ user: req.session.userId })
      .populate('recommendedGemstones')
      .sort({ createdAt: -1 });

    let lastRecommendationDate = 'None';
    let favoriteZodiac = 'None';
    let mostAlignedGemstone = 'None';

    if (userRecs.length > 0) {
      lastRecommendationDate = userRecs[0].createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const zodiacCounts = {};
      const gemCounts = {};

      userRecs.forEach(rec => {
        zodiacCounts[rec.zodiacSign] = (zodiacCounts[rec.zodiacSign] || 0) + 1;
        if (rec.recommendedGemstones) {
          rec.recommendedGemstones.forEach(gem => {
            if (gem) {
              gemCounts[gem.name] = (gemCounts[gem.name] || 0) + 1;
            }
          });
        }
      });

      // Find highest zodiac sign count
      let maxZodiac = 0;
      for (const z in zodiacCounts) {
        if (zodiacCounts[z] > maxZodiac) {
          maxZodiac = zodiacCounts[z];
          favoriteZodiac = z;
        }
      }

      // Find highest gemstone alignment count
      let maxGem = 0;
      for (const g in gemCounts) {
        if (gemCounts[g] > maxGem) {
          maxGem = gemCounts[g];
          mostAlignedGemstone = g;
        }
      }
    }

    let latestRecObj = null;
    if (userRecs.length > 0) {
      const latestRecommendation = userRecs[0];
      latestRecObj = latestRecommendation.toObject();
      if (latestRecObj.recommendedGemstones) {
        latestRecObj.recommendedGemstones = latestRecObj.recommendedGemstones
          .filter(gem => gem !== null && gem !== undefined)
          .map(gem => {
            gem.description = getDynamicDescription(gem.name, latestRecObj.problemCategory);
            gem.benefits = dynamicBenefits[latestRecObj.problemCategory] || gem.benefits;
            return gem;
          });
      }
    }

    res.render('user/dashboard', {
      totalRecommendations,
      totalFavorites,
      latestRecommendation: latestRecObj,
      memberSince,
      lastRecommendationDate,
      favoriteZodiac,
      mostAlignedGemstone
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load dashboard', error: err });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    res.render('user/profile', { user, error: null, success: null });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load profile', error: err });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, currentPassword, newPassword, confirmPassword } = req.body;
  
  try {
    const user = await User.findById(req.session.userId);
    
    if (!name) {
      return res.render('user/profile', { user, error: 'Name cannot be empty', success: null });
    }

    user.name = name;

    // Password change logic
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.render('user/profile', { user, error: 'All password fields are required to change password', success: null });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.render('user/profile', { user, error: 'Current password is incorrect', success: null });
      }

      if (newPassword !== confirmPassword) {
        return res.render('user/profile', { user, error: 'New passwords do not match', success: null });
      }

      if (newPassword.length < 6) {
        return res.render('user/profile', { user, error: 'New password must be at least 6 characters', success: null });
      }

      user.password = newPassword;
    }

    await user.save();
    res.render('user/profile', { user, error: null, success: 'Profile updated successfully!' });
  } catch (err) {
    console.error(err);
    res.render('user/profile', { 
      user: { name, email: req.user.email }, 
      error: 'An error occurred during update.', 
      success: null 
    });
  }
};

exports.getRecommendForm = (req, res) => {
  res.render('user/recommend-form');
};

exports.postRecommendForm = async (req, res) => {
  const { fullName, gender, dob, zodiacSign, problemCategory } = req.body;

  try {
    if (!fullName || !gender || !dob || !zodiacSign || !problemCategory) {
      return res.status(400).render('error', { 
        message: 'All recommendation fields are required.', 
        error: { status: 400 } 
      });
    }

   
    let recommended = await Gemstone.find({
      zodiacSigns: zodiacSign,
      problemCategories: problemCategory
    });

    if (!recommended || recommended.length === 0) {
      recommended = await Gemstone.find({
        problemCategories: problemCategory
      });
    }

    if (!recommended || recommended.length === 0) {
      recommended = await Gemstone.find({}).limit(1);
    }

    // Map gemstone IDs
    const gemstoneIds = recommended.map(g => g._id);

    // Save history with score and strength metrics
    const score = Math.floor(Math.random() * 11) + 88; // 88% to 98%
    const strengths = ['Strong', 'Highly Influential', 'Auspicious', 'Favorable'];
    const strength = strengths[Math.floor(Math.random() * strengths.length)];

    const firstGem = recommended[0] || { name: 'Unknown Gem', planet: 'Universe' };
    const whyExplanationText = getWhyExplanation(zodiacSign, problemCategory, firstGem.name, firstGem.planet);

    const recommendation = await Recommendation.create({
      user: req.session.userId,
      fullName,
      gender,
      dob: new Date(dob),
      zodiacSign,
      problemCategory,
      recommendedGemstones: gemstoneIds,
      compatibilityScore: score,
      planetStrength: strength,
      whyExplanation: whyExplanationText
    });

    res.redirect(`/user/recommendations/${recommendation._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to process recommendation', error: err });
  }
};

exports.getRecommendResult = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('recommendedGemstones');

    if (!recommendation) {
      return res.status(404).render('error', { message: 'Recommendation not found', error: { status: 404 } });
    }

    // Check ownership
    if (recommendation.user.toString() !== req.session.userId.toString()) {
      return res.status(403).render('error', { message: 'Unauthorized access to recommendation', error: { status: 403 } });
    }

    const recObj = recommendation.toObject();
    if (recObj.recommendedGemstones) {
      recObj.recommendedGemstones = recObj.recommendedGemstones
        .filter(gem => gem !== null && gem !== undefined)
        .map(gem => {
          gem.description = getDynamicDescription(gem.name, recObj.problemCategory);
          gem.benefits = dynamicBenefits[recObj.problemCategory] || gem.benefits;
          return gem;
        });
    }

    const userFavorites = await Favorite.find({ user: req.session.userId });
    const favoriteGemIds = userFavorites.map(fav => fav.gemstone.toString());

    res.render('user/recommend-result', {
      recommendation: recObj,
      favoriteGemIds
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load recommendation result', error: err });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Recommendation.find({ user: req.session.userId })
      .populate('recommendedGemstones')
      .sort({ createdAt: -1 });

    res.render('user/history', { history });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load history', error: err });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.session.userId })
      .populate('gemstone');

    res.render('user/favorites', { favorites });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to load favorites', error: err });
  }
};

exports.toggleFavorite = async (req, res) => {
  const { gemstoneId } = req.body;

  try {
    if (!gemstoneId) {
      return res.status(400).json({ success: false, message: 'Gemstone ID required' });
    }

    const existingFav = await Favorite.findOne({
      user: req.session.userId,
      gemstone: gemstoneId
    });

    if (existingFav) {
      await Favorite.findByIdAndDelete(existingFav._id);
      
      // If it's an AJAX request
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, favorited: false });
      }
    } else {
      await Favorite.create({
        user: req.session.userId,
        gemstone: gemstoneId
      });

      // If it's an AJAX request
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, favorited: true });
      }
    }

    // Direct fallback: Redirect to referrer page
    res.redirect(req.get('referrer') || '/user/favorites');
  } catch (err) {
    console.error(err);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ success: false, message: 'Server error toggling favorite' });
    }
    res.status(500).render('error', { message: 'Failed to update favorites', error: err });
  }
};
