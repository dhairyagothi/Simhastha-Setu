import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { requireRole } from '../middleware/auth.js'
import { transcribeAudio } from '../services/whisperService.js'
import { sendSMS } from '../services/smsService.js'
import Incident from '../models/Incident.js'

const router = express.Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST /api/ai/classify — classify a text/voice incident report
// Used by: pilgrim web form, IVR call handler
router.post('/classify', async (req, res) => {
  try {
    const { text, lang = 'hi', phone } = req.body
    if (!text) return res.status(400).json({ error: 'text is required' })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are SimhasthaSetu AI, the emergency classification system for Simhastha 2028 Mela in Ujjain.

Classify this emergency report and respond ONLY in this exact JSON format:
{
  "type": "Medical|Fire|Missing|Crowd Crush|Security|Drowning",
  "severity": "P1|P2|P3",
  "locationHint": "extracted location mention or null",
  "summaryEn": "one line English summary",
  "summaryHi": "एक पंक्ति हिन्दी सारांश",
  "summaryGu": "એક લીટી ગુજરાતી સારાંश",
  "paAnnouncementHi": "Hindi PA announcement text for Ram Ghat speakers, formal, under 2 sentences",
  "confidence": 0.0-1.0
}

Severity rules:
- P1: life-threatening, immediate danger, unconscious, fire spreading, drowning, stampede
- P2: injured, crowd building, missing child
- P3: minor injury, general assistance, information

Report: "${text}"
Detected language: ${lang}`
      }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('AI response parsing failed')

    const classification = JSON.parse(jsonMatch[0])
    const ticketId = `SS-${Date.now().toString().slice(-4)}`

    // If phone number provided (IVR call), send SMS confirmation
    if (phone) {
      await sendSMS(phone, `[SETU] Aapka ticket ${ticketId} register hua. ${classification.type} team bheja ja raha hai. SimhasthaSetu`)
    }

    res.json({ ...classification, ticketId })
  } catch (err) {
    console.error('[AI/classify]', err)
    res.status(500).json({ error: 'Classification failed' })
  }
})

// POST /api/ai/ivr-call — process an incoming 1916 call (Twilio webhook)
// Twilio posts call audio → transcribe → classify → dispatch
router.post('/ivr-call', async (req, res) => {
  try {
    const { CallSid, RecordingUrl, From, Language } = req.body

    // Step 1: Transcribe audio via Whisper
    const transcript = await transcribeAudio(RecordingUrl)
    console.log(`[IVR] Call ${CallSid} transcript: ${transcript}`)

    // Step 2: Classify via Claude
    const classifyRes = await fetch(`${process.env.API_URL}/api/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.INTERNAL_API_KEY}` },
      body: JSON.stringify({ text: transcript, lang: Language || 'hi', phone: From })
    })
    const classification = await classifyRes.json()

    // Step 3: Auto-create incident
    await Incident.create({
      ticketId: classification.ticketId,
      type: classification.type,
      severity: classification.severity,
      summary: classification.summaryEn,
      aiSummaryHindi: classification.summaryHi,
      location: classification.locationHint || 'Location from call — IVR',
      source: 'ivr',
      callSid: CallSid,
      callerPhone: From,
      status: 'Open',
      reportCount: 1,
      zone: 'Ram Ghat' // default until GPS available
    })

    // Step 4: Respond to Twilio with TwiML to read back in caller's language
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">
    Aapka ticket ${classification.ticketId} register ho gaya hai.
    ${classification.type} team ko bheja ja raha hai.
    Aapko SMS mein ticket number milega.
    SimhasthaSetu mein aapka dhanyavaad.
  </Say>
  <Hangup/>
</Response>`

    res.type('text/xml').send(twiml)
  } catch (err) {
    console.error('[IVR/call]', err)
    // Even on error — respond to Twilio or the call hangs
    res.type('text/xml').send(`
      <Response>
        <Say language="hi-IN">Kripya dobara call karein. Aapki samasya darj ki ja rahi hai.</Say>
      </Response>`)
  }
})

// POST /api/ai/deployment-plan — generate next-shift deployment recommendation
router.post('/deployment-plan', requireRole(['control']), async (req, res) => {
  try {
    const { incidents, units, date } = req.body

    const incidentSummary = (incidents || []).slice(0, 10)
      .map((i: any) => `${i.type} (${i.severity}) at ${i.location}`).join(', ')

    const activeUnits = (units || []).filter((u: any) => u.status !== 'Available').length
    const availableUnits = (units || []).filter((u: any) => u.status === 'Available').length

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are SimhasthaSetu AI for Simhastha 2028 Ujjain.

Current situation (${date || new Date().toLocaleDateString('en-IN')}):
- Active incidents: ${(incidents || []).length} | Types: ${incidentSummary || 'None currently'}
- Units deployed: ${activeUnits} | Available: ${availableUnits}
- Tomorrow: Shahi Snan (peak pilgrim day)

Simhastha 2016 historical patterns:
- Ram Ghat: Peak drowning + medical risk 4–9 AM (pre-dawn snan)
- Mahakal corridor: Stampede risk 9 AM–12 PM (narrow lanes, post-snan movement)  
- Triveni Ghat: Secondary medical risk all day
- Heat exhaustion peaks: 12–2 PM Mahakal walking route
- Missing persons peak: 10 AM–12 PM (crowd separation)
- Drowning incidents: 78% occur within 500m of Ram Ghat steps

Generate deployment plan with this exact structure:

**DEPLOYMENT PLAN — SHAHI SNAN ${date || new Date().toLocaleDateString('en-IN')}**

**🔴 High Risk Zones:**
(list 3 zones with specific risk and timing)

**📋 Unit Deployments (5 specific):**
| Unit | Location | Time | Reason |
(table format, 5 rows)

**⚡ Pre-emptive Actions (before 5 AM):**
(3 specific actions)

**📊 Risk Assessment:**
Overall Risk Level: RED/AMBER/GREEN
Confidence: X% based on 2016 Simhastha data
Expected P1 incidents: X–Y

Be specific to Ujjain geography. Reference actual ghat names and lane names.`
      }]
    })

    const plan = message.content[0].type === 'text' ? message.content[0].text : ''
    res.json({ plan, generatedAt: new Date().toISOString() })
  } catch (err) {
    console.error('[AI/deployment]', err)
    res.status(500).json({ error: 'Failed to generate deployment plan' })
  }
})

// POST /api/ai/sitrep — generate situation report for senior officials
router.post('/sitrep', requireRole(['control']), async (req, res) => {
  try {
    const { incidents, units, alerts } = req.body

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Generate a formal 5-line situation report for senior Simhastha 2028 officials.

Data: 
- Active incidents: ${(incidents || []).filter((i: any) => i.status !== 'Merged').length}
- P1 critical: ${(incidents || []).filter((i: any) => i.severity === 'P1').length}  
- Units deployed: ${(units || []).filter((u: any) => u.status !== 'Available').length} of ${(units || []).length}
- Alerts sent: ${(alerts || []).length}
- Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

Format:
SITUATION REPORT — SIMHASTHA 2028 · [TIME] IST
1. Current status
2. Active incidents summary  
3. Resource deployment status
4. Immediate concern or recommendation
5. Overall assessment: NORMAL / ELEVATED / CRITICAL

Keep it under 8 lines. Formal language.`
      }]
    })

    const sitrep = message.content[0].type === 'text' ? message.content[0].text : ''
    res.json({ sitrep, generatedAt: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: 'SitRep generation failed' })
  }
})

// POST /api/ai/pa-announcement — generate Hindi PA announcement
router.post('/pa-announcement', async (req, res) => {
  try {
    const { name, age, lastSeen, description, caseId } = req.body

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Generate a formal Hindi PA announcement for a missing person at Simhastha 2028 Ujjain Mela.

Details:
- Name: ${name}
- Age: ${age}
- Last seen: ${lastSeen}
- Description: ${description || 'Not provided'}
- Case ID: ${caseId}

Output ONLY the Hindi announcement text. 2-3 sentences. Formal tone. Include case ID. Direct people to nearest help center.
Start with: "सभी श्रद्धालुओं से निवेदन है..."`
      }]
    })

    const announcement = message.content[0].type === 'text' ? message.content[0].text : ''
    res.json({ announcement })
  } catch (err) {
    res.status(500).json({ error: 'Announcement generation failed' })
  }
})

export default router