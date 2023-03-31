/**
 * @description 阿拉伯数字转中文数字
 * @param digit
 * @returns
 */
const convertToChineseNumber = (digit: number): string => {
  const chineseDigitTable = [
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

  const ploy = {
    /**
     * @description 小于100的数转换
     * @param digital
     * @returns
     */
    ltHundred(digital: number) {
      if (digit <= 10) {
        return chineseDigitTable[digit];
      }

      const ten = Math.trunc(digital / 10);
      const cnDigit =
        (ten > 1 ? chineseDigitTable[ten] : '') + chineseDigitTable[10];

      const num = digital % 10;
      if (num === 0) {
        return cnDigit;
      }

      return cnDigit + chineseDigitTable[num];
    },
    /**
     * @description 小于1000的数转换
     * @param digital
     * @returns
     */
    ltThousand(digital: number) {
      let cnDigit =
        chineseDigitTable[Math.trunc(digital / 100)] + chineseDigitTable[11];

      const num = digital % 100;
      if (num === 0) {
        return cnDigit;
      }

      if (num < 10) {
        return cnDigit + chineseDigitTable[0] + chineseDigitTable[num];
      }

      // 处理110/214等情况 => 二百一十四
      if (num >= 10 && num < 20) {
        cnDigit += chineseDigitTable[1] + chineseDigitTable[10];
        if (num > 10) {
          cnDigit += chineseDigitTable[num - 10];
        }

        return cnDigit;
      }

      return cnDigit + ploy.ltHundred(num);
    },
    /**
     * 小于一万的数转换
     * @param digital
     * @returns
     */
    ltTenThousand(digital: number) {
      const cnDigit =
        chineseDigitTable[Math.trunc(digital / 1000)] + chineseDigitTable[12];

      const num = digital % 1000;
      if (num === 0) {
        return cnDigit;
      }
      if (num < 10) {
        return cnDigit + chineseDigitTable[0] + chineseDigitTable[num];
      }
      if (num < 100) {
        if (num === 10) {
          return (
            cnDigit +
            chineseDigitTable[0] +
            chineseDigitTable[1] +
            chineseDigitTable[10]
          );
        }
        return cnDigit + chineseDigitTable[0] + ploy.ltHundred(num);
      }

      return cnDigit + ploy.ltThousand(num);
    },
    /**
     * @description 亿到万亿
     * @param digital
     * @returns
     */
    gtBillion(digital: number) {
      let digitString = digital.toString();
      const digitLen = digitString.length;
      if (digitLen > 16 || digitLen < 5) {
        return '';
      }
      if (digitLen <= 8) {
        digitString = digitString.padStart(8, '0');
      } else if (digitLen <= 12) {
        digitString = digitString.padStart(12, '0');
      } else {
        digitString = digitString.padStart(16, '0');
      }

      // 将大数字拆分，例如：123456789 => ['0001', '2345', '6789']
      const digits = digitString
        .split(/([0-9]{4})/)
        .filter((item) => item !== '');

      let cnDigit = '';
      const len = digits.length;
      digits.forEach((item, index) => {
        const num = Number(item);
        let text = '';
        if (num !== 0) {
          text = convertToChineseNumber(num);
        }

        if (index !== 0) {
          // 这种情况 [0002, 0001] [0010, 3400] 都需要补零
          if (
            (num > 0 && num < 1000) ||
            digits[index - 1].lastIndexOf('0') === 3
          ) {
            cnDigit += chineseDigitTable[0];
          }
        }

        // 数字小于一亿 => 1万至9999万...
        if (len === 2) {
          if (index === 0) {
            cnDigit = text + chineseDigitTable[13];
            return;
          }

          cnDigit += text;
          return;
        }

        // 数字小于一万亿
        if (len === 3) {
          if (index === 0) {
            cnDigit = text + chineseDigitTable[14];
            return;
          }

          if (index === 1 && num !== 0) {
            cnDigit += text + chineseDigitTable[13];
            return;
          }

          cnDigit += text;
          return;
        }

        // 千万亿级别
        if (len === 4) {
          if (index === 0) {
            cnDigit = text + chineseDigitTable[15];
            return;
          }

          if (index === 1 && num !== 0) {
            cnDigit += text + chineseDigitTable[14];
            return;
          }

          if (index === 2 && num !== 0) {
            cnDigit += text + chineseDigitTable[13];
            return;
          }

          cnDigit += text;
          return;
        }
      });

      return cnDigit;
    }
  };

  let chineseDigit = '';
  digit = digit | 0;
  if (digit < 0) {
    chineseDigit += '负';
    digit = Math.abs(digit);
  }
  if (digit < 100) {
    return chineseDigit + ploy.ltHundred(digit);
  }
  if (digit < 1000) {
    return chineseDigit + ploy.ltThousand(digit);
  }
  if (digit < 10000) {
    return chineseDigit + ploy.ltTenThousand(digit);
  }

  chineseDigit += ploy.gtBillion(digit);

  return chineseDigit;
};

export default convertToChineseNumber;
