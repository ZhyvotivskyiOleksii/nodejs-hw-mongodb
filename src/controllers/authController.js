import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

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
