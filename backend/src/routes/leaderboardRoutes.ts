import { Router, Request, Response, NextFunction } from 'express';
import User from '@/models/User';
import authenticate from '../middleware/auth';

const router = Router();

// @route   GET /api/leaderboard
// @desc    Get top 10 users by XP
// @access  Private
router.get('/', authenticate, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.find()
            .sort({ xp: -1 })
            .limit(10)
            .select('name avatar level xp');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
});

export default router;
