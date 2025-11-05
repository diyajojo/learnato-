const express = require('express');
const router = express.Router();
const { supabase } = require('../../utils/supabase');



router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch posts with user information
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
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Failed to fetch user posts' });
    }
});

module.exports = router;