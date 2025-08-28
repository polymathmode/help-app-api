import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUser } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'




/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all available services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Create a new service (Admin only)
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - basePrice
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               basePrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created successfully
 *       403:
 *         description: Admin access required
 */





export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authUser = await authenticateUser(req as any)
    
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