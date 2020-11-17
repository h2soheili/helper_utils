export function separateCardNumberDigits(str: string) {
  if (str && typeof str === 'string' && str.length > 0) {
    let tempStr = str.match(/\d{4}/g);
    let b = tempStr.join('   ').toString();
    return b;
  }
  return '';
}
