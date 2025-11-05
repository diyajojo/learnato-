const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase');

router.post('/', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        error: 'Email, password, and full name are required' 
      });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Store username in users table
    if (authData.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) {
        console.error('Error inserting user:', insertError);
        return res.status(201).json({ 
          message: 'User created successfully. Please check your email for verification.',
          userId: authData.user.id,
          warning: 'Additional user data could not be saved'
        });
      }

      return res.status(201).json({
        message: 'User created successfully. Please check your email for verification.',
        userId: authData.user.id
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error during signup' });
  }
});

module.exports = router;