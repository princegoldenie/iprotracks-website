import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://skukdktksiexhoutxkhh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdWtka3Rrc2lleGhvdXR4a2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxODkxNTYsImV4cCI6MjA5Mjc2NTE1Nn0.Rc_QuW3o1yOQsmIRHjbinM5puOcLPMBsmGcBEjai2NY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)