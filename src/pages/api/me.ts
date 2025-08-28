import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUser, authenticateUserFromPages } from '../../lib/auth'
import { prisma } from '../../lib/prisma'




/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     type:
 *                       type: string
 *       401:
 *         description: Unauthorized - invalid token
 */






export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authUser = await authenticateUserFromPages(req as any)
    
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({ user })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}