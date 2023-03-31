import convertToChineseNumber from '../index';

const getPseudoRandomNumber = (min = 0, max = 949672960000000) => {
  if (min > max) {
    const temp = min;
    max = min;
    min = temp;
  }

  return min + Math.ceil(Math.random() * (max - min));
};

const testSpeed = (min = 0, max = 949672960000, count = 10) => {
  for (let i = 0; i < count; i++) {
    const num = getPseudoRandomNumber(min, max);
    console.time(`第${i + 1}次: ${num}`);
    const chineseNum = convertToChineseNumber(num, 'maxAmount');
    console.timeEnd(`第${i + 1}次: ${num}`);
    console.log(chineseNum + '\n');
  }
};

testSpeed();
console.log(convertToChineseNumber(100107));

// console.log(decimal(0.1236, 'amount'));

