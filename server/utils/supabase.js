const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

let supabase = null;

if (!supabaseUrl || !anonKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables");
  throw new Error("Missing required Supabase configuration");
}

try {
  supabase = createClient(supabaseUrl, anonKey);
  console.log("Supabase client initialized successfully.");
} catch (error) {
  console.error("Error creating Supabase client:", error);
  throw error;
}

module.exports = supabase ;