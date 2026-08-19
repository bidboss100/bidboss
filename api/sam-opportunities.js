// Vercel serverless function — server-side proxy to the SAM.gov public
// Opportunities API (https://open.gsa.gov/api/get-opportunities-public-api/).
//
// Exists purely to avoid calling api.sam.gov directly from the browser
// (CORS is undocumented/unreliable for that endpoint) and so the user's
// API key never has to be embedded in a third-party cross-origin request.
// This function does not store the key anywhere — it's forwarded straight
// through from the query string on each request.

const SAM_BASE_URL = 'https://api.sam.gov/opportunities/v2/search'

// Only these are ever forwarded to SAM.gov — keeps this from becoming an
// open proxy to an arbitrary host/path.
const PASSTHROUGH_PARAMS = [
  'ncode', 'postedFrom', 'postedTo', 'limit', 'offset',
  'status', 'title', 'state', 'typeOfSetAside', 'ptype',
]

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  const { apiKey, ...rest } = req.query

  if (!apiKey || typeof apiKey !== 'string') {
    res.status(400).json({ ok: false, message: 'Missing apiKey query parameter.' })
    return
  }

  const outbound = new URL(SAM_BASE_URL)
  outbound.searchParams.set('api_key', apiKey)
  for (const key of PASSTHROUGH_PARAMS) {
    const val = rest[key]
    if (val !== undefined && val !== '') outbound.searchParams.set(key, val)
  }

  try {
    const samRes = await fetch(outbound.toString())
    const text = await samRes.text()
    let body
    try {
      body = JSON.parse(text)
    } catch {
      body = { raw: text }
    }

    if (!samRes.ok) {
      res.status(samRes.status).json({
        ok: false,
        status: samRes.status,
        message: body?.message || body?.error || `SAM.gov returned ${samRes.status}`,
      })
      return
    }

    res.status(200).json({ ok: true, ...body })
  } catch (err) {
    res.status(502).json({ ok: false, message: `Failed to reach SAM.gov: ${err.message}` })
  }
}
