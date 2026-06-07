export async function classifyIncident(text: string, category?: string){
  const key = import.meta.env.VITE_CLAUDE_API_KEY
  if(!key){
    // Return a mocked response for demo if no key is set
    return {
      type: category || 'Medical',
      severity: 'P2',
      summary: text,
      hindi: 'हिन्दी अलर्ट (डेमो): मदद की आवश्यकता है',
      multilingual: {
        hi: 'हिन्दी अलर्ट (डेमो): मदद की आवश्यकता है',
        en: 'Demo alert: assistance required',
        gu: 'ડેમો એલર્ટ: મદદ જરૂરી છે'
      }
    }
  }

  // Minimal Claude call stub - replace with actual API call as needed.
  // WARNING: Calling model APIs from frontend exposes keys. For demo only.
  const payload = {
    model: 'claude-sonnet-4-20250514',
    input: `Classify this incident: ${text}. Category hint: ${category}`
  }

  const resp = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key
    },
    body: JSON.stringify(payload)
  })

  if(!resp.ok) return {type: category, severity: 'P3', summary: text, hindi: ''}
  const json = await resp.json()
  // This parsing depends on the model response shape; map accordingly.
  return {
    type: category || 'Medical',
    severity: 'P2',
    summary: text,
    hindi: json.completion || ''
  }
}
