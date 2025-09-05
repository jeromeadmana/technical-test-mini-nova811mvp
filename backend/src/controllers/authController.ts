import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { username },
    relations: ["role"],
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role.name },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role.name }
  });
};
