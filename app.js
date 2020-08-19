const express = require('express')
const path = require('path')

const app = express()

// Setup pug
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Routes
app.get('/', (req, res) => {
  res.render('index')
})

// Listen
app.listen(3000, () => console.log('Server ready'))