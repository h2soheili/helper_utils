/**
 *
 * @param s {string}
 * @returns {string}
 */
export function persianArabicToEnglish(s: string): string {
  if (!s) {
    return '';
  }
  return s
    .toString()
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}
// add functionality to base react native Text component for fix rtl issue   
export function englishToPersianDigitsConvert() {
  return (String.prototype.toPersianDigits = function() {
    let id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return this.replace(/[0-9]/g, function(w) {
      return id[+w];
    });
  });
}
