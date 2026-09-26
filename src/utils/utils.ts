export const formatCurrencyToVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0, // không có phần thập phân
  }).format(amount)
}
