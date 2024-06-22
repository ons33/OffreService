import OffreDemploi from '../models/OffreDemploi.js';

const createOffre = async (req, res) => {
    try {
      console.log(req.body); // For debugging purposes, can be commented out later
  
      // Extract data from request body (assuming these match frontend attributes)
      const { intitule, typeOffre, description, workplaceType, entrepriseNom, salaire, photo, tags, skills, userId } = req.body;
  
      // Create a new OffreEmploi document
      const newOffre = new OffreDemploi({
        intitule,
        typeOffre,
        description,
        workplaceType,
        entrepriseNom,
        salaire,
        photo,
        tags,
        skills, // Added skills to the newOffre object
        userId,
      });
  
      // Save the new OffreEmploi document to the database
      const savedOffre = await newOffre.save();
  
      // Respond with success message and the created OffreEmploi document
      res.status(201).json({ success: true, data: savedOffre });
    } catch (err) {
      // Handle errors more specifically (refer to previous suggestion)
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  const GetOffreByIduser = async (req, res) => {
    console.log("userId");
    const userId = req.params.userId; // Extract user ID from request parameters
  console.log("userId",userId);
    try {
      // Assuming you have a model named Offre and you want to retrieve offers by user ID
      const offres = await OffreDemploi.find({ userId: userId });
  
      res.status(200).json({ success: true, data: offres });
    } catch (error) {
      console.error('Error retrieving job offers by user ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

// Get all OffresDemploi
const getAllOffres = async (req, res) => {
    try {
        const offres = await OffreDemploi.find();
        res.status(200).json({ success: true, data: offres });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Get a single OffreDemploi by ID
const getOffreById = async (req, res) => {
    try {
        const offre = await OffreDemploi.findById(req.params.id);
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(200).json({ success: true, data: offre });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Search for jobs by intitulé
const searchJobsByIntitule = async (req, res) => {
    const { intitule } = req.query;
    try {
        const jobs = await OffreDemploi.find({ intitule: { $regex: intitule, $options: 'i' } });
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an OffreDemploi by ID
const updateOffre = async (req, res) => {
    try {
        const offre = await OffreDemploi.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(200).json({ success: true, data: offre });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Delete an OffreDemploi by ID
const deleteOffre = async (req, res) => {
    try {
        const offre = await OffreDemploi.findByIdAndDelete(req.params.id);
        if (!offre) {
            return res.status(404).json({ success: false, message: 'Offre not found' });
        }
        res.status(204).json({ success: true, data: null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}


export {
    createOffre,
    getAllOffres,
    getOffreById,
    updateOffre,
    deleteOffre,
    searchJobsByIntitule,
    GetOffreByIduser
};
