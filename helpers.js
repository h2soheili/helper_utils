export function priceDigitSeperator(price = '', round = true) {
  if (price) {
    if (round === true) {
      return Math.ceil(parseFloat(price))
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
}
export function IBANSpaces(str = '', after = 4) {
  if (!str) {
    return str;
  }
  if (str.length <= 2) {
    return str;
  }
  let v = str.replace(/[^\dA-Z]/g, ''),
    reg = new RegExp('.{' + after + '}', 'g');
  return v.replace(reg, function(a) {
    return a + ' ';
  });
  // n () { //Keylistener HTML: <input type="text" class="input-iban">
  // let val = str.replace(new RegExp(' ', 'g'), ''); //remove spaces
  // let val_chars = val.split(''); //split chars
  // val = ''; //new value
  // let count = 1;
  // for (let index in val_chars) {
  //   if (count <= 2) {
  //     //first 2 alphabetical chars
  //     val_chars[index] = val_chars[index].toUpperCase(); //uppercase, example: dE => DE
  //     if (val_chars[index].search(/^[A-Z]+$/) == -1) {
  //       //search für A-Z
  //       break; //if not found (error)
  //     }
  //   } else {
  //     if (val_chars[index].search(/^[0-9]+$/) == -1) {
  //       //search for 0-9
  //       continue; //if not found (error)
  //     }
  //   }
  //   val += val_chars[index]; // add char to return Value
  //   if (count % 4 == 0) {
  //     //Avery 4 chars an space
  //     val += ' ';
  //   }
  //   count++;
  // }
  // return val;
}
export function removeStringSpaces(iban) {
  if (iban && typeof iban === 'string') {
    return iban.replace(/\s/g, '');
  } else if (iban) {
    return iban.toString();
  }
  return iban;
}
export function IBANLength(iban) {
  if (iban !== null) {
    return removeStringSpaces(iban).length;
  }
  return 0;
}

/**
 *  extract otp code form string
 * @param str
 * @returns {String|string}
 */
export function extractNumberFromString(str: string) {
  if (str && typeof str === 'string') {
    if (str.includes(':')) {
      return parseInt(str.split(':')[1]) + '';
    }
    return ((str.match(/\d+/g) || []).map(n => parseInt(n)) + '').slice(0, 6);
  }
  return str;
}
export function returnOnlyDigitInString(str: string) {
  if (str && typeof str === 'string') {
    return str.replace(/\D/g, '');
  }
  return str;
}

export function extractParamsFromString(str: string): any {
  if (str && typeof str === 'string') {
    let regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while ((match = regex.exec(str))) {
      params[match[1]] = match[2];
    }
    return params;
  }
  return {};
}
export function getNow() {
  let d = new Date();
  d = new Date(d.getTime() - 3000000);
  let date_format_str =
    d.getFullYear().toString() +
    '-' +
    ((d.getMonth() + 1).toString().length == 2
      ? (d.getMonth() + 1).toString()
      : '0' + (d.getMonth() + 1).toString()) +
    '-' +
    (d.getDate().toString().length == 2
      ? d.getDate().toString()
      : '0' + d.getDate().toString()) +
    ' ' +
    (d.getHours().toString().length == 2
      ? d.getHours().toString()
      : '0' + d.getHours().toString()) +
    ':' +
    ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2
      ? (parseInt(d.getMinutes() / 5) * 5).toString()
      : '0' + (parseInt(d.getMinutes() / 5) * 5).toString()) +
    ':00';
  return date_format_str;
}
