import { FreightType } from 'src/enums/FreightType';

export type FreightInput = {
    allItemsFreeFreight: boolean;
    cep: string;
    localPrefix?: string;
    localRate?: number;
    standardRate?: number;
};

export type FreightResult = {
    amount: number;
    type: FreightType;
};

// ponytail: prefix match only; ViaCEP if city-level accuracy needed
export function computeFreight(input: FreightInput): FreightResult {
    if (input.allItemsFreeFreight) {
        return { amount: 0, type: FreightType.Free };
    }

    const digits = input.cep.replace(/\D/g, '');
    const prefix = (input.localPrefix ?? '').replace(/\D/g, '');
    const isLocal = Boolean(prefix) && digits.startsWith(prefix);

    if (isLocal) {
        return {
            amount: Number(input.localRate ?? 0),
            type: FreightType.Local,
        };
    }

    return {
        amount: Number(input.standardRate ?? 0),
        type: FreightType.Standard,
    };
}
