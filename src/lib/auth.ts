// import { NextRequest } from 'next/server'
// import { verifyToken } from './jwt'
// import { prisma } from './prisma'

// export async function authenticateUser(request: NextRequest) {
//   try {
//     const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
//     if (!token) {
//       throw new Error('No token provided')
//     }

//     const payload = verifyToken(token)
//     const user = await prisma.user.findUnique({
//       where: { id: payload.userId },
//       select: { id: true, email: true, type: true, isAdmin: true }
//     })

//     if (!user) {
//       throw new Error('User not found')
//     }

//     return user
//   } catch (error) {
//     throw new Error('Invalid authentication')
//   }
// }

// export async function requireAdmin(request: NextRequest) {
//   const user = await authenticateUser(request)
//   if (!user.isAdmin) {
//     throw new Error('Admin access required')
//   }
//   return user
// }


import { NextRequest } from 'next/server'
import { NextApiRequest } from 'next'
import { verifyToken } from './jwt'
import { prisma } from './prisma'

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('No token provided')
    }

    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, type: true, isAdmin: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw new Error('Invalid authentication')
  }
}

// New function for Pages Router API routes
export async function authenticateUserFromPages(req: NextApiRequest) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      throw new Error('No token provided')
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      throw new Error('No token provided')
    }

    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, type: true, isAdmin: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw new Error('Invalid authentication')
  }
}

export async function requireAdmin(request: NextRequest) {
  const user = await authenticateUser(request)
  if (!user.isAdmin) {
    throw new Error('Admin access required')
  }
  return user
}

export async function requireAdminFromPages(req: NextApiRequest) {
  const user = await authenticateUserFromPages(req)
  if (!user.isAdmin) {
    throw new Error('Admin access required')
  }
  return user
}