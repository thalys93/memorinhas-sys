import { parseStoreUf, standardFreightLabel } from './parse-store-uf'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

assert(parseStoreUf('Canoas, RS') === 'RS', 'UF from Canoas, RS')
assert(parseStoreUf('São Paulo, SP') === 'SP', 'UF from São Paulo, SP')
assert(parseStoreUf('sem uf') === null, 'no UF')
assert(standardFreightLabel('Canoas, RS') === 'Frete RS', 'label with UF')
assert(standardFreightLabel('') === 'Frete estadual', 'label fallback')

console.log('parse-store-uf: ok')
