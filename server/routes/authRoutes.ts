import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { JWT_SECRET, requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Fallback in-memory demo user if database connection is not active
const FALLBACK_USER = {
  id: 'user-default-1',
  name: 'Kulsum Travel Explorer',
  email: 'ukulsum2402@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  travelStyle: 'Adventure',
  interests: ['Nature', 'Trekking', 'Food', 'Waterfalls'],
  preferredSeasons: ['Winter & Peak Season (Oct – Feb)', 'Monsoon (June – Sept)'],
  budgetPreference: 'Moderate',
};

// Register
authRouter.post('/register', async (req, res): Promise<any> => {
  try {
    const { name, email, password, travelStyle, interests, budgetPreference } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      // Check if user already exists
      const existing = await query('SELECT id, email FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.',
        });
      }

      // Insert new user
      const avatarUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`;
      const insertQuery = `
        INSERT INTO users (
          name, email, password_hash, travel_style, budget_preference, preferred_interests, avatar_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, travel_style, budget_preference, preferred_interests, avatar_url, created_at;
      `;

      const result = await query(insertQuery, [
        name,
        email.toLowerCase().trim(),
        passwordHash,
        travelStyle || 'Relaxed',
        budgetPreference || 'Moderate',
        interests || ['Nature', 'Heritage', 'Food'],
        avatarUrl,
      ]);

      const dbUser = result.rows[0];
      const user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar_url,
        travelStyle: dbUser.travel_style,
        budgetPreference: dbUser.budget_preference,
        interests: dbUser.preferred_interests || [],
        preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
      };

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user,
      });
    } catch (dbErr: any) {
      console.warn('DB Register query failed, falling back to session mode:', dbErr.message);
      // Fallback response for offline database
      const fallback = {
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: FALLBACK_USER.avatar,
        travelStyle: travelStyle || 'Relaxed',
        budgetPreference: budgetPreference || 'Moderate',
        interests: interests || ['Nature', 'Trekking', 'Heritage'],
        preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
      };
      const token = jwt.sign(
        { id: fallback.id, email: fallback.email, name: fallback.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.status(201).json({
        success: true,
        message: 'Account registered (local session mode)',
        token,
        user: fallback,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
});

// Login
authRouter.post('/login', async (req, res): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    try {
      const result = await query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
        [email.trim()]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const dbUser = result.rows[0];
      const isMatch = await bcrypt.compare(password, dbUser.password_hash);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar_url,
        travelStyle: dbUser.travel_style,
        budgetPreference: dbUser.budget_preference,
        interests: dbUser.preferred_interests || [],
        preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
      };

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    } catch (dbErr: any) {
      console.warn('DB Login query failed, falling back to standard test login:', dbErr.message);
      const user = {
        ...FALLBACK_USER,
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Karnataka Traveler',
      };
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.json({
        success: true,
        message: 'Login successful (local session mode)',
        token,
        user,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
});

// Current User (/api/auth/me)
authRouter.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    try {
      const result = await query(
        'SELECT id, name, email, avatar_url, travel_style, budget_preference, preferred_interests FROM users WHERE id = $1',
        [userId]
      );
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          success: true,
          user: {
            id: row.id,
            name: row.name,
            email: row.email,
            avatar: row.avatar_url,
            travelStyle: row.travel_style,
            budgetPreference: row.budget_preference,
            interests: row.preferred_interests || [],
            preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
          },
        });
      }
    } catch (err: any) {
      console.warn('DB query in /me failed:', err.message);
    }

    return res.json({
      success: true,
      user: {
        ...FALLBACK_USER,
        id: req.user?.id || FALLBACK_USER.id,
        email: req.user?.email || FALLBACK_USER.email,
        name: req.user?.name || FALLBACK_USER.name,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile',
    });
  }
});

// Update Profile (/api/auth/profile)
authRouter.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { name, travelStyle, budgetPreference, interests, avatar } = req.body;

    try {
      const updateQuery = `
        UPDATE users
        SET name = COALESCE($1, name),
            travel_style = COALESCE($2, travel_style),
            budget_preference = COALESCE($3, budget_preference),
            preferred_interests = COALESCE($4, preferred_interests),
            avatar_url = COALESCE($5, avatar_url),
            updated_at = NOW()
        WHERE id = $6
        RETURNING id, name, email, avatar_url, travel_style, budget_preference, preferred_interests;
      `;

      const result = await query(updateQuery, [
        name,
        travelStyle,
        budgetPreference,
        interests,
        avatar,
        userId,
      ]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.json({
          success: true,
          message: 'Profile updated successfully',
          user: {
            id: row.id,
            name: row.name,
            email: row.email,
            avatar: row.avatar_url,
            travelStyle: row.travel_style,
            budgetPreference: row.budget_preference,
            interests: row.preferred_interests || [],
            preferredSeasons: ['Winter & Peak Season (Oct – Feb)'],
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('DB update in /profile failed:', dbErr.message);
    }

    return res.json({
      success: true,
      message: 'Profile updated (local session)',
      user: {
        ...FALLBACK_USER,
        name: name || FALLBACK_USER.name,
        travelStyle: travelStyle || FALLBACK_USER.travelStyle,
        budgetPreference: budgetPreference || FALLBACK_USER.budgetPreference,
        interests: interests || FALLBACK_USER.interests,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user profile',
    });
  }
});

// Logout
authRouter.post('/logout', (_req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});
