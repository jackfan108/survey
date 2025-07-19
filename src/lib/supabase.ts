import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zcpesmtxvbvkzzmuzids.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcGVzbXR4dmJ2a3p6bXV6aWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDE2ODQsImV4cCI6MjA2ODQ3NzY4NH0.OrGU9fnCnaRQaQArMLbtwBo9redy0IJzkK0izv7MNLg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)