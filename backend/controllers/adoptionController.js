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

  if (!pet_id || !full_name || !email || !phone || !applicant_notes) {
    return res.status(400).json({ error: 'All fields are required.' });
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
