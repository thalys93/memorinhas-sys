import { normalizeCityKey } from './geocode-city'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

assert(normalizeCityKey('  Porto Alegre ') === 'porto alegre', 'trim + lower')
assert(normalizeCityKey('Gravataí') === 'gravataí', 'accents kept')
assert(normalizeCityKey('') === '', 'empty')
assert(normalizeCityKey('   ') === '', 'whitespace only')

console.log('geocode-city: ok')
