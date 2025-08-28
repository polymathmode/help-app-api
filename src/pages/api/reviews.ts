import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'
import { reviewSchema } from '../../lib/validation'
import { authenticateUser, authenticateUserFromPages } from '../../lib/auth'



/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review for a completed service
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *             properties:
 *               bookingId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       403:
 *         description: Only clients can create reviews
 *       400:
 *         description: Can only review completed bookings
 */






export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await authenticateUserFromPages(req as any)
    
    if (user.type !== 'CLIENT') {
      return res.status(403).json({ error: 'Only clients can create reviews' })
    }

    const validatedData = reviewSchema.parse(req.body)

    // Verify booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: validatedData.bookingId },
      include: { review: true }
    })

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.clientId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to review this booking' })
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed bookings' })
    }

    if (booking.review) {
      return res.status(400).json({ error: 'Booking already reviewed' })
    }

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: user.id
      },
      include: {
        booking: {
          include: { service: true }
        }
      }
    })

    res.status(201).json({
      message: 'Review created successfully',
      review
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Review creation failed' })
  }
}