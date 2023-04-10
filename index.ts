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
 * @description 小数部分转换中文数字
 * @param digit
 * @param mode 默认中文小写数字
 * (amount => 中文小写金额 | max => 中文大写数字 | maxAmount => 中文大写数字金额)
 * @returns
 */
export const decimalToChineseNumber = (
  digit: number,
  mode: modeType = 'default'
) => {
  const idx = digit.toString().indexOf('.');
  if (idx === -1) {
    return '';
  }
  let digital = digit.toString().substring(idx + 1, idx + 4);

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const ploy = {
    simple(digital: string) {
      let chineseDigit = '点';
      for (let i = 0; i < digital.length; i++) {
        chineseDigit += chineseDigitTable[Number(digital[i])];
      }
      return chineseDigit;
    },
    amount(digital: string) {
      let chineseDigit = '';
      for (let i = 0; i < digital.length && i < 3; i++) {
        const num = Number(digital[i]);

        if (num === 0 && Number(digital[i + 1]) === 0) {
          continue;
        }

        chineseDigit += chineseDigitTable[num];
        if (num !== 0) {
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
  let digital = Math.trunc(digit);
  let chineseDigit = '';
  if (digital < 0) {
    chineseDigit = '负';
    digital = Math.abs(digital);
  }

  let digitString = digital.toString();
  const digitLen = digitString.length;
  if (digitLen > 16) {
    digitString = digitString.substring(0, 16);
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

  const digits = digitString.split(/([0-9]{4})/).filter((item) => item !== '');

  const chineseDigitTable =
    mode === 'max' || mode === 'maxAmount' ? maxChineseDigits : chineseDigits;

  const len = digits.length;
  digits.forEach((item, index, arr) => {
    const num = Number(item);
    const text = ltTenThousand(num, mode);

    if (index !== 0) {
      // 自身为零且后一组数字也为零，则跳过
      if (!num && !Number(arr[index + 1])) {
        return;
      }

      // 这种情况 [0002, 0101] [0010, 3400] 都需要补零
      if (
        Number(arr[index - 1]) &&
        num &&
        (num < 1000 || arr[index - 1][arr[index - 1].length - 1] === '0')
      ) {
        chineseDigit += chineseDigitTable[0];
      }
    }

    chineseDigit += text;

    // 8位数
    if (len === 2 && index === 0) {
      chineseDigit += chineseDigitTable[13];
      return;
    }

    // 12位数
    if (len === 3) {
      if (index === 0) {
        chineseDigit += chineseDigitTable[14];
        return;
      }

      if (index === 1 && num !== 0) {
        chineseDigit += chineseDigitTable[13];
        return;
      }
    }

    // 16位数
    if (len === 4) {
      if (index === 0) {
        chineseDigit += chineseDigitTable[15];
        return;
      }

      if (index === 1 && num !== 0) {
        chineseDigit += chineseDigitTable[14];
        return;
      }

      if (index === 2 && num !== 0) {
        chineseDigit += chineseDigitTable[13];
        return;
      }
    }
  });

  if (digital !== 0 && (mode === 'amount' || mode === 'maxAmount')) {
    chineseDigit += amountUnits[3];
  }

  if (Math.abs(digit) !== digital) {
    const decimalText = decimalToChineseNumber(digit, mode);
    chineseDigit += decimalText;
  }

  return chineseDigit;
};

export default convertToChineseNumber;
