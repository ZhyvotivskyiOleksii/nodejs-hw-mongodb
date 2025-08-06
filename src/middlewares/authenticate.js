import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) return next(createError(401, 'No access token provided'));

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);
    const session = await Session.findOne({ accessToken: token });
    if (!session) throw createError(401, 'Сесія не знайдена або токен невалідний');

    const user = await User.findById(payload.userId);
    if (!user) throw createError(401, 'User not found');

    req.user = user;
    next();
  } catch (err) {
    next(createError(401, 'Access token is not valid or expired'));
  }
};
