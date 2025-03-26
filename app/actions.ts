"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const signInWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }  
};

export const inviteAdminWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const branch = formData.get("branch") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true
  })

  await supabase.auth.signInWithOtp({email: email});

  const profileData = await supabase
  .from('profiles')
  .upsert({ id: data.user?.id, user_role: "customer" })
  .select().single();

  
  const member = await supabase.from("member").insert({member_profile: profileData.data?.id, branch: branch, member_role: "admin"});
  console.log(profileData.data, member, data.user);
  

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }  
};


export const signUpInviteVednorAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};



export const inviteManagerWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const branch = formData.get("branch") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true
  })
  
  await supabase.auth.signInWithOtp({email: email});
  
  const member = await supabase.from("member").insert({member_profile: data.user?.id, branch: branch, member_role: "employee"});


  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }  
};


export const inviteVendorWithEmail = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true
  })

  const profile = await supabase.from("profiles").update({user_role: "vendor"}).eq("id", data.user?.id);
  const {error:optError} = await supabase.auth.signInWithOtp({email: email , options:{
    emailRedirectTo:`/invite-vendor`
  }});

  if(optError){
    return {success:false,error:error?.message}
  }
  return { success: true };

  
};



export const signInActionWithGoogle = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if(data.url) {
    return redirect(data.url);
  }
};

export const signInActionWithGitHub = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if(data.url) {
    return redirect(data.url);
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forget-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forget-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forget-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};



export const signInVendorExternal = async (formData: FormData) => {
  const username = formData.get("username") as string;
  const phonenumber = formData.get("phonenumber") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  // Sign in with Supabase
  const { data: userData, error:userError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (userError) {
    return encodedRedirect("error", "/sign-in", userError.message);
  }

  // Insert vendor data into externalvendor table
  const { data: updateData, error: updateError } = await supabase.from("externalvendor").insert([
    {
      email,
      phonenumber,
      username,
    },
  ]);

  if (updateError) {
    console.error("Failed to insert vendor:", updateError);
    return encodedRedirect("error", "/sign-in", updateError.message);
  }

  console.log("Vendor inserted:", updateData);

  return redirect("/dashboard/customer/vendorManagement");
};


export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
