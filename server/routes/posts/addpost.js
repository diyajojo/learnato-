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

    // 3. Get post data from the request body
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // 4. Insert the new post into the 'posts' table
    // We use user.id from the *token* to ensure security
    const { data: newPost, error: insertError } = await supabase
      .from('posts')
      .insert([
        { 
          title: title, 
          content: content, 
          user_id: user.id // Securely set the user_id from the authenticated user
        }
      ])
      .select(`
        *,
        users:user_id (
            id,
            full_name,
            email
        )
      `)
      .single(); // Return the newly created post with user data

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    res.status(201).json({ message: 'Post created successfully', post: newPost });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;