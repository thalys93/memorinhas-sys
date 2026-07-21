import { FreightType } from 'src/enums/FreightType';
import { computeFreight } from './freight';

describe('computeFreight', () => {
    it('returns free when all items have free freight', () => {
        expect(
            computeFreight({
                allItemsFreeFreight: true,
                cep: '92000000',
                localPrefix: '92',
                localRate: 5,
                standardRate: 15,
            }),
        ).toEqual({ amount: 0, type: FreightType.Free });
    });

    it('returns local rate when CEP matches prefix', () => {
        expect(
            computeFreight({
                allItemsFreeFreight: false,
                cep: '92.100-000',
                localPrefix: '92',
                localRate: 5,
                standardRate: 15,
            }),
        ).toEqual({ amount: 5, type: FreightType.Local });
    });

    it('returns standard rate when CEP does not match prefix', () => {
        expect(
            computeFreight({
                allItemsFreeFreight: false,
                cep: '90000000',
                localPrefix: '92',
                localRate: 5,
                standardRate: 15,
            }),
        ).toEqual({ amount: 15, type: FreightType.Standard });
    });
});
