const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase'); // Your updated import

router.get('/', async (req, res) => { // <-- 1. Removed /:userId from URL
    try {
        // 2. Get the user's token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided. Access denied.' });
        }

        // 3. Verify the token and get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return res.status(401).json({ error: 'Invalid token. Access denied.' });
        }

      
      const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    email
                ),
                replies (
                    *,
                    users:user_id (
                        id,
                        full_name,
                        email
                    )
                ),
                upvotes ( user_id )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        // 5. Filter out the user's own posts (using the *secure* ID from the token)
        const filteredPosts = posts.filter(post => post.user_id !== user.id);
        console.log('Sending posts:', JSON.stringify(posts, null, 2));
        res.json(posts);

    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

module.exports = router;