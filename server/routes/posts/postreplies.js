const express = require('express');
const router = express.Router();
const  supabase  = require('../../utils/supabase');

router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // 2. Get the user's token from the Authorization header
        // (Adding auth check here for security and consistency)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided. Access denied.' });
        }

        // 3. Verify the token
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth Error:', authError);
            return res.status(401).json({ error: 'Invalid token. Access denied.' });
        }

        // 4. Fetch replies and JOIN user data for each reply
        const { data: replies, error } = await supabase
            .from('replies')
            .select(`
                *,
                users:user_id (
                    id,
                    full_name,
                    email
                )
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase error fetching replies:', error);
          throw error;
        }

        res.json(replies);
    } catch (error) {
        console.error('Error fetching post replies:', error);
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
});

module.exports = router;