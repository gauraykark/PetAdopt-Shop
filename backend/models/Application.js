import { supabase } from '../config/db.js';

export const ApplicationModel = {
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select(`
        id,
        status,
        created_at,
        applicant_notes,
        pets ( id, name, breed, image_url )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(applicationData) {
    const { data, error } = await supabase
      .from('adoption_requests')
      .insert([applicationData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};