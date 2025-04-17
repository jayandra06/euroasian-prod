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
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError.message);
      setMessage('Error fetching user details.');
      setLoading(false);
      return;
    }

    if (!user) {
      console.error('No user found.');
      setMessage('No user found.');
      setLoading(false);
      return;
    }

    console.log('Fetched user:', user); // Log the fetched user

    const { data: profile, error: profileError } = await supabase
      .from('profiles') // Replace 'profiles' with your actual table name
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
      setMessage('Error fetching profile.');
      setLoading(false);
      return;
    }

    console.log('Fetched profile:', profile); // Log the fetched profile

    if (profile?.user_role) {
      console.log('User role:', profile.user_role); // Log the user role
      let redirectTo = '/dashboard'; // Default redirection path

      if (profile.user_role === 'customer') {
        redirectTo = `/dashboard/oboarding/customer-onboarding/${user.email}`;
      } else if (profile.user_role === 'vendor') {
        redirectTo = '/vendor-onboarding';
      }

      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => {
        console.log('Redirecting to:', redirectTo); // Log the redirection URL
        router.replace(redirectTo);
      }, 1500);
      return; // Exit the function to prevent further code execution
    } else {
      console.error('No user role found in profile.');
      setMessage('No user role found.');
      setTimeout(() => router.replace('/dashboard'), 1500); // Default redirection if no role is found
    }

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
