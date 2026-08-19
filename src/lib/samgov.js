// Client for the live SAM.gov Opportunities feed. Calls our own
// /api/sam-opportunities serverless proxy (see /api/sam-opportunities.js)
// rather than api.sam.gov directly.

const SET_ASIDE_MAP = {
  SBA: 'SB', SBP: 'SB',
  '8A': '8(a)', '8AN': '8(a)',
  SDVOSBC: 'SDVOSB', SDVOSBS: 'SDVOSB',
  WOSB: 'WOSB', WOSBSS: 'WOSB', EDWOSB: 'WOSB', EDWOSBSS: 'WOSB',
  HZC: 'HUBZone', HZS: 'HUBZone',
  VSA: 'VOSB', VSS: 'VOSB',
}

function toMMDDYYYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${mm}/${dd}/${date.getFullYear()}`
}

function mapNotice(notice, naicsTitleLookup) {
  const agencyParts = (notice.fullParentPathName || '').split('.').filter(Boolean)
  const naicsCode = notice.naicsCode || ''
  return {
    id: `sam-${notice.noticeId}`,
    solicitation: notice.solicitationNumber || notice.noticeId,
    title: notice.title || 'Untitled Opportunity',
    agency: agencyParts[0] || notice.fullParentPathName || 'Unknown Agency',
    office: agencyParts[agencyParts.length - 1] || notice.fullParentPathName || '',
    naics: naicsCode,
    naicsTitle: naicsTitleLookup?.[naicsCode] || '',
    setAside: SET_ASIDE_MAP[notice.typeOfSetAside] || notice.typeOfSetAsideDescription || null,
    value: notice.award?.amount ? Number(notice.award.amount) : null,
    type: notice.type || notice.baseType || 'Notice',
    postedDate: (notice.postedDate || '').slice(0, 10),
    dueDate: notice.responseDeadLine ? notice.responseDeadLine.slice(0, 10) : null,
    location: notice.placeOfPerformance?.city?.name
      ? `${notice.placeOfPerformance.city.name}, ${notice.placeOfPerformance.state?.code || ''}`.trim()
      : (notice.placeOfPerformance?.state?.name || 'Not specified'),
    aiScore: null,
    status: notice.active === 'Yes' ? 'Open' : 'Closed',
    description: 'View full solicitation details and attachments on SAM.gov.',
    stage: 'Identified',
    source: 'Federal',
    live: true,
    samUrl: notice.uiLink || `https://sam.gov/opp/${notice.noticeId}/view`,
  }
}

/**
 * Fetches live opportunities for a single NAICS code via our serverless proxy.
 * Throws on network/HTTP failure; caller decides how to surface it.
 */
async function fetchForNaics({ apiKey, naicsCode, postedFrom, postedTo, limit = 25 }) {
  const params = new URLSearchParams({
    apiKey,
    ncode: naicsCode,
    postedFrom,
    postedTo,
    limit: String(limit),
    status: 'active',
  })
  const res = await fetch(`/api/sam-opportunities?${params.toString()}`)
  const body = await res.json().catch(() => null)

  if (!res.ok || !body?.ok) {
    const message = body?.message || `Request failed (${res.status})`
    const err = new Error(message)
    err.status = body?.status || res.status
    throw err
  }
  return body.opportunitiesData || []
}

/**
 * Fetches live SAM.gov opportunities across a list of NAICS codes and
 * returns them mapped into this app's internal opportunity shape,
 * de-duplicated by notice ID. Looks back `daysBack` days (max ~360, SAM
 * enforces a 1-year max posted-date window).
 */
export async function syncSamOpportunities({ apiKey, naicsCodes, naicsTitleLookup, daysBack = 90 }) {
  if (!apiKey) throw new Error('No SAM.gov API key configured.')
  if (!naicsCodes?.length) throw new Error('No NAICS codes configured in Settings.')

  const today = new Date()
  const from = new Date(today)
  from.setDate(from.getDate() - daysBack)
  const postedFrom = toMMDDYYYY(from)
  const postedTo = toMMDDYYYY(today)

  const seen = new Map()
  const perCodeErrors = []

  for (const naicsCode of naicsCodes) {
    try {
      const notices = await fetchForNaics({ apiKey, naicsCode, postedFrom, postedTo })
      for (const notice of notices) {
        if (!seen.has(notice.noticeId)) {
          seen.set(notice.noticeId, mapNotice(notice, naicsTitleLookup))
        }
      }
    } catch (err) {
      perCodeErrors.push({ naicsCode, message: err.message, status: err.status })
    }
    // Brief pacing between calls — polite to SAM.gov's rate limits.
    await new Promise(r => setTimeout(r, 250))
  }

  const opportunities = Array.from(seen.values()).sort((a, b) => (b.postedDate || '').localeCompare(a.postedDate || ''))

  // If every single NAICS lookup failed, treat it as a hard failure so the
  // caller can show one clear error instead of an empty "0 results" state.
  if (opportunities.length === 0 && perCodeErrors.length === naicsCodes.length) {
    const first = perCodeErrors[0]
    const err = new Error(first.message)
    err.status = first.status
    err.perCodeErrors = perCodeErrors
    throw err
  }

  return { opportunities, errors: perCodeErrors }
}
