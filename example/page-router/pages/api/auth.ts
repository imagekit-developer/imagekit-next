import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const token = req.query.token as string || crypto.randomUUID();
      const expire = req.query.expire as string || (Math.floor(Date.now() / 1000) + 2400).toString();
      const signature = crypto.createHmac('sha1', privateKey).update(token + expire).digest('hex');

      res.status(200).json({
        token: token,
        expire: expire,
        signature: signature
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
