export function cpfMask(value: string) {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Hífen
}
