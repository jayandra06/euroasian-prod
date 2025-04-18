'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Progress } from '@/components/ui/progress'; // Assuming your Progress component is in this path

const AuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Ensure we're in a client-side environment
    if (typeof window !== 'undefined') {
      const supabase = createClient();
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.slice(1));

      console.log('Hash Params:', hashParams.toString());

      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Only proceed if both tokens are available
      if (access_token && refresh_token) {
        (async () => {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error('Error setting session:', error.message);
            // You might want to redirect to an error page here
            return;
          }

          // Redirect based on the type of action
          if (type === 'recovery') {
            router.replace('/auth/reset-password');
          } else if (type === 'invite') {
            router.replace('/auth/reset-password'); // Ensure this page exists
          } else {
            router.replace('/jhv');
          }
        })();
      }
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Progress className="w-56 mb-4" value={null} /> {/* Indeterminate progress bar */}
      <p className="text-lg text-muted-foreground">Authenticating...</p>
    </div>
  );
};

export default AuthCallbackPage;