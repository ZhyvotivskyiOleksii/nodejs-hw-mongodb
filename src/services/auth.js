import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw createError(409, 'Електронна пошта у використанні');

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return { _id: user._id, name: user.name, email: user.email };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Невірна пошта або пароль');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError(401, 'Невірна пошта або пароль');

 
  const accessToken = jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

 
  await Session.deleteMany({ userId: user._id });


  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { user, accessToken, refreshToken, refreshExpires: 30 * 24 * 60 * 60 * 1000 };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) throw createError(401, 'Refresh token відсутній');
  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch {
    throw createError(401, 'Невірний refresh token');
  }
  const session = await Session.findOne({ refreshToken });
  if (!session) throw createError(401, 'Сесія не знайдена');


  await Session.deleteOne({ refreshToken });

  const newAccessToken = jwt.sign({ userId: payload.userId }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: payload.userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: payload.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken, refreshExpires: 30 * 24 * 60 * 60 * 1000 };
};

export const logoutUser = async (refreshToken) => {
  if (refreshToken) await Session.deleteOne({ refreshToken });
};
