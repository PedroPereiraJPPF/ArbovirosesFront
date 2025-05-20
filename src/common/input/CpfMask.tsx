export function cpfMask(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11); // remove não dígitos e limita a 11

  const parts = [];

  if (cleaned.length > 0) parts.push(cleaned.slice(0, 3));
  if (cleaned.length >= 4) parts.push(cleaned.slice(3, 6));
  if (cleaned.length >= 7) parts.push(cleaned.slice(6, 9));
  if (cleaned.length >= 10) parts.push(cleaned.slice(9, 11));

  if (cleaned.length <= 6) {
    return parts.join('.'); // apenas os pontos
  }

  return `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3] ?? ''}`;
}
