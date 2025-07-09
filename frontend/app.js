const content = await fetch('http:localhost:3500/tasks');
const data = await content.json()
console.log(data);