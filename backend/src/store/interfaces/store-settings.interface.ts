export const DEFAULT_PAYMENT_METHODS = ['Pix', 'Dinheiro', 'Cartão'];

export interface StoreContactSettings {
    whatsapp?: string;
    whatsappMessage?: string;
    instagram?: string;
    paymentMethods?: string[];
}

export interface StoreShippingSettings {
    localPrefix?: string;
    localRate?: number;
    standardRate?: number;
    regions?: string;
}

export interface StoreThemeSettings {
    accentColor?: string;
    logoUrl?: string;
    heroImageUrl?: string;
}

export interface StoreProfileSettings {
    bio?: string;
    location?: string;
}

export interface StoreSettings {
    contact?: StoreContactSettings;
    shipping?: StoreShippingSettings;
    theme?: StoreThemeSettings;
    profile?: StoreProfileSettings;
    internal?: Record<string, unknown>;
}

export type StorePublicSettings = Pick<
    StoreSettings,
    'contact' | 'shipping' | 'theme' | 'profile'
>;
