import { admin } from '../../lib/firebaseAdmin';

export default async function handler(req,res){
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ','');
  if(!token) return res.status(401).json({error:'missing token'});
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return res.json({ uid: decoded.uid, claims: decoded });
  } catch(e){
    return res.status(403).json({ error: String(e) });
  }
}
