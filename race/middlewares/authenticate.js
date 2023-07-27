import { CognitoJwtVerifier } from 'aws-jwt-verify';
import 'dotenv/config';

export const authenticate = async (req, res, next) => {
  const idToken = req.session.idToken;

  if (!idToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {

    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
      tokenUse: 'id',
      clientId: process.env.IDP_CLIENT_ID,
    });

    const payload = await verifier.verify(idToken);

    // Store the decoded token in the request object for further route handling
    req.user = payload;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying access token:', error);
    return res.status(401).json({ error: 'Invalid access token' });
  }
};