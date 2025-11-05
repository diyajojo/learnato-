const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase');

router.post('/', async (req, res) => {
  try {
    // 1. Get the user's token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Access denied.' });
    }

    // 2. Verify the token and get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth Error:', authError);
      return res.status(401).json({ error: 'Invalid token. Access denied.' });
    }

    // 3. Get reply data from the request body
    const { content, post_id } = req.body;
    if (!content || !post_id) {
      return res.status(400).json({ error: 'Content and post_id are required' });
    }

    // 4. Insert the new reply into the 'replies' table
    const { data: newReply, error: insertError } = await supabase
      .from('replies')
      .insert([
        { 
          content: content, 
          post_id: post_id,
          user_id: user.id // Securely set the user_id from the authenticated user
        }
      ])
      .select(`
        *,
        users:user_id ( id, full_name, email )
      `)
      .single(); // Return the newly created reply with its author info

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json({ message: 'Reply created successfully', reply: newReply });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;