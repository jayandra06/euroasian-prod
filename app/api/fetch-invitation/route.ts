import { createClient } from '@/utils/supabase/client'; // Adjust the import as needed

const fetchInvitationDetailsByEmail = async (email) => {
  const supabase = createClient();

  // Fetch invitation details from the 'invitations' table based on email
  const { data, error } = await supabase
    .from('invitations') // Ensure 'invitations' is the correct table name
    .select('*') // Adjust the columns you need (e.g., 'email', 'invite_type', 'status')
    .eq('email', email) // Search for the invitation by email
    .single(); // Assuming email is unique for each invitation

  // Check for errors
  if (error) {
    console.error('Error fetching invitation:', error.message);
    return { error: error.message }; // Return error message if there was an issue
  }

  // If data is fetched successfully, return the invitation details
  return { data };
};

export default fetchInvitationDetailsByEmail;
