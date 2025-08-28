import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { verifyPassword } from '../../lib/password'
import { loginSchema } from '../../lib/validation'
import { signToken } from '../../lib/jwt'





/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - type
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CLIENT, PROVIDER]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 */



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      type: user.type
    })

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type
      },
      token
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Login failed' })
  }
}