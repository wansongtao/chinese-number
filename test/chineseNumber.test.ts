import convertToChineseNumber, { decimal, ltTenThousand } from '../index';
import { test, expect } from 'vitest';

test('decimal to chinese number', () => {
  expect(decimal(0.123)).toBe('点一二三');
  expect(decimal(0.103, 'amount')).toBe('一角零三厘');
  expect(decimal(0.1055, 'max')).toBe('点壹零伍');
  expect(decimal(0.0046, 'maxAmount')).toBe('零伍厘');
  expect(decimal(460, 'maxAmount')).toBe('');
  expect(decimal(0.46, 'maxAmount')).toBe('肆角陆分');
});

test('numbers below 10,000 are converted chinese numbers', () => {
  expect(ltTenThousand(0)).toBe('零');
  expect(ltTenThousand(909)).toBe('九百零九');
  expect(ltTenThousand(1003)).toBe('一千零三');
  expect(ltTenThousand(110)).toBe('一百一十');
  expect(ltTenThousand(1003, 'max')).toBe('壹仟零叁');
  expect(ltTenThousand(1113)).toBe('一千一百一十三');
  expect(ltTenThousand(11130)).toBe('');
  expect(ltTenThousand(1010)).toBe('一千零一十');
});

test('number to chinese number', () => {
  expect(convertToChineseNumber(0)).toBe('零');
  expect(convertToChineseNumber(2)).toBe('二');
  expect(convertToChineseNumber(10)).toBe('十');
  expect(convertToChineseNumber(21)).toBe('二十一');
  expect(convertToChineseNumber(100)).toBe('一百');
  expect(convertToChineseNumber(1000)).toBe('一千');
  expect(convertToChineseNumber(10000001)).toBe('一千万零一');
  expect(convertToChineseNumber(100000000001)).toBe('一千亿零一');
  expect(convertToChineseNumber(100090000001)).toBe('一千亿零九千万零一');
  expect(convertToChineseNumber(1000000000000001)).toBe('一千万亿零一');
  expect(convertToChineseNumber(1000000090000001)).toBe('一千万亿零九千万零一');
  expect(convertToChineseNumber(1090888800000001)).toBe(
    '一千零九十万亿零八千八百八十八亿零一'
  );

  expect(convertToChineseNumber(-1000)).toBe('负一千');
  expect(convertToChineseNumber(1010, 'amount')).toBe('一千零一十元');
  expect(convertToChineseNumber(1000.99, 'maxAmount')).toBe('壹仟圆玖角玖分');

  expect(convertToChineseNumber(1000000000000000)).toBe('一千万亿');
  expect(convertToChineseNumber(10000000000000000)).toBe('一千万亿');

  expect(convertToChineseNumber(100000000000)).toBe('一千亿');
  expect(convertToChineseNumber(10000000)).toBe('一千万');

  expect(convertToChineseNumber(1, 'max')).toBe('壹');
  expect(convertToChineseNumber(110, 'max')).toBe('壹佰壹拾');
  expect(convertToChineseNumber(8888, 'max')).toBe('捌仟捌佰捌拾捌');
  expect(convertToChineseNumber(90900080, 'max')).toBe('玖仟零玖拾萬零捌拾');
});
