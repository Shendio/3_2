const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000
const NOAA_BASE = 'https://www.ncei.noaa.gov/cdo-web/api/v2'

app.use(express.static(path.join(__dirname)))

app.get('/api/stations', async function (req, res) {
  try {
    const token = req.headers.token
    if (!token) {
      return res.status(401).json({ message: 'Brak nagłówka token.' })
    }

    const qs = new URLSearchParams(req.query).toString()
    const url = NOAA_BASE + '/stations' + (qs ? '?' + qs : '')

    const response = await fetch(url, {
      headers: { token: token }
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ message: error.message || 'Błąd proxy.' })
  }
})

app.listen(PORT, function () {
  console.log('Serwer: http://localhost:' + PORT)
})
