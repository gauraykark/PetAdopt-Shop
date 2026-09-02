import { supabase } from '../config/db.js';

export const PetModel = {
  async getAllPets() {
    const { data, error } = await supabase.from('pets').select('*');
    if (error) throw error;
    return data;
  },

  async getPetById(id) {
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }
};