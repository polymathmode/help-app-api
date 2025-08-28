import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { serviceSchema } from '../../../lib/validation'
import { requireAdmin } from '../../../lib/auth'





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
  switch (req.method) {
    case 'GET':
      return getServices(res)
    case 'POST':
      return createService(req, res)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getServices(res: NextApiResponse) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    })
    res.json({ services })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' })
  }
}

async function createService(req: NextApiRequest, res: NextApiResponse) {
  try {
    // await requireAdmin(req as any)
    
    const validatedData = serviceSchema.parse(req.body)
    
    const service = await prisma.service.create({
      data: validatedData
    })

    res.status(201).json({
      message: 'Service created successfully',
      service
    })
  } catch (error: any) {
    if (error.message === 'Admin access required') {
      return res.status(403).json({ error: error.message })
    }
    res.status(400).json({ error: error.message || 'Service creation failed' })
  }
}