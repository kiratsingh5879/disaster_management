import geolib from 'geolib'

export function distanceKm(a, b) {
  // a,b: [lon, lat]
  const dist = geolib.getDistance(
    { latitude: a[1], longitude: a[0] },
    { latitude: b[1], longitude: b[0] }
  )
  return dist / 1000
}

const categoryToSkills = {
  medical: ['medical', 'first_aid', 'paramedic'],
  fire: ['fire', 'rescue'],
  flood: ['rescue', 'boat', 'logistics'],
  blocked_road: ['logistics', 'clearance'],
  other: []
}

export function calculateMatch(volunteer, report) {
  const vLoc = volunteer.location?.coordinates
  const rLoc = report.location?.coordinates
  const distance = vLoc && rLoc ? distanceKm(vLoc, rLoc) : 999
  const distanceScore = Math.max(0, 1 - distance / 20)
  const needed = categoryToSkills[report.category] || []
  const skillScore = volunteer.skills?.some(s => needed.includes(s)) ? 1 : 0
  const availability = volunteer.available ? 1 : 0
  return 0.4 * distanceScore + 0.4 * skillScore + 0.2 * availability
}
