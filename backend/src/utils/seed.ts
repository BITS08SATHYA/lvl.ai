import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';


dotenv.config();

const users = [
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        xp: 1500,
        level: 15,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    },
    {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
        xp: 1200,
        level: 12,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    },
    {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        password: 'password123',
        xp: 900,
        level: 9,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    },
    {
        name: 'Diana Evans',
        email: 'diana@example.com',
        password: 'password123',
        xp: 600,
        level: 6,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    },
    {
        name: 'Evan Foster',
        email: 'evan@example.com',
        password: 'password123',
        xp: 300,
        level: 3,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    },
    {
        name: 'Frank Green',
        email: 'frank@example.com',
        password: 'password123',
        xp: 100,
        level: 1,
        preferences: { timezone: 'UTC', dailyGoalXP: 100 }
    }
];

const seedUsers = async () => {
    try {
        const mongoUri = process.env['MONGO_URI'] || 'mongodb://localhost:27017/lvl-ai';
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected');

        for (const user of users) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(`User ${user.email} already exists. Updating XP/Level...`);
                existingUser.xp = user.xp;
                existingUser.level = user.level;
                await existingUser.save();
            } else {
                console.log(`Creating user ${user.email}...`);
                // Password hashing is handled by pre-save hook in User model, 
                // but we can manually hash if needed. 
                // Assuming the User model handles it or we pass plain text if the model expects it.
                // Let's check if we need to hash it manually. Usually seed scripts might need to.
                // But for safety, let's rely on the model or hash it here if we are bypassing the model logic.
                // Actually, let's just create it using User.create which triggers hooks.
                await User.create(user);
            }
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();
