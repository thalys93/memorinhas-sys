export const appConfig = {
    name: process.env.APP_NAME ?? 'Memorinhas Core',
    apiTitle: process.env.API_TITLE ?? 'Memorinhas Core API',
    swaggerDescription:
        process.env.SWAGGER_DESCRIPTION ??
        'API documentation for Memorinhas Core',
    port: Number(process.env.PORT ?? 3000),
    apiVersion: process.env.API_VERSION ?? 'v0',
    frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    storeName: process.env.STORE_NAME ?? 'Memorinhas',
    storeBrandUrl: process.env.STORE_BRAND_URL ?? 'memorinhas',
    logoUrl:
        process.env.APP_LOGO_URL ??
        'https://res.cloudinary.com/dlz0kwel5/image/upload/v1784646694/logo_lwyqih.jpg',
};
