// src/middlewares/authenticate.js

import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/Session.js';
import { UsersCollection } from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw createHttpError(401, 'Please provide Authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    const session = await SessionsCollection.findOne({ accessToken: token });

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);
    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }
    if (!session) {
      throw createHttpError(401, 'Invalid session');
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
