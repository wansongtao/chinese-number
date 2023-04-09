/**
 * @description 数字转换模式，默认中文小写数字
 * (amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额)
 */
export type modeType = 'default' | 'amount' | 'max' | 'maxAmount';
const chineseDigits = [
  '零',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '百',
  '千',
  '万',
  '亿',
  '万亿'
] as const;
const maxChineseDigits = [
  '零',
  '壹',
  '贰',
  '叁',
  '肆',
  '伍',
  '陆',
  '柒',
  '捌',
  '玖',
  '拾',
  '佰',
  '仟',
  '万',
  '亿',
  '万亿'
] as const;

/**
 * @description 小数部分转换中文数字
 * @param digit
 * @param mode 默认中文小写数字
 * (amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额)
 * @returns
 */
export const decimal = (digit: number, mode: modeType = 'default') => {
  let digital = digit.toFixed(3);
  const idx = digital.indexOf('.');
  if (idx === -1) {
    return '';
  }
  digital = digital.substring(idx + 1, idx + 4);
  while (digital[digital.length - 1] === '0') {
    digital = digital.substring(0, digital.length - 1);
  }

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  if (mode === 'amount' || mode === 'maxAmount') {
    const text = ['角', '分', '厘'] as const;
    let chineseDigit = '';
    for (let i = 0; i < digital.length; i++) {
      const num = Number(digital[i]);
      if (i !== 0 && num === 0 && Number(digital[i - 1]) === 0) {
        continue;
      }

      chineseDigit += chineseDigitTable[num];

      if (num !== 0) {
        chineseDigit += text[i];
      }
    }
    return chineseDigit;
  }

  let chineseDigit = '点';
  for (let i = 0; i < digital.length; i++) {
    chineseDigit += chineseDigitTable[Number(digital[i])];
  }
  return chineseDigit;
};

/**
 * @description 一万以下数字转换
 * @param digit
 * @param mode 默认中文小写数字
 * (amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额)
 * @returns
 */
export const ltTenThousand = (digit: number, mode: modeType = 'default') => {
  if (digit > 9999) {
    return '';
  }

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const ploy = {
    /**
     * @description 小于100的数转换
     * @param digital
     * @returns
     */
    ltHundred(digital: number) {
      if (digital <= 10) {
        return chineseDigitTable[digital];
      }

      const multiple = (digital / 10) | 0;
      const chineseDigit =
        (multiple > 1 ? chineseDigitTable[multiple] : '') +
        chineseDigitTable[10];

      const remainder = digital % 10;
      if (remainder === 0) {
        return chineseDigit;
      }

      return chineseDigit + chineseDigitTable[remainder];
    },
    /**
     * @description 小于1000的数转换
     * @param digital
     * @returns
     */
    ltThousand(digital: number) {
      let chineseDigit =
        chineseDigitTable[(digital / 100) | 0] + chineseDigitTable[11];

      const remainder = digital % 100;
      if (remainder === 0) {
        return chineseDigit;
      }

      if (remainder < 10) {
        return (
          chineseDigit + chineseDigitTable[0] + chineseDigitTable[remainder]
        );
      }

      // 处理110/214等情况 => 二百一十四
      if (remainder >= 10 && remainder < 20) {
        chineseDigit += chineseDigitTable[1] + chineseDigitTable[10];
        if (remainder > 10) {
          chineseDigit += chineseDigitTable[remainder - 10];
        }

        return chineseDigit;
      }

      return chineseDigit + ploy.ltHundred(remainder);
    },
    /**
     * 小于一万的数转换
     * @param digital
     * @returns
     */
    ltTenThousand(digital: number) {
      const chineseDigit =
        chineseDigitTable[(digital / 1000) | 0] + chineseDigitTable[12];

      const remainder = digital % 1000;
      if (remainder === 0) {
        return chineseDigit;
      }
      if (remainder < 10) {
        return (
          chineseDigit + chineseDigitTable[0] + chineseDigitTable[remainder]
        );
      }
      if (remainder < 100) {
        if (remainder === 10) {
          return (
            chineseDigit +
            chineseDigitTable[0] +
            chineseDigitTable[1] +
            chineseDigitTable[10]
          );
        }
        return chineseDigit + chineseDigitTable[0] + ploy.ltHundred(remainder);
      }

      return chineseDigit + ploy.ltThousand(remainder);
    }
  };

  if (digit < 100) {
    return ploy.ltHundred(digit);
  }

  if (digit < 1000) {
    return ploy.ltThousand(digit);
  }

  return ploy.ltTenThousand(digit);
};

/**
 * 阿拉伯数字转中文数字
 * @param digit
 * @param mode 默认default => 中文小写数字 | amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额
 * @returns
 */
const convertToChineseNumber = (
  digit: number,
  mode: modeType = 'default'
): string => {
  let chineseDigit = '';
  let digital = Math.trunc(digit);
  if (digital < 0) {
    chineseDigit = '负';
    digital = Math.abs(digital);
  }

  let digitString = digital.toString();
  const digitLen = digitString.length;
  if (digitLen > 16) {
    digitString = digitString.substring(digitLen - 16);
  }

  if (digitLen <= 4) {
    digitString = digitString.padStart(4, '0');
  } else if (digitLen <= 8) {
    digitString = digitString.padStart(8, '0');
  } else if (digitLen <= 12) {
    digitString = digitString.padStart(12, '0');
  } else {
    digitString = digitString.padStart(16, '0');
  }

  // 将大数字拆分，例如：123456789 => ['0001', '2345', '6789']
  const digits = digitString.split(/([0-9]{4})/).filter((item) => item !== '');

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const len = digits.length;
  digits.forEach((item, index) => {
    const num = Number(item);
    let text = ltTenThousand(num, mode);

    if (len === 1) {
      chineseDigit += text;
      return;
    }

    if (index !== 0) {
      // 自身为零且前一组数字为零，则不需要添零
      if (!num && !Number(digits[index - 1])) {
        return;
      }

      if (Number(digits[index - 1]) && num) {
        // 这种情况 [0002, 0001] [0010, 3400] 都需要补零
        if (
          (num > 0 && num < 1000) ||
          (digits[index - 1].lastIndexOf('0') === 3 && num)
        ) {
          chineseDigit += chineseDigitTable[0];
        }
      }
    }

    // 数字小于一亿 => 1万至9999万...
    if (len === 2) {
      if (index === 0) {
        chineseDigit = text + chineseDigitTable[13];
        return;
      }

      chineseDigit += text;
      return;
    }

    // 数字小于一万亿
    if (len === 3) {
      if (index === 0) {
        chineseDigit = text + chineseDigitTable[14];
        return;
      }

      if (index === 1 && num !== 0) {
        chineseDigit += text + chineseDigitTable[13];
        return;
      }

      chineseDigit += text;
      return;
    }

    // 千万亿级别
    if (len === 4) {
      if (index === 0) {
        chineseDigit = text + chineseDigitTable[15];
        return;
      }

      if (index === 1 && num !== 0) {
        chineseDigit += text + chineseDigitTable[14];
        return;
      }

      if (index === 2 && num !== 0) {
        chineseDigit += text + chineseDigitTable[13];
        return;
      }

      chineseDigit += text;
      return;
    }
  });

  if (digital !== 0) {
    if (mode === 'amount') {
      chineseDigit += '元';
    } else if (mode === 'maxAmount') {
      chineseDigit += '圆';
    }
  }

  if (Math.abs(digit) !== digital) {
    const decimalText = decimal(digit, mode);
    chineseDigit += decimalText;
  }

  return chineseDigit;
};

export default convertToChineseNumber;
