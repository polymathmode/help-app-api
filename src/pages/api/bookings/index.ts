import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { bookingSchema } from '../../../lib/validation'
import { authenticateUser } from '../../../lib/auth'



/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceId
 *               - scheduledAt
 *             properties:
 *               serviceId:
 *                 type: string
 *               providerId:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       403:
 *         description: Only clients can create bookings
 */






export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getUserBookings(req, res)
    case 'POST':
      return createBooking(req, res)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getUserBookings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authenticateUser(req as any)
    
    const bookings = await prisma.booking.findMany({
      where: user.type === 'CLIENT' 
        ? { clientId: user.id }
        : { providerId: user.id },
      include: {
        service: true,
        client: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        provider: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        review: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ bookings })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}

async function createBooking(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authenticateUser(req as any)
    
    if (user.type !== 'CLIENT') {
      return res.status(403).json({ error: 'Only clients can create bookings' })
    }

    const validatedData = bookingSchema.parse(req.body)
    
    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId }
    })
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }

    const booking = await prisma.booking.create({
      data: {
        clientId: user.id,
        ...validatedData,
        scheduledAt: new Date(validatedData.scheduledAt),
        totalAmount: service.basePrice
      },
      include: {
        service: true,
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Booking creation failed' })
  }
}