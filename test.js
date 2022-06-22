const m = new Map();
const test = 'a&aa'
console.log(test.split('&'))
m.set(...test.split('&'))
m.set(...['b', 'bb'])

console.log(m.get('a'));
console.log(m.get('b'));