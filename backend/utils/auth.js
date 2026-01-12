import jwt from 'jsonwebtoken';

export function getUserIdFromToken(authHeader) {
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    return decoded.sub || decoded.user_id || decoded.sid;  // Adjust based on your token
  } catch {
    return null;
  }
}