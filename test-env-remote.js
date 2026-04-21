import fetch from 'node-fetch';
fetch('http://localhost:3000/api/env-test')
  .then(res => res.json())
  .then(log => console.log(log))
  .catch(console.error);
