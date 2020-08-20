const express = require('express')
const path = require('path')
const redis = require('redis')
const bcrypt = require('bcryptjs')

const app = express()
const client = redis.createClient()
const salt = bcrypt.genSaltSync(10);

// Setup pug
app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  const {username, password} = req.body
  if(!username || !password) {
    res.render('error', {
      message: 'Please set username and password'
    })
    return
  } else {
    client.hget('users', username, (err, userid) => {
      if (!userid) {
        //user does not exist, signup procedure
        console.log('sign up user')
        client.incr('userid', async (err, userid) => {
          client.hset('users', username, userid)
          const hash = bcrypt.hashSync(password, salt)
          client.hset(`user:${userid}`, 'hash', hash, 'username', username)
        })
      } else {
        //user exists, login procedure
        console.log('sign in user')
        client.hget(`user:${userid}`, 'hash', async (err, hash) => {
          if (err) console.log(err)
          const result = await bcrypt.compare(password, hash)
          if (result) {
            //password ok
          } else {
            //wrong password
          }
        })
      }
    })
  }
  res.end()
})

// Listen
app.listen(3000, () => console.log('Server ready'))