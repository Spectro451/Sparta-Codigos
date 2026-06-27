const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

export function formatExcelDate(dateStr: string): string {
  const [, mes, dia] = dateStr.split('-')
  return `${parseInt(dia)} ${meses[parseInt(mes) - 1]}`
}
