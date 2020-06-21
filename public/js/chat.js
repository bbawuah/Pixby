const socket = io()

// Elements
const form = document.querySelector('#formMessage')
const input = document.querySelector('#input')
const btn = document.querySelector('#btn')
const messages = document.querySelector('#messages')

// Naam van het event moet hetzelfde zijn als op de server
// Count is data die ik meestuur vanaf de client.
// count kan ik in principe elke naam geven die ik wil. Het gaat hier om de volgorde


const autoScroll = () => {
// Get new message element
  const newMessages = messages.lastElementChild // Is laatste bericht in chatbox;


  // Height van laatste bericht
  const newMessageStyles = getComputedStyle(newMessages) // Haal de style van specifieke element
  console.log(newMessageStyles)

  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  console.log(newMessageMargin)
  const lastMessage = newMessages.offsetHeight + newMessageMargin

  // Visible Height
  const visibleHeight = messages.offsetHeight

  // Height of container
  const containerHeight = messages.scrollHeight

  // Hoever is er naar beneden gescrolld
  const scrollOffset = messages.scrollTop + visibleHeight

  if (containerHeight - lastMessage <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight
  }
}

console.log(location)
socket.on('message', (message) => {
  console.log(message)

  messages.insertAdjacentHTML(
    'beforeend',
    `
  
  <div class="message">
  <p><span class="message-time">${message.text}</span> - <span class="message-name">${message.createdAt ? message.createdAt : '-'}</span></p>
</div>
  `,
  )

  autoScroll()
})

form.addEventListener('submit', (e) => {
  const message = e.target.elements.message.value
  e.preventDefault()
  // Disable form

  btn.setAttribute('disabled', 'disabled') // disable form btn

  socket.emit('sendMessage', message, (error) => {
    // Enable form

    btn.removeAttribute('disabled') // disable form btn
    input.value = ''
    input.focus()

    if (error) {
      console.log(error)
    }

    console.log('Message was delivered..')
  })
})


socket.emit('join')
