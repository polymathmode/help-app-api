import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { authenticateUser } from '../../../lib/auth'
import { z } from 'zod'



/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Accept or reject a booking (Provider only)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       403:
 *         description: Only providers can update bookings
 *       404:
 *         description: Booking not found
 */






const updateBookingSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'])
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const user = await authenticateUser(req as any)
    const { id } = req.query
    
    if (user.type !== 'PROVIDER') {
      return res.status(403).json({ error: 'Only providers can update bookings' })
    }

    const { status } = updateBookingSchema.parse(req.body)

    const booking = await prisma.booking.findUnique({
      where: { id: id as string },
      include: { service: true }
    })

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    if (booking.providerId && booking.providerId !== user.id) {
      return res.status(403).json({ error: 'Not authorized to update this booking' })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: id as string },
      data: { 
        status,
        providerId: user.id,
        completedAt: status === 'ACCEPTED' ? undefined : null
      },
      include: {
        service: true,
        client: {
          select: { id: true, firstName: true, lastName: true }
        },
        provider: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    })

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Booking update failed' })
  }
}