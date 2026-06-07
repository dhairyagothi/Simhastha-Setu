import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import incidentRoutes from './routes/incidents.js'
import unitRoutes from './routes/units.js'
import alertRoutes from './routes/alerts.js'
import authRoutes from './routes/auth.js'
import aiRoutes from './routes/ai.js'
import missingRoutes from './routes/missing.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authenticateToken } from './middleware/auth.js'
import { startAutomationEngine } from './services/automationEngine.js'
import { connectDB } from './config/database.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// ── Socket.IO (real-time sync between all portals) ────────────────────────────
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`)

  socket.on('join:room', (room) => {
    socket.join(room) // rooms: 'control', 'police', 'medical', 'fire', 'ndrf'
    console.log(`[WS] ${socket.id} joined room: ${room}`)
  })

  socket.on('incident:update', (data) => {
    io.to('control').emit('incident:updated', data)
  })

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`)
  })
})

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' })) // 10mb for photo uploads (base64)
app.use(morgan('dev'))

// Rate limiting — 100 requests per 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' }
}))

// ── Health check (no auth) ────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SimhasthaSetu API',
    version: '1.0.0',
    event: 'Simhastha 2028',
    location: 'Ujjain, Madhya Pradesh',
    timestamp: new Date().toISOString()
  })
})

// ── Public routes (no auth required) ─────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Protected routes ──────────────────────────────────────────────────────────
app.use('/api/incidents', authenticateToken, incidentRoutes)
app.use('/api/units', authenticateToken, unitRoutes)
app.use('/api/alerts', authenticateToken, alertRoutes)
app.use('/api/ai', authenticateToken, aiRoutes)
app.use('/api/missing', authenticateToken, missingRoutes)

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler)

// ── Boot ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001

async function boot() {
  try {
    await connectDB()
    console.log('[DB] MongoDB connected')

    startAutomationEngine()
    console.log('[AUTO] Automation engine started')

    httpServer.listen(PORT, () => {
      console.log(`\n🔱 SimhasthaSetu API running on port ${PORT}`)
      console.log(`   Event: Simhastha 2028 · Ujjain`)
      console.log(`   Docs:  http://localhost:${PORT}/health\n`)
    })
  } catch (err) {
    console.error('[BOOT] Fatal error:', err)
    process.exit(1)
  }
}

boot()