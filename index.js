require('dotenv').config()
// packages
const hbs = require('hbs')
const express = require('express')
const bodyParser = require('body-parser')

const app = express() // opstarten van express applicatie
const port = 3000
const path = require('path')
const Filter = require('bad-words')
const cookieParser = require('cookie-parser')
const generateMessage = require('./src/utils/messages')
// Application running on port...

const expressServer = app.listen(process.env.PORT || port, () => console.log(`app draait op port ${port}!!`))
const io = require('socket.io')(expressServer)

const register = require('./src/routes/register')
const auth = require('./src/authenticate/auth')
const match = require('./src/routes/likeAndMatch')
const chat = require('./src/routes/chat')
const search = require('./src/routes/searchUser')
const profileUser = require('./src/routes/profile')
const home = require('./src/routes/home')
const error = require('./src/routes/error')
const index = require('./src/routes/index')
// Load in mongoose and make connection to database
require('./src/db/mongoose.js')


// Load in model
const User = require('./src/models/users');

(async () => {
  // User refers to our User model. We don't have to use db.collection anymore
  const users = await User.find({})

  // console.log(users);
})()

// middleware
app
  .set('view engine', 'hbs')
  .set('views', 'views')
  .use(express.static('public'))
  .use(express.json()) // gebruikt deze map (public) om html bestanden te serveren
  .use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )
  .use(register)
  .use(search)
  .use(cookieParser())

hbs.registerPartials(path.join(__dirname, '/views/partials'))

app
  .get('/', index)
  .get('/home', auth, home)
  .post('/match', auth, match)
  .post('/profile/:id', auth, profileUser)
  .get('/chat', auth, chat)
  .get('/chatRoom', auth, chatRoom)
  .get('/*', error)

let roomId = ''
let userName = ''

function chatRoom(req, res) {
  console.log(req.query.room)
  roomId = req.query.room
  userName = req.user.name

  res.render('chatRoom', {
    title: 'Chat room',
  })
}

io.on('connection', (socket) => {
  // Als er een connectie is met socket io doe dan dit..

  console.log('Iemand heeft de applicatie geopend')

  socket.on('join', () => {
    // Hier maak ik een session aan in de vorm van een chat room!
    // De gebruikers komen hierdoor in een aparte chatroom!
    socket.join(roomId)

    // Zodra de gebruiker in de chatroom komt, stuur dit bericht
    socket.emit(
      'message',
      generateMessage(`Send a message to your crush🥰`),
    )
    // Zodra een nieuwe gebruiker in de room komt stuur dan een notificatie naar de andere gebruiker
    socket.broadcast
      .to(roomId)
      .emit('message', { text: 'Your partner has joined!' })
  })
  // Emit is een method die iets kan terug sturen naar de gebruiker
  // Zie chat.js

  // Op het event sendMessage, doe dan hetgeen in de callback..
  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter() // New instance van filter https://www.npmjs.com/package/bad-words
    const cleanMsg = `${userName} zegt: ${filter.clean(message)}`

    console.log(cleanMsg)

    // Als het bericht bad words bevat, Stuur dan de clean message terug met een warning
    if (filter.isProfane(message)) {
      io.emit('message', cleanMsg)
      return callback('Let een beetje op het taalgebruik..')
    }

    // Stuur clean message terug naar de andere gebruiker
    io.to(roomId).emit('message', generateMessage(cleanMsg))
    callback('Delivered')
  })

  // Wanneer een gebruiker de chat verlaat, verstuur dan een bericht dat de gebruiker weg is
  socket.on('disconnect', () => {
    io.emit('message', { text: 'Your partner has left!' })
  })
})
