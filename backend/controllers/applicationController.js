import { ApplicationModel } from '../models/Application.js';

// GET /api/applications - returns all applications for the logged-in user
export const getUserApplications = async (req, res) => {
  try {
    const applications = await ApplicationModel.getByUserId(req.user.id);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/applications - create a new adoption application
export const createApplication = async (req, res) => {
  try {
    const { petId, applicantNotes } = req.body;

    if (!petId) {
      return res.status(400).json({ error: 'petId is required' });
    }

    const newApp = await ApplicationModel.create({
      user_id: req.user.id,
      pet_id: petId,
      applicant_notes: applicantNotes || '',
      status: 'In Review',
    });

    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
