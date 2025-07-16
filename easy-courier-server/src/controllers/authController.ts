import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { User, IUser } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, avatar } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    const token = generateToken((user._id as string).toString(), user.email);
    res.status(201).json({ user, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken((user._id as string).toString(), user.email);
    res.status(200).json({ user, token });
  } catch (err: any) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get All Users (Admin)
export const getUserData = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (err: any) {
    res.status(500).json({ message: 'Users not found', error: err.message });
  }
};

// Get Logged-in User
export const getLoggedInUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const email = req.user?.email;
    if (!email) {
      res.status(400).json({ message: 'Email missing from token' });
      return;
    }

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};
