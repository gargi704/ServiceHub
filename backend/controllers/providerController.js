const Provider = require('../models/provider');

exports.createOrUpdateProvider = async (req, res) => {
  console.log("PROVIDER SAVE API CALLED:");
  console.log("BODY RECEIVED --->", req.body);
  const {
    user, service, experience, rating, description, location, profileImage,
    email, phone, address, city, state, hourlyRate, skills, totalJobs, completedJobs, earnings
  } = req.body;
  try {
    let provider = await Provider.findOne({ user });
    if (provider) {
      provider.service = service;
      provider.experience = experience;
      provider.rating = rating;
      provider.description = description;
      provider.location = location;
      provider.profileImage = profileImage || provider.profileImage;
      provider.email = email;
      provider.phone = phone;
      provider.address = address;
      provider.city = city;
      provider.state = state;
      provider.hourlyRate = hourlyRate;
      provider.skills = skills;
      provider.totalJobs = totalJobs ?? provider.totalJobs;
      provider.completedJobs = completedJobs ?? provider.completedJobs;
      provider.earnings = earnings ?? provider.earnings;
      await provider.save();
    } else {
      provider = new Provider({
        user, service, experience, rating, description, location, profileImage,
        email, phone, address, city, state, hourlyRate, skills, totalJobs, completedJobs, earnings
      });
      await provider.save();
    }
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId).populate('user', 'name email');
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProviderByUserId = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.params.userId }).populate('user', 'name email');
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProviderPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: "No userId provided" });
    const provider = await Provider.findOneAndUpdate(
      { user: userId },
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    );
    if (!provider) return res.status(404).json({ error: "Provider not found" });
    res.json({ profileImage: provider.profileImage });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to upload photo" });
  }
};

exports.uploadProviderFiles = async (req, res) => {
  try {
    const { userId, type } = req.body;
    if (!userId || !type) return res.status(400).json({ error: "Missing userId or type" });
    if (!req.files || !req.files.length) return res.status(400).json({ error: "No files uploaded" });
    const filePaths = req.files.map(f => `/uploads/${f.filename}`);

    // Build update object for provider doc
    const updateObj = {};
    if (['idProof', 'certificates', 'workPhotos'].includes(type)) {
      updateObj[type] = filePaths;
    } else {
      return res.status(400).json({ error: "Invalid upload type" });
    }

    // Update: push-upload (append to array, not replace)
    const provider = await Provider.findOneAndUpdate(
      { user: userId },
      { $push: { [type]: { $each: filePaths } } },
      { new: true }
    );
    if (!provider) return res.status(404).json({ error: "Provider not found" });

    res.json({ [type]: provider[type] }); 
  } catch (error) {
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};


// Get all providers (for customer dashboard)
exports.getAllProviders = async (req, res) => {
  try {
    // The 'user' field should be populated for dynamic name/email in UI
    const providers = await Provider.find().populate('user', 'name email');
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

