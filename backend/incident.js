import express from 'express'
import { io } from '../server.js'
import { requireRole } from '../middleware/auth.js'
import Incident from '../models/Incident.js'

const router = express.Router()

// GET /api/incidents — all incidents (control room sees all, agency sees their zone)
router.get('/', async (req, res) => {
  try {
    const { role, zone } = req.user
    const filter = role === 'control' ? {} : { zone, status: { $ne: 'Merged' } }
    const incidents = await Incident.find(filter).sort({ createdAt: -1 }).limit(100)
    res.json({ incidents })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incidents' })
  }
})

// POST /api/incidents — create new incident (pilgrim portal)
router.post('/', async (req, res) => {
  try {
    const { type, severity, summary, location, lat, lng, lang, aiSummaryHindi, aiSummaryGujarati, source } = req.body

    const ticketId = `SS-${Date.now().toString().slice(-4)}`

    const incident = await Incident.create({
      ticketId,
      type,
      severity,
      summary,
      location,
      lat: lat || 23.1828,
      lng: lng || 75.7682,
      lang: lang || 'hi',
      aiSummaryHindi,
      aiSummaryGujarati,
      source: source || 'web', // 'web' | 'ivr' | 'manual'
      status: 'Open',
      reportCount: 1,
      reportedBy: req.user?.id || 'anonymous',
      zone: deriveZone(lat, lng)
    })

    // Push to all connected control room clients in real time
    io.to('control').emit('incident:new', incident)

    // If P1 — also push to all agency rooms
    if (severity === 'P1') {
      io.emit('incident:critical', {
        ticketId,
        type,
        location,
        message: `🚨 P1 Critical: ${type} at ${location}`
      })
    }

    res.status(201).json({ incident, ticketId })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create incident' })
  }
})

// PATCH /api/incidents/:id/assign — assign a unit (control room only)
router.patch('/:id/assign', requireRole(['control']), async (req, res) => {
  try {
    const { unitId } = req.body
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: 'Assigned', assignedUnit: unitId, assignedAt: new Date() },
      { new: true }
    )
    if (!incident) return res.status(404).json({ error: 'Incident not found' })

    io.emit('incident:assigned', { incidentId: req.params.id, unitId })
    res.json({ incident })
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign unit' })
  }
})

// PATCH /api/incidents/:id/status — update status (agency: on-scene, resolved)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['On Scene', 'Resolved', 'Assigned']
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === 'On Scene' && { onSceneAt: new Date() }),
        ...(status === 'Resolved' && { resolvedAt: new Date() })
      },
      { new: true }
    )

    io.to('control').emit('incident:statusUpdate', { id: req.params.id, status })
    res.json({ incident })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' })
  }
})

// POST /api/incidents/:id/merge — merge duplicate reports
router.post('/:id/merge', requireRole(['control']), async (req, res) => {
  try {
    const { duplicateIds } = req.body // array of incident IDs to merge into :id

    const merged = await Incident.findByIdAndUpdate(
      req.params.id,
      { $inc: { reportCount: duplicateIds.length } },
      { new: true }
    )

    await Incident.updateMany(
      { _id: { $in: duplicateIds } },
      { status: 'Merged', mergedInto: req.params.id }
    )

    io.to('control').emit('incident:merged', { primary: req.params.id, merged: duplicateIds })
    res.json({ merged, duplicatesMerged: duplicateIds.length })
  } catch (err) {
    res.status(500).json({ error: 'Merge failed' })
  }
})

// GET /api/incidents/stats — aggregate stats for dashboard
router.get('/stats', requireRole(['control']), async (req, res) => {
  try {
    const [total, p1, resolved, byType] = await Promise.all([
      Incident.countDocuments({ status: { $ne: 'Merged' } }),
      Incident.countDocuments({ severity: 'P1', status: { $nin: ['Resolved', 'Merged'] } }),
      Incident.countDocuments({ status: 'Resolved', resolvedAt: { $gte: new Date(Date.now() - 86400000) } }),
      Incident.aggregate([
        { $match: { status: { $ne: 'Merged' } } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ])
    res.json({ total, p1, resolved, byType })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function deriveZone(lat: number, lng: number): string {
  // Map lat/lng to known Ujjain ghat zones
  if (!lat || !lng) return 'Unknown'
  if (lat > 23.182 && lng > 75.768) return 'Ram Ghat North'
  if (lat > 23.180 && lng < 75.766) return 'Mahakal Corridor'
  if (lat < 23.181) return 'Triveni Ghat'
  return 'Ram Ghat South'
}

export default router