export function productTypeLabel(name?: string | null): string {
  return name?.trim() || 'Produto';
}

export function kitNameFromQuantity(quantity: number): string {
  return `Kit ${quantity} Ímãs`;
}
