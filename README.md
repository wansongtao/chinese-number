# convertToChineseNumber
将阿拉伯数字转换为中文数字，最大支持16位数字。支持中文大、小写数字、支持小数（保留三位，四舍五入）。测试覆盖率百分之百。
## install
```bash
$ npm install number2chinesenumber
```

## example
```javascript
import convertToChineseNumber from 'number2chinesenumber'

const num = 100.007
convertToChineseNumber(num) // 一百点零零七
convertToChineseNumber(num, 'maxAmount') // 壹佰圆零柒厘
convertToChineseNumber(num, 'amount') // 一百元零七厘
convertToChineseNumber(num, 'max') // 壹佰点零零柒


convertToChineseNumber(100107) // 十万零一百零七
```

## Links
- [github doc](https://github.com/wansongtao/chinese-number)