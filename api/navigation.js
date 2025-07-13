// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/weather', async (req, res) => {
//   res.status(200).json({ message: `Hello!` });
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

export default async function handler(req, res) {
  return res.status(200).json({
    message: "hello world"
  })
}