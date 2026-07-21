export function normalizeInstagramHandle(value?: string): string {
  if (!value) return ''
  return value.trim().replace(/^@/, '')
}

export function instagramProfileUrl(handle: string): string {
  return `https://instagram.com/${handle}`
}

export function instagramEmbedUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/embed`
}

export const DEFAULT_WHATSAPP_MESSAGE =
  'Olá! Gostaria de saber mais sobre os ímãs artesanais.'

export function whatsappUrl(digits: string, message?: string): string {
  const text = (message?.trim() || DEFAULT_WHATSAPP_MESSAGE).trim()
  const base = `https://wa.me/${digits}`
  if (!text) return base
  return `${base}?text=${encodeURIComponent(text)}`
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

export function stripBrazilCountryCode(value: string): string {
  const digits = digitsOnly(value)
  if (digits.startsWith('55') && digits.length >= 12) return digits.slice(2, 13)
  return digits.slice(0, 11)
}

export function formatBrazilPhone(value: string): string {
  const digits = stripBrazilCountryCode(value)
  if (!digits) return ''
  if (digits.length <= 2) return digits
  const ddd = digits.slice(0, 2)
  const rest = digits.slice(2)
  if (digits.length <= 6) return `${ddd} ${rest}`
  if (digits.length <= 10) return `${ddd} ${rest.slice(0, 4)}-${rest.slice(4)}`
  return `${ddd} ${rest.slice(0, 5)}-${rest.slice(5)}`
}

export function toBrazilWhatsappDigits(value: string): string {
  const local = stripBrazilCountryCode(value)
  if (!local) return ''
  return `55${local}`
}

export function isValidBrazilPhone(value: string): boolean {
  const local = stripBrazilCountryCode(value)
  return /^\d{10,11}$/.test(local)
}
