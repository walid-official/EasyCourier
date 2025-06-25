import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { User } from '../models/User';

// ✅ Explicitly return type as Promise<void> or Promise<Response>
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, skills } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, skills });

    const token = generateToken((user._id as unknown as string).toString());
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

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

    const token = generateToken((user._id as unknown as string).toString());
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};
