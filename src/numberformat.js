function toCurrency(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function toNumber(value) {
  return Number(value.replace(/\./g, '').replace(',', '.'));
}
function toFormattedNumber(value) {
  return new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(value);
}

export { toCurrency, toNumber, toFormattedNumber }; 