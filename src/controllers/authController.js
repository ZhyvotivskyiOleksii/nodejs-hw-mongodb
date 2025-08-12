import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { sendMail } from '../utils/email.js';

const { JWT_SECRET, APP_DOMAIN } = process.env;

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { user, accessToken, refreshToken, refreshExpires } = await loginUser(req.body);
  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshExpires,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
};

export const refreshController = async (req, res) => {
  const { accessToken, refreshToken, refreshExpires } = await refreshSession(req.cookies.refreshToken);
  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshExpires,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

export const logoutController = async (req, res) => {
  await logoutUser(req.cookies.refreshToken);
  res.clearCookie('refreshToken').status(204).send();
};

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found!');
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN.replace(/\/$/, '')}/reset-password?token=${token}`;
  const html = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
  try {
    await sendMail({
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw createError(401, 'Token is expired or invalid.');
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createError(404, 'User not found!');
  user.password = password;
  await user.save();
  await Session.deleteMany({ userId: user._id });
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
