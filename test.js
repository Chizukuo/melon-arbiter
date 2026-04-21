import fetch from 'node-fetch';
const data = { textInput: "hello", images: [] };
fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(log => console.log(log))
  .catch(console.error);
