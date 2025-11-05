const express = require('express');
const router = express.Router();
const { supabase } = require('../../utils/supabase');



router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all posts with user information
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                *,
                users (
                    id,
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        // Filter out the user's own posts on the server side
        const filteredPosts = posts.filter(post => post.user_id !== userId);
        res.json(filteredPosts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

module.exports = router;