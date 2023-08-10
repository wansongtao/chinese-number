import number2chinesenumber, { decimalToChineseNumber, ltTenThousand } from '../index';
import { test, expect } from 'vitest';

test('decimalToChineseNumber to chinese number', () => {
  expect(decimalToChineseNumber(0.123)).toBe('一二三');
  expect(decimalToChineseNumber(0.6)).toBe('六');
  expect(decimalToChineseNumber(0.6006)).toBe('六零零六');
  expect(decimalToChineseNumber(0.006)).toBe('零零六');
  expect(decimalToChineseNumber(0.1055, 'max')).toBe('壹零伍伍');
  expect(decimalToChineseNumber(0.06)).toBe('零六');
  expect(decimalToChineseNumber(0.060)).toBe('零六');
  expect(decimalToChineseNumber(0.0606)).toBe('零六零六');

  expect(decimalToChineseNumber(0.103, 'amount')).toBe('一角零三厘');
  expect(decimalToChineseNumber(0.0046, 'maxAmount')).toBe('肆厘陆');
  expect(decimalToChineseNumber(460, 'maxAmount')).toBe('');
  expect(decimalToChineseNumber(0.46, 'maxAmount')).toBe('肆角陆分');
  expect(decimalToChineseNumber(0.6000, 'maxAmount')).toBe('陆角');
  expect(decimalToChineseNumber(0.6009, 'maxAmount')).toBe('陆角零玖');
  expect(decimalToChineseNumber(0.0060, 'amount')).toBe('六厘');
  expect(decimalToChineseNumber(0.0609, 'maxAmount')).toBe('陆分零玖');
});

test('numbers below 10,000 are converted chinese numbers', () => {
  expect(ltTenThousand(0)).toBe('零');
  expect(ltTenThousand(10)).toBe('十');
  expect(ltTenThousand(11)).toBe('十一');
  expect(ltTenThousand(909)).toBe('九百零九');
  expect(ltTenThousand(110)).toBe('一百一十');
  expect(ltTenThousand(111)).toBe('一百一十一');
  expect(ltTenThousand(1000)).toBe('一千');
  expect(ltTenThousand(1003)).toBe('一千零三');
  expect(ltTenThousand(1003, 'max')).toBe('壹仟零叁');
  expect(ltTenThousand(1113)).toBe('一千一百一十三');
  expect(ltTenThousand(1010)).toBe('一千零一十');
  expect(ltTenThousand(10000)).toBe('');
});

test('number to chinese number', () => {
  expect(number2chinesenumber(0)).toBe('零');
  expect(number2chinesenumber(0, 'default')).toBe('零');
  expect(number2chinesenumber(0, 'max')).toBe('零');
  expect(number2chinesenumber(0, 'amount')).toBe('零');
  expect(number2chinesenumber(0, 'maxAmount')).toBe('零');

  expect(number2chinesenumber(0.9000)).toBe('零点九');
  expect(number2chinesenumber(-0.9000)).toBe('负零点九');
  expect(number2chinesenumber(0.9000, 'max')).toBe('零点玖');
  expect(number2chinesenumber(0.9000, 'amount')).toBe('九角');
  expect(number2chinesenumber(0.9000, 'maxAmount')).toBe('玖角整');
  expect(number2chinesenumber(0.9090, 'maxAmount')).toBe('玖角零玖厘');
  expect(number2chinesenumber(0.09790)).toBe('零点零九七');
  expect(number2chinesenumber(0.99, 'maxAmount')).toBe('玖角玖分');
  expect(number2chinesenumber(0.99, 'amount')).toBe('九角九分');
  expect(number2chinesenumber(0.099, 'amount')).toBe('九分九厘');

  expect(number2chinesenumber(2)).toBe('二');
  expect(number2chinesenumber(10)).toBe('十');
  expect(number2chinesenumber(12)).toBe('十二');
  expect(number2chinesenumber(21)).toBe('二十一');
  expect(number2chinesenumber(100)).toBe('一百');
  expect(number2chinesenumber(1000)).toBe('一千');
  expect(number2chinesenumber(12138)).toBe('一万二千一百三十八');
  expect(number2chinesenumber(100000)).toBe('十万');
  expect(number2chinesenumber(10000000)).toBe('一千万');
  expect(number2chinesenumber(100000000000)).toBe('一千亿');
  expect(number2chinesenumber(1000000000000000)).toBe('一千万亿');
  expect(number2chinesenumber(10000000000000000)).toBe('');
  expect(number2chinesenumber(10000001)).toBe('一千万零一');
  expect(number2chinesenumber(10800201, 'maxAmount')).toBe('壹仟零捌拾万零贰佰零壹元整');
  expect(number2chinesenumber(100000000001)).toBe('一千亿零一');
  expect(number2chinesenumber(100090000001)).toBe('一千亿零九千万零一');
  expect(number2chinesenumber(1000000000000001)).toBe('一千万亿零一');
  expect(number2chinesenumber(1000000090000001)).toBe('一千万亿零九千万零一');
  expect(number2chinesenumber(1000900000000001)).toBe('一千万亿零九千亿零一');
  expect(number2chinesenumber(1090888800000001)).toBe(
    '一千零九十万亿零八千八百八十八亿零一'
  );


  expect(number2chinesenumber(-1000)).toBe('负一千');
  expect(number2chinesenumber(-1000, 'max')).toBe('负壹仟');
  expect(number2chinesenumber(-1000, 'amount')).toBe('负一千元');
  expect(number2chinesenumber(-1000, 'maxAmount')).toBe('负壹仟元整');
  expect(number2chinesenumber(-1000.9, 'maxAmount')).toBe('负壹仟元零玖角整');


  expect(number2chinesenumber(1011)).toBe('一千零一十一');
  expect(number2chinesenumber(1010, 'max')).toBe('壹仟零壹拾');
  expect(number2chinesenumber(1010, 'amount')).toBe('一千零一十元');
  expect(number2chinesenumber(1010, 'maxAmount')).toBe('壹仟零壹拾元整');
  expect(number2chinesenumber(1010.90, 'maxAmount')).toBe('壹仟零壹拾元零玖角整');
  expect(number2chinesenumber(1000, 'maxAmount')).toBe('壹仟元整');
  expect(number2chinesenumber(1001, 'maxAmount')).toBe('壹仟零壹元整');
  expect(number2chinesenumber(1000.99, 'maxAmount')).toBe('壹仟元零玖角玖分');
  expect(number2chinesenumber(1000.90, 'maxAmount')).toBe('壹仟元零玖角整');
  expect(number2chinesenumber(1001.90, 'maxAmount')).toBe('壹仟零壹元玖角整');
  expect(number2chinesenumber(1001.090, 'maxAmount')).toBe('壹仟零壹元零玖分');
  expect(number2chinesenumber(100.7007)).toBe('一百点七');
  expect(number2chinesenumber(100.7007, 'max')).toBe('壹佰点柒');
  expect(number2chinesenumber(100.7007, 'amount')).toBe('一百元零七角');
  expect(number2chinesenumber(100.7007, 'maxAmount')).toBe('壹佰元零柒角整');
  expect(number2chinesenumber(100.0007, 'maxAmount')).toBe('壹佰元整');

  expect(number2chinesenumber(100107)).toBe('十万零一百零七');
  expect(number2chinesenumber(100107, 'amount')).toBe('十万零一百零七元');
  expect(number2chinesenumber(100107, 'max')).toBe('拾万零壹佰零柒');
  expect(number2chinesenumber(100107, 'maxAmount')).toBe('拾万零壹佰零柒元整');

  expect(number2chinesenumber('1000000000000001')).toBe('一千万亿零一');
  expect(number2chinesenumber('-1001')).toBe('负一千零一');
  expect(number2chinesenumber('-1001.090')).toBe('负一千零一点零九');
  expect(number2chinesenumber('+1001')).toBe('一千零一');
  expect(number2chinesenumber('+1001.99')).toBe('一千零一点九九');
  expect(number2chinesenumber('10ad')).toBe('');
});
