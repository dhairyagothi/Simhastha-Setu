type ClaudeOptions = {
  system?: string
  fallback: string
}

async function callClaude(prompt: string, options: ClaudeOptions){
  const key = import.meta.env.VITE_CLAUDE_API_KEY
  if(!key){
    await new Promise(resolve => setTimeout(resolve, 700))
    return options.fallback
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        temperature: 0.2,
        system: options.system,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if(!resp.ok) throw new Error(`Claude API ${resp.status}`)
    const json = await resp.json()
    return json.content?.map((block:any) => block.text || '').join('\n').trim() || options.fallback
  } catch (error) {
    console.warn('Claude request failed, using demo fallback', error)
    return options.fallback
  }
}

function inferType(text: string, category?: string){
  const lower = text.toLowerCase()
  if(lower.includes('fire') || lower.includes('flame')) return 'Fire'
  if(lower.includes('missing') || lower.includes('lost')) return 'Missing'
  if(lower.includes('crowd') || lower.includes('crush') || lower.includes('stampede')) return 'Crowd Crush'
  if(lower.includes('security') || lower.includes('fight') || lower.includes('police')) return 'Security'
  if(lower.includes('drown') || lower.includes('water')) return 'Drowning'
  if(lower.includes('fainted') || lower.includes('collapsed') || lower.includes('medical') || lower.includes('old man') || lower.includes('woman')) return 'Medical'
  return category || 'Medical'
}

function inferSeverity(type: string, text: string){
  const lower = text.toLowerCase()
  if(type === 'Crowd Crush' || lower.includes('collapsed') || lower.includes('fainted') || lower.includes('fire') || lower.includes('drown')) return 'P1'
  if(type === 'Missing' || type === 'Security') return 'P2'
  return 'P3'
}

export async function classifyIncident(text: string, category?: string){
  const fallbackType = inferType(text, category)
  const fallbackSeverity = inferSeverity(fallbackType, text)
  const fallback = JSON.stringify({
    type: fallbackType,
    severity: fallbackSeverity,
    summary: text || 'Assistance required near Ram Ghat Sector 4',
    hindi: `${fallbackSeverity} अलर्ट: ${fallbackType} घटना राम घाट सेक्टर 4 के पास। नजदीकी टीम तुरंत सहायता करे।`,
    english: `${fallbackSeverity} alert: ${fallbackType} incident near Ram Ghat Sector 4. Nearest team should respond immediately.`
  })

  const raw = await callClaude(
    `Classify this Simhastha 2028 incident report. Return only JSON with keys type, severity, summary, hindi, english. Type must be one of Medical, Crowd Crush, Fire, Missing, Security, Drowning. Severity must be P1, P2, or P3. Incident: "${text}". Category hint: ${category || 'none'}.`,
    { system: 'You are an emergency triage AI for SimhasthaSetu in Ujjain. Be concise and operational.', fallback }
  )

  try {
    const parsed = JSON.parse(raw.replace(/^```json|```$/g, '').trim())
    return {
      type: parsed.type || fallbackType,
      severity: parsed.severity || fallbackSeverity,
      summary: parsed.summary || text,
      hindi: parsed.hindi || JSON.parse(fallback).hindi,
      multilingual: {
        hi: parsed.hindi || JSON.parse(fallback).hindi,
        en: parsed.english || parsed.en || JSON.parse(fallback).english,
        gu: `${parsed.severity || fallbackSeverity} એલર્ટ: ${parsed.type || fallbackType} ઘટના રામ ઘાટ સેક્ટર 4 પાસે. નજીકની ટીમ તરત મદદ કરે.`
      }
    }
  } catch {
    const parsedFallback = JSON.parse(fallback)
    return {
      type: parsedFallback.type,
      severity: parsedFallback.severity,
      summary: parsedFallback.summary,
      hindi: parsedFallback.hindi,
      multilingual: {
        hi: parsedFallback.hindi,
        en: parsedFallback.english,
        gu: `${parsedFallback.severity} એલર્ટ: ${parsedFallback.type} ઘટના રામ ઘાટ સેક્ટર 4 પાસે. નજીકની ટીમ તરત મદદ કરે.`
      }
    }
  }
}

export async function generateDeploymentPlan(incidents: any[]){
  const fallback = [
    'Ambulance-2 | Ram Ghat Sector 4 | 06:00-09:00 | P1 medical cluster and Shahi Snan crowd peak.',
    'NDRF-Alpha | Ram Ghat south steps | 07:00-10:00 | Crowd crush precursor alerts need rapid extraction support.',
    'Police QRT-1 | Mahakal Corridor Gate 2 | 10:00-12:00 | Historical corridor peak requires lane control.',
    'FireTruck-1 | Triveni Ghat service lane | 06:30-09:30 | Keep fire access clear during dense morning ingress.'
  ].join('\n')

  return callClaude(
    `You are an emergency AI for Simhastha 2028 Ujjain. Based on these incidents: ${JSON.stringify(incidents.slice(0, 12))}. And historical data: Simhastha 2016 had peak crowds at Ram Ghat 6-9am on Shahi Snan days, Mahakal corridor peak 10am-12pm. Generate a deployment recommendation for tomorrow. Format every line exactly: Unit name | Location | Time | Reason. Keep it concise.`,
    { system: 'You write concise deployment recommendations for an emergency control room.', fallback }
  )
}

export async function generatePAAnnouncement(person: any){
  const fallback = `कृपया ध्यान दें। ${person.name}, उम्र ${person.age} वर्ष, अंतिम बार ${person.lastSeen} के पास देखे गए थे। जिसे भी जानकारी मिले, कृपया नजदीकी सहायता केंद्र या पुलिस बूथ से तुरंत संपर्क करें।`
  return callClaude(
    `Generate a Hindi PA announcement for a missing person: Name: ${person.name}, Age: ${person.age}, Last seen: ${person.lastSeen}, Description: ${person.description || 'No additional description'}. Keep it under 3 sentences. Output Hindi text only.`,
    { system: 'You create clear Hindi public-address announcements for Simhastha volunteers.', fallback }
  )
}
