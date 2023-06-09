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
const amountUnits = ['角', '分', '厘', '元'] as const;

/**
 * 验证是否为1-16位数字（长度不包含符号与小数部分）
 * @param digit
 * @returns
 */
const validateDigit = (digit: string) => {
  const reg = /^[-+]?\d{1,16}(\.\d+)?$/;
  return reg.test(digit);
};

export const decimalToChineseNumber = (
  digit: number,
  mode: modeType = 'default'
) => {
  const digitStr = digit.toString();
  const idx = digitStr.indexOf('.');
  if (idx === -1) {
    return '';
  }
  let digital = digitStr.substring(idx + 1);
  digital = digital.replace(/0+$/, '');

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const ploy = {
    simple(digital: string) {
      let chineseDigit = '';
      for (let i = 0; i < digital.length; i++) {
        chineseDigit += chineseDigitTable[Number(digital[i])];
      }
      return chineseDigit;
    },
    amount(digital: string) {
      let chineseDigit = '';
      for (let i = 0; i < digital.length; i++) {
        const num = Number(digital[i]);

        if (num === 0 && !Number(digital[i - 1])) {
          continue;
        }

        chineseDigit += chineseDigitTable[num];
        if (num !== 0 && i < 3) {
          chineseDigit += amountUnits[i];
        }
      }
      return chineseDigit;
    }
  };

  if (mode === 'amount' || mode === 'maxAmount') {
    return ploy.amount(digital);
  }

  return ploy.simple(digital);
};

export const ltTenThousand = (digit: number, mode: modeType = 'default') => {
  if (digit > 9999) {
    return '';
  }

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const ploy = {
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
    ltTenThousand(digital: number) {
      let chineseDigit =
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
      if (remainder < 20) {
        chineseDigit +=
          chineseDigitTable[0] + chineseDigitTable[1] + chineseDigitTable[10];

        if (remainder > 10) {
          chineseDigit += chineseDigitTable[remainder - 10];
        }
        return chineseDigit;
      }
      if (remainder < 100) {
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
 * @param digit 1-16位数字(长度不包含符号与小数部分，只保留三位小数)
 * @param mode 默认中文小写数字
 * (amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额)
 * @returns
 */
const convertToChineseNumber = (
  digit: number | string,
  mode: modeType = 'default'
): string => {
  const numString = digit.toString();
  if (!validateDigit(numString)) {
    console.warn('The number format is error.');
    return '';
  }

  const nums = numString.split('.');
  const digital = Number(nums[0].replace(/[+-]/g, ''));
  const threeDecimal = nums[1] ? nums[1].substring(0, 3) : '';
  const decimal = threeDecimal ? Number('.' + threeDecimal) : 0;

  if (digital === 0 && decimal === 0) {
    return chineseDigits[0];
  }

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;
  let chineseDigit = '';

  const ploy = {
    convertInteger() {
      let digitString = digital.toString();
      const digitLen = digitString.length;

      if (digitLen <= 4) {
        digitString = digitString.padStart(4, '0');
      } else if (digitLen <= 8) {
        digitString = digitString.padStart(8, '0');
      } else if (digitLen <= 12) {
        digitString = digitString.padStart(12, '0');
      } else {
        digitString = digitString.padStart(16, '0');
      }

      const digits = digitString
        .split(/([0-9]{4})/)
        .filter((item) => item !== '')
        .reverse();

      let chineseText = '';
      digits.forEach((item, index, arr) => {
        const num = Number(item);
        const text = ltTenThousand(num, mode);

        const preNum = Number(arr[index - 1]);
        // 自身为零且前一组数字也为零，则跳过
        if (!num && !preNum) {
          return;
        }

        // 1. 20101 => [0101, 0002] 2. 103400 => [3400, 0010] 都需要补零
        if (num && preNum && (preNum < 1000 || num % 10 === 0)) {
          chineseText = chineseDigitTable[0] + chineseText;
        }

        if (!num) {
          chineseText = text + chineseText;
          return;
        }

        if (index === 1) {
          chineseText = chineseDigitTable[13] + chineseText;
        } else if (index === 2) {
          chineseText = chineseDigitTable[14] + chineseText;
        } else if (index === 3) {
          chineseText = chineseDigitTable[15] + chineseText;
        }

        chineseText = text + chineseText;
      });

      if (mode === 'amount' || mode === 'maxAmount') {
        chineseText += amountUnits[3];
      }

      return chineseText;
    },
    convertDecimal() {
      const decimalText = decimalToChineseNumber(decimal, mode);
      if (mode === 'default' || mode === 'max') {
        chineseDigit += '点' + decimalText;
        return;
      }

      // 大写金额模式下，小数部分只有一位时，需要加上整
      let text = '';
      if (
        mode === 'maxAmount' &&
        decimalText.indexOf(amountUnits[1]) === -1 &&
        decimalText.indexOf(amountUnits[2]) === -1
      ) {
        text = '整';
      }

      if (digital === 0) {
        chineseDigit = decimalText + text;
        return;
      }

      // 金额模式下，小数部分小于0.1或整数部分个位数为零时需要加上零
      if (decimalText.indexOf(amountUnits[0]) === -1 || digital % 10 === 0) {
        chineseDigit += chineseDigitTable[0];
      }

      chineseDigit += decimalText + text;
    }
  };

  if (digital !== 0) {
    chineseDigit = ploy.convertInteger();
  } else {
    chineseDigit = chineseDigitTable[0];
  }

  if (numString.indexOf('-') > -1 && (digital !== 0 || decimal !== 0)) {
    chineseDigit = '负' + chineseDigit;
  }

  if (decimal === 0) {
    if (mode === 'maxAmount' && digital) {
      chineseDigit += '整';
    }

    return chineseDigit;
  }

  ploy.convertDecimal();
  return chineseDigit;
};

export default convertToChineseNumber;
