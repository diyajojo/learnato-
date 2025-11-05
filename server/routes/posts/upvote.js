const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase');

router.post('/', async (req, res) => {
  try {
    // 1. Get user from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // 2. Get post_id from request body
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ error: 'post_id is required' });
    }

    // 3. Check if user has already upvoted this post
    const { data: existingUpvote, error: checkError } = await supabase
      .from('upvotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', post_id)
      .maybeSingle(); // .maybeSingle() returns null if no row, instead of []

    if (checkError) {
      console.error('Check upvote error:', checkError);
      throw checkError;
    }

    let newUpvoteState;

    if (existingUpvote) {
      // 4a. Already upvoted: remove it (un-vote)
      const { error: deleteError } = await supabase
        .from('upvotes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', post_id);

      if (deleteError) {
        console.error('Delete upvote error:', deleteError);
        throw deleteError;
      }
      newUpvoteState = 'removed';

    } else {
      // 4b. Not upvoted: add it
      const { error: insertError } = await supabase
        .from('upvotes')
        .insert({ user_id: user.id, post_id: post_id });
        
      if (insertError) {
        console.error('Insert upvote error:', insertError);
        throw insertError;
      }
      newUpvoteState = 'added';
    }

    // 5. Return the new total list of upvotes for the post
    const { data: upvotes, error: upvoteDataError } = await supabase
        .from('upvotes')
        .select('user_id')
        .eq('post_id', post_id);

    if (upvoteDataError) {
      console.error('Fetch upvotes error:', upvoteDataError);
      throw upvoteDataError;
    }

    res.status(200).json({ 
        message: `Vote ${newUpvoteState}`, 
        upvotes: upvotes // Send back the new list
    });

  } catch (error) {
    console.error('Toggle Upvote Server Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;