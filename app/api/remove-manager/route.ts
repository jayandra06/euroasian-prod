import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: Request) {
  try {
    const formdata = await request.json();
    const { email, manager_id } = formdata;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const rawSQL = `
      DO $$
      DECLARE 
        user_id UUID;
      BEGIN
        SELECT id INTO user_id 
        FROM auth.users 
        WHERE email = '${email}';

        IF user_id IS NOT NULL THEN
            DELETE FROM member 
            WHERE member_profile = user_id;

            DELETE FROM profiles 
            WHERE id = user_id;

            DELETE FROM auth.users 
            WHERE id = user_id;
        END IF;
      END $$;
    `;

    const { error: sqlError } = await supabaseAdmin.rpc("execute_sql", { query: rawSQL });

    if (sqlError) {
      console.error("Error executing raw SQL:", sqlError);
      return new Response(JSON.stringify({ success: false, error: "Failed to delete user data" }), {
        status: 500,
      });
    }

    const { error: managerError } = await supabaseAdmin
      .from("manager")
      .delete()
      .eq("id", manager_id);

    if (managerError) {
      console.error("Error deleting manager row:", managerError);
      return new Response(JSON.stringify({ success: false, error: "Failed to delete manager" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, message: "User deleted successfully" }), {
      status: 200,
    });

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Something went wrong" }), {
      status: 500,
    });
  }
}
