import { io } from '../server.js'
import Incident from '../models/Incident.js'
import Unit from '../models/Unit.js'

// ── Config ────────────────────────────────────────────────────────────────────
const DEDUP_RADIUS_METERS = 200
const DEDUP_TIME_WINDOW_MS = 10 * 60 * 1000       // 10 minutes
const DEDUP_MIN_REPORTS = 3
const ESCALATION_THRESHOLD_MS = 3 * 60 * 1000     // 3 minutes unassigned P1
const SURGE_THRESHOLD_PERCENT = 80
const HEARTBEAT_TIMEOUT_MS = 5 * 60 * 1000        // 5 min agency offline
const CLUSTER_WINDOW_MS = 15 * 60 * 1000          // stampede precursor window

// Pre-generated crowd advisories (avoids Claude API call in the automation loop)
const SURGE_ADVISORIES: Record<string, string> = {
  'Ram Ghat': 'Ram Ghat क्षेत्र में भीड़ अधिक है। कृपया वैकल्पिक मार्ग Route 7-B से जाएं।',
  'Mahakal Corridor': 'महाकाल मार्ग पर प्रवेश अस्थायी रूप से सीमित है। कृपया 15 मिनट प्रतीक्षा करें।',
  'Triveni Ghat': 'त्रिवेणी घाट पर अत्यधिक भीड़ है। श्रद्धालु राम घाट का उपयोग करें।'
}

// ── Start all background jobs ─────────────────────────────────────────────────
export function startAutomationEngine() {
  console.log('[AUTO] Starting automation engine...')

  deduplicationJob()
  escalationJob()
  crowdSurgeJob()
  agencyHeartbeatJob()
  morningBriefingJob()
  clusterDetectionJob()

  console.log('[AUTO] All jobs running')
}

// ── JOB 1: Incident deduplication (every 60s) ─────────────────────────────────
// Scans open incidents, merges reports within DEDUP_RADIUS from same type
function deduplicationJob() {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - DEDUP_TIME_WINDOW_MS)
      const openIncidents = await Incident.find({
        status: 'Open',
        createdAt: { $gte: cutoff }
      }).sort({ createdAt: -1 })

      const processed = new Set<string>()

      for (const primary of openIncidents) {
        if (processed.has(primary.id)) continue

        const duplicates = openIncidents.filter(inc =>
          inc.id !== primary.id &&
          inc.type === primary.type &&
          !processed.has(inc.id) &&
          haversineDistance(primary.lat, primary.lng, inc.lat, inc.lng) < DEDUP_RADIUS_METERS
        )

        if (duplicates.length >= DEDUP_MIN_REPORTS - 1) {
          const dupIds = duplicates.map(d => d.id)
          const totalReports = 1 + duplicates.length

          // Bump severity if enough duplicates (crowd-sourced confirmation)
          const newSeverity = totalReports >= 5 && primary.severity === 'P2' ? 'P1'
            : totalReports >= 8 && primary.severity === 'P3' ? 'P2'
            : primary.severity

          await Incident.findByIdAndUpdate(primary.id, {
            reportCount: totalReports,
            severity: newSeverity,
            mergedReports: totalReports
          })
          await Incident.updateMany(
            { _id: { $in: dupIds } },
            { status: 'Merged', mergedInto: primary.id }
          )

          console.log(`[DEDUP] Merged ${totalReports} reports into ${primary.ticketId}`)
          io.to('control').emit('incident:deduped', {
            primaryId: primary.id,
            ticketId: primary.ticketId,
            mergedCount: totalReports,
            newSeverity,
            message: `⚠️ ${totalReports} reports merged — ${primary.type} at ${primary.location}`
          })

          dupIds.forEach(id => processed.add(id))
        }
        processed.add(primary.id)
      }
    } catch (err) {
      console.error('[AUTO/dedup]', err)
    }
  }, 60_000)
}

// ── JOB 2: P1 escalation (every 3 minutes) ───────────────────────────────────
// Any P1 unassigned for 3+ minutes gets escalated
function escalationJob() {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - ESCALATION_THRESHOLD_MS)
      const unassigned = await Incident.find({
        severity: 'P1',
        status: 'Open',
        createdAt: { $lte: cutoff }
      })

      for (const inc of unassigned) {
        const minutesWaiting = Math.floor((Date.now() - inc.createdAt.getTime()) / 60_000)
        console.log(`[ESCALATE] P1 ${inc.ticketId} unassigned for ${minutesWaiting} min`)

        io.to('control').emit('incident:escalated', {
          id: inc.id,
          ticketId: inc.ticketId,
          type: inc.type,
          location: inc.location,
          minutesWaiting,
          message: `🚨 P1 UNASSIGNED ${minutesWaiting}min — ${inc.type} at ${inc.location}`
        })
      }
    } catch (err) {
      console.error('[AUTO/escalation]', err)
    }
  }, 3 * 60_000)
}

// ── JOB 3: Crowd surge simulation (every 5 minutes) ──────────────────────────
// In production: reads from CCTV crowd density model output
// Here: simulates density using time-of-day patterns from 2016 data
function crowdSurgeJob() {
  setInterval(() => {
    try {
      const hour = new Date().getHours()
      const density = simulateDensity(hour)

      for (const [zone, pct] of Object.entries(density)) {
        if (pct >= SURGE_THRESHOLD_PERCENT) {
          console.log(`[SURGE] ${zone} at ${pct}% — ALERT`)
          io.to('control').emit('crowd:surge', {
            zone,
            percent: pct,
            threshold: SURGE_THRESHOLD_PERCENT,
            advisory: SURGE_ADVISORIES[zone] || `${zone} mein bheed adhik hai.`,
            timestamp: new Date().toISOString()
          })
        }
      }
    } catch (err) {
      console.error('[AUTO/surge]', err)
    }
  }, 5 * 60_000)
}

// ── JOB 4: Agency heartbeat monitor (every 30s) ───────────────────────────────
// If an agency's last ping is older than HEARTBEAT_TIMEOUT — mark offline
const agencyHeartbeats: Record<string, number> = {
  police: Date.now(), medical: Date.now(),
  fire: Date.now(), ndrf: Date.now()
}

export function pingAgency(agency: string) {
  agencyHeartbeats[agency] = Date.now()
}

function agencyHeartbeatJob() {
  setInterval(() => {
    for (const [agency, lastSeen] of Object.entries(agencyHeartbeats)) {
      const silent = Date.now() - lastSeen
      if (silent > HEARTBEAT_TIMEOUT_MS) {
        const minutesSilent = Math.floor(silent / 60_000)
        console.log(`[HEARTBEAT] ${agency} offline — last seen ${minutesSilent}m ago`)
        io.to('control').emit('agency:offline', {
          agency,
          minutesSilent,
          message: `⚠️ ${agency.toUpperCase()} terminal inactive — last seen ${minutesSilent}min ago`
        })
      }
    }
  }, 30_000)
}

// ── JOB 5: Morning briefing auto-generation (fires once at 5 AM) ──────────────
function morningBriefingJob() {
  const now = new Date()
  const fiveAM = new Date()
  fiveAM.setHours(5, 0, 0, 0)
  if (now > fiveAM) fiveAM.setDate(fiveAM.getDate() + 1) // schedule for tomorrow if already past

  const msUntil5AM = fiveAM.getTime() - now.getTime()
  console.log(`[BRIEFING] Morning briefing scheduled in ${Math.floor(msUntil5AM / 60_000)} minutes`)

  setTimeout(async () => {
    try {
      const [incidents, units] = await Promise.all([
        Incident.find({ status: { $ne: 'Merged' } }).limit(20),
        Unit.find({})
      ])

      // Call our own AI endpoint (internal)
      const res = await fetch(`${process.env.API_URL}/api/ai/deployment-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.INTERNAL_API_KEY}` },
        body: JSON.stringify({ incidents, units, date: new Date().toLocaleDateString('en-IN') })
      })
      const { plan } = await res.json()

      io.to('control').emit('briefing:morning', {
        plan,
        generatedAt: new Date().toISOString(),
        message: '📋 Auto-Generated Morning Briefing · 05:00 AM'
      })

      console.log('[BRIEFING] Morning briefing sent to control room')

      // Reschedule for next day
      morningBriefingJob()
    } catch (err) {
      console.error('[AUTO/briefing]', err)
    }
  }, msUntil5AM)
}

// ── JOB 6: Stampede precursor cluster detection (every 2 minutes) ─────────────
function clusterDetectionJob() {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - CLUSTER_WINDOW_MS)
      const recentCrowdCrush = await Incident.find({
        type: 'Crowd Crush',
        status: { $ne: 'Merged' },
        createdAt: { $gte: cutoff }
      })

      // Group by zone
      const byZone: Record<string, any[]> = {}
      for (const inc of recentCrowdCrush) {
        const zone = inc.zone || 'Unknown'
        byZone[zone] = byZone[zone] || []
        byZone[zone].push(inc)
      }

      for (const [zone, incs] of Object.entries(byZone)) {
        if (incs.length >= 3) {
          console.log(`[CLUSTER] Stampede precursor detected: ${zone} (${incs.length} crowd crush incidents)`)
          io.to('control').emit('incident:cluster', {
            zone,
            count: incs.length,
            type: 'Crowd Crush',
            severity: 'STAMPEDE_PRECURSOR',
            message: `🚨 ${incs.length} Crowd Crush incidents in ${zone} — 15 min. Possible stampede. Escalate to NDRF.`,
            incidentIds: incs.map(i => i.id)
          })
        }
      }
    } catch (err) {
      console.error('[AUTO/cluster]', err)
    }
  }, 2 * 60_000)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Haversine distance in meters
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Simulate crowd density based on time-of-day + Simhastha 2016 patterns
function simulateDensity(hour: number): Record<string, number> {
  const base: Record<string, number[]> = {
    'Ram Ghat':          [20, 30, 45, 60, 72, 82, 90, 95, 97, 88, 76, 65, 55, 48, 40, 38, 42, 55, 62, 55, 48, 38, 30, 22],
    'Mahakal Corridor':  [10, 15, 20, 28, 35, 48, 62, 74, 82, 95, 99, 88, 72, 58, 48, 40, 38, 42, 48, 42, 35, 28, 20, 14],
    'Triveni Ghat':      [8,  12, 18, 25, 32, 40, 50, 60, 68, 74, 70, 62, 52, 44, 38, 32, 30, 38, 50, 46, 38, 30, 22, 14],
  }
  const noise = () => Math.floor(Math.random() * 6) - 3
  return Object.fromEntries(
    Object.entries(base).map(([zone, hourly]) => [zone, Math.max(0, Math.min(100, hourly[hour] + noise()))]
  ))
}