require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000
const nasaEndpoint = `https://api.nasa.gov/mars-photos/api/v1`

function getManifestsEndPoint(rover) {
  return `${nasaEndpoint}/manifests/${rover}?api_key=${process.env.API_KEY}`
}

function getPhotosEndPoint(rover) {
  return `${nasaEndpoint}/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/rovers/:rover_name', async (req, res) => {
  const { rover_name } = req.params
  try {
    let rover = await fetch(getManifestsEndPoint(rover_name))
    .then(res => res.json())

    res.send({ data: rover })
  } catch (err) {
    console.log('error: ', err)
  }
})

app.get('/rovers/:rover_name/photos', async (req, res) => {
  const { rover_name } = req.params
  try {
    let rover_photos = await fetch(getPhotosEndPoint(rover_name))
    .then(res => res.json())

    res.send({ data: rover_photos.latest_photos.slice(0,4) })
  } catch (err) {
    console.log('error: ', err)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
