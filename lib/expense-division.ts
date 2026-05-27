export type HouseholdMemberId = "david" | "manuela" | "sebastian" | "alexander"

export type HouseholdMember = {
  id: HouseholdMemberId
  name: string
  incomeCOP: number
  color: string
  initials: string
}

export const CASA_MARINILLA_MEMBERS: HouseholdMember[] = [
  { id: "david", name: "David", incomeCOP: 14_500_000, color: "#00FF66", initials: "DC" },
  { id: "manuela", name: "Manuela", incomeCOP: 5_000_000, color: "#00D4FF", initials: "MV" },
  { id: "sebastian", name: "Sebastián", incomeCOP: 3_500_000, color: "#8A2BE2", initials: "SR" },
  { id: "alexander", name: "Alexander", incomeCOP: 2_000_000, color: "#FFB020", initials: "AR" },
]

export type DivisionStrategy = "proportional" | "equal" | "custom"

export type SplitLine = {
  memberId: HouseholdMemberId
  name: string
  percent: number // 0..1
  amountCOP: number // integer COP
  color: string
  initials: string
}

export function formatCOP(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n)
}

/**
 * Ensures integer COP allocation sums exactly to totalCOP.
 * Uses "largest remainder method".
 */
export function allocateByWeights(totalCOP: number, weights: number[]) {
  if (totalCOP < 0) throw new Error("totalCOP must be >= 0")
  const wsum = weights.reduce((a, b) => a + b, 0)
  if (wsum <= 0) {
    // fallback: all zero
    return weights.map(() => 0)
  }

  const exact = weights.map((w) => (w / wsum) * totalCOP)
  const floored = exact.map((x) => Math.floor(x))
  let remainder = totalCOP - floored.reduce((a, b) => a + b, 0)

  // indices sorted by fractional part desc
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac)

  const out = [...floored]
  let k = 0
  while (remainder > 0) {
    out[order[k % order.length].i] += 1
    remainder -= 1
    k += 1
  }
  return out
}

export function computeSplitLines(params: {
  totalCOP: number
  members?: HouseholdMember[]
  strategy: DivisionStrategy
  customAmounts?: Partial<Record<HouseholdMemberId, number>>
}) {
  const members = params.members ?? CASA_MARINILLA_MEMBERS
  const totalCOP = Math.max(0, Math.round(params.totalCOP))

  if (params.strategy === "equal") {
    const amounts = allocateByWeights(totalCOP, members.map(() => 1))
    return members.map((m, idx) => ({
      memberId: m.id,
      name: m.name,
      percent: totalCOP === 0 ? 0 : amounts[idx] / totalCOP,
      amountCOP: amounts[idx],
      color: m.color,
      initials: m.initials,
    })) satisfies SplitLine[]
  }

  if (params.strategy === "proportional") {
    const weights = members.map((m) => m.incomeCOP)
    const amounts = allocateByWeights(totalCOP, weights)
    return members.map((m, idx) => ({
      memberId: m.id,
      name: m.name,
      percent: totalCOP === 0 ? 0 : amounts[idx] / totalCOP,
      amountCOP: amounts[idx],
      color: m.color,
      initials: m.initials,
    })) satisfies SplitLine[]
  }

  // custom
  const custom = params.customAmounts ?? {}
  const amounts = members.map((m) => Math.max(0, Math.round(custom[m.id] ?? 0)))
  const sum = amounts.reduce((a, b) => a + b, 0)

  return members.map((m, idx) => ({
    memberId: m.id,
    name: m.name,
    percent: totalCOP === 0 ? 0 : amounts[idx] / totalCOP,
    amountCOP: amounts[idx],
    color: m.color,
    initials: m.initials,
  })) satisfies SplitLine[]
}

export function validateCustomSplit(totalCOP: number, lines: SplitLine[]) {
  const total = Math.max(0, Math.round(totalCOP))
  const sum = lines.reduce((a, b) => a + b.amountCOP, 0)
  return {
    valid: sum === total,
    sum,
    diff: total - sum, // positive means missing, negative means over
  }
}