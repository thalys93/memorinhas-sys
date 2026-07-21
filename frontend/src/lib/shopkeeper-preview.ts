const PREVIEW_KEY = 'shopkeeper-site-preview'

export function enableShopkeeperSitePreview() {
  sessionStorage.setItem(PREVIEW_KEY, '1')
}

export function clearShopkeeperSitePreview() {
  sessionStorage.removeItem(PREVIEW_KEY)
}

export function isShopkeeperSitePreview(): boolean {
  return sessionStorage.getItem(PREVIEW_KEY) === '1'
}
