const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase');

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get user details from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return res.status(200).json({
        message: 'Login successful but unable to fetch user details',
        session: data.session,
        user: data.user
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: {
        ...data.user,
        ...userData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

module.exports = router;