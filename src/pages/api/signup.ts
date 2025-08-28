import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { hashPassword } from '../../lib/password'
import { signupSchema } from '../../lib/validation'
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Registration failed
 */






export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const validatedData = signupSchema.parse(req.body)
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password)
    
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        type: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      type: user.type
    })

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    })
  } catch (error: any) {
    res.status(400).json({ 
      error: error.message || 'Registration failed' 
    })
  }
}