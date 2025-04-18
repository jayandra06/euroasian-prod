'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { createClient } from '@/utils/supabase/client';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get access to URL parameters
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isInvite, setIsInvite] = useState(false); // State to track if it's an invite

  useEffect(() => {
    // Check if the 'type' parameter in the URL is 'invite'
    const type = searchParams.get('type');
    console.log('URL type param:', type); // Log the 'type' URL parameter
    if (type === 'invite') {
      setIsInvite(true);
    }
  }, [searchParams]);

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');
  
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
  
    const supabase = createClient();
  
    // Update the user's password
    const { data, error } = await supabase.auth.updateUser({ password });
  
    if (error) {
      console.error('Error updating password:', error.message);
      setMessage('Failed to update password.');
      setLoading(false);
      return;
    }
  
    // Optional: Fetch the user and profile again to redirect appropriately
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user) {
      console.error('Error fetching user:', userError?.message || 'No user');
      setMessage('Error fetching user info.');
      setLoading(false);
      return;
    }
  
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .single();
  
    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      setMessage('Error fetching user role.');
      setLoading(false);
      return;
    }
  
    let redirectTo = '/dashboard';
    if (profile?.user_role === 'customer') {
      redirectTo = `/dashboard/oboarding/customer-onboarding/${user.email}`;
    } else if (profile?.user_role === 'vendor') {
      redirectTo = `/dashboard/oboarding/customer-onboarding/${user.id}`;
    }
  
    setMessage('Password updated successfully! Redirecting...');
    setTimeout(() => {
      router.replace(redirectTo);
    }, 1500);
  
    setLoading(false);
  };
  

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <button
        onClick={handleResetPassword}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>

      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
