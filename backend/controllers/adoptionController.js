import { supabase } from '../config/db.js';

// GET /api/adoptions - Fetch all adoption applications (admin use)
export const getAdoptions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(id, name, breed, image_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/adoptions - Submit an adoption application
export const createAdoption = async (req, res) => {
  const {
    pet_id,
    full_name,
    email,
    phone,
    housing_type,
    own_or_rent,
    other_pets,
    experience,
    applicant_notes,
  } = req.body;

  const requiredFields = {
    pet_id,
    full_name,
    email,
    phone,
    applicant_notes,
  };
  const missingFields = Object.entries(requiredFields)
    .filter(([, value]) => value === undefined || value === null || String(value).trim() === '')
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  try {
    const { data, error } = await supabase
      .from('adoption_requests')
      .insert([{
        user_id: req.user?.id || null,
        pet_id,
        full_name,
        email,
        phone,
        housing_type,
        own_or_rent,
        other_pets,
        experience,
        applicant_notes,
        status: 'Pending',
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Application submitted successfully!', adoption: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
