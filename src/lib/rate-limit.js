const rateLimitMap = new Map()

export function checkRateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs

  let record = rateLimitMap.get(ip)
  if (!record) {
    record = { count: 0, startTime: now }
    rateLimitMap.set(ip, record)
  }

  if (record.startTime < windowStart) {
    record.count = 0
    record.startTime = now
  }

  record.count++

  if (record.count > limit) {
    return false
  }
  return true
}

export function getClientIp(req) {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         req.ip || 
         'unknown-ip'
}
