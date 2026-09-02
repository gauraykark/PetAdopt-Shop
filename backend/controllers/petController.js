import { supabase } from '../config/db.js';

// GET /api/pets
export const getPets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/pets/:id
export const getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    // PGRST116 means no row found — return 404 instead of 500
    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Pet not found' });
    }
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
