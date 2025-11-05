const express = require('express');
const router = express.Router();
const  supabase  = require('../../utils/supabase');

router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const { data: replies, error } = await supabase
            .from('replies')
            .select(`
                *,
                users:user_id (
                    full_name
                )
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.json(replies);
    } catch (error) {
        console.error('Error fetching post replies:', error);
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
});

module.exports = router;