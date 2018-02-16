/**
 *
 * Boot strap the new server and then load data
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Repository = require('./repository')

const server = express()
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: true
}))
server.use((req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.header('access_token', 'text/html; charset=utf-8')
  next()
})

const devicesRepository = new Repository()

// Load default data into a repository
const importData = () => {
  const data = require('./data/devicesData.json')
  data.reduce((a, v) => {
    v.id = a + 1
    devicesRepository.insert(v)
    return a + 1
  }, 0)
}

//fetch all customer devices
const cust = () => {
  return devicesRepository.fetchAll().filter(a => {
    return a
  })
}

//get devices
server.get('/devices', (req, res) => {
  res.json(cust())
})

//add the repository in
module.exports = {
  server,
  importData,
  devicesRepository
}
