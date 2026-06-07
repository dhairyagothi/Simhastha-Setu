import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import express from 'express'

const router = express.Router()

// ── Hardcoded demo users (replace with DB in prod) ────────────────────────────
const DEMO_USERS = [
  { id: 'u1', email: 'pilgrim@kumbh.in',  password: 'demo123', role: 'pilgrim',  name: 'Pilgrim User',   zone: null },
  { id: 'u2', email: 'control@kumbh.in',  password: 'demo123', role: 'control',  name: 'Control Room',   zone: 'all' },
  { id: 'u3', email: 'police@kumbh.in',   password: 'demo123', role: 'police',   name: 'Police SHO',     zone: 'Ram Ghat North' },
  { id: 'u4', email: 'medical@kumbh.in',  password: 'demo123', role: 'medical',  name: 'Medical Team B', zone: 'Mahakal Corridor' },
  { id: 'u5', email: 'fire@kumbh.in',     password: 'demo123', role: 'fire',     name: 'Fire Station 2', zone: 'Triveni Ghat' },
  { id: 'u6', email: 'ndrf@kumbh.in',     password: 'demo123', role: 'ndrf',     name: 'NDRF Alpha',     zone: 'Ram Ghat South' },
]

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = DEMO_USERS.find(u => u.email === email.toLowerCase())
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    // In prod: await bcrypt.compare(password, user.passwordHash)
    if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, zone: user.zone },
      process.env.JWT_SECRET || 'simhasthasetu-secret-2028',
      { expiresIn: '12h' }
    )

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, zone: user.zone }
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'Token required' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'simhasthasetu-secret-2028', { ignoreExpiration: true }) as any
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role, name: decoded.name, zone: decoded.zone },
      process.env.JWT_SECRET || 'simhasthasetu-secret-2028',
      { expiresIn: '12h' }
    )
    res.json({ token: newToken })
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router

// ── Middleware exported separately ────────────────────────────────────────────

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access token required' })

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'simhasthasetu-secret-2028')
    req.user = user
    next()
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

export function requireRole(roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` })
    }
    next()
  }
}