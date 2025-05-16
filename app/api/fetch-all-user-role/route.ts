import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  console.log('[FETCH-USERS] Request received');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[FETCH-USERS] Supabase credentials missing');
    return new Response(
      JSON.stringify({ success: false, error: "Server misconfiguration" }),
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    console.log('[FETCH-USERS] Fetching users');
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('[FETCH-USERS] Auth error:', authError);
      throw authError;
    }

    console.log('[FETCH-USERS] Found', authUsers.users.length, 'users');
    
    // Get roles from role_management table
    const { data: rolesData, error: rolesError } = await supabaseAdmin
      .from('role_management')
      .select('user_id, role');
    
    if (rolesError) {
      console.error('[FETCH-USERS] Roles error:', rolesError);
      throw rolesError;
    }

    console.log('[FETCH-USERS] Found', rolesData.length, 'role records');

    // Get all available roles from all_role table
    const { data: allRolesData, error: allRolesError } = await supabaseAdmin
      .from('all_role')
      .select('role');
    
    if (allRolesError) {
      console.error('[FETCH-USERS] All roles error:', allRolesError);
      throw allRolesError;
    }

    console.log('[FETCH-USERS] Found', allRolesData.length, 'roles in all_role table');
    
    // Map roles to users
    const usersWithRoles = authUsers.users.map(user => {
      const userRole = rolesData.find(r => r.user_id === user.id);
      return {
        ...user,
        role: userRole?.role || "Basic user"
      };
    });

    console.log('[FETCH-USERS] Returning users:', usersWithRoles.length);
    return new Response(JSON.stringify({ 
      success: true, 
      users: usersWithRoles,
      allRoles: allRolesData.map(role => role.role) // Include all available roles
    }), {
      status: 200,
    });
  } catch (err) {
    console.error('[FETCH-USERS] Server error:', err);
    return new Response(
      JSON.stringify({ success: false, error: "Unexpected server error" }),
      { status: 500 }
    );
  }
}
