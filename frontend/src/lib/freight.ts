export type FreightType = 'local' | 'standard' | 'free'

export type FreightInput = {
  allItemsFreeFreight: boolean
  cep: string
  localPrefix?: string
  localRate?: number
  standardRate?: number
}

export type FreightResult = {
  amount: number
  type: FreightType
}

// ponytail: prefix match only; ViaCEP if city-level accuracy needed
export function computeFreight(input: FreightInput): FreightResult {
  if (input.allItemsFreeFreight) {
    return { amount: 0, type: 'free' }
  }

  const digits = input.cep.replace(/\D/g, '')
  const prefix = (input.localPrefix ?? '').replace(/\D/g, '')
  const isLocal = Boolean(prefix) && digits.startsWith(prefix)

  if (isLocal) {
    return { amount: Number(input.localRate ?? 0), type: 'local' }
  }

  return { amount: Number(input.standardRate ?? 0), type: 'standard' }
}

export function digitsOnlyCep(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatCep(value: string) {
  const digits = digitsOnlyCep(value)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function formatMoney(value: number) {
  return value.toFixed(2).replace('.', ',')
}
