import express from 'express'

const app = express()
const port = 4000

app.get('/', (req, res) => {
  res.send('Hello from api-server')
})

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`)
})
