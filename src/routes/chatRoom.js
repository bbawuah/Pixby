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

module.exports = chatRoom