import admin from '../config/firebaseAdmin.js';

const getIdTokenFromHeader = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authenticateFirebaseToken = async (req, res, next) => {
  const token = getIdTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized: Missing or invalid Authorization header',
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      claims: decodedToken,
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};
