
// https://www.youtube.com/watch?v=3NG8zy0ywIk&list=PL4cUxeGkcC9gfoKa5la9dsdCNpuey2s-V&index=17&t=107s

const list = document.querySelectorAll('.card_cap .userProfession')
console.log(list)

const searchBar = document.forms.searchProfession.querySelector('input')
const container = document.getElementsByClassName('container')[0]

console.log(container)

searchBar.addEventListener('keyup', (e) => {
  e.preventDefault()
  const term = e.target.value.toLowerCase()
  console.log(term)

  const div = document.getElementsByClassName('card_cap')
  const profession = document.getElementsByClassName('userProfession')

  const url = `/search:${term}`
  console.log(url)

  fetch(url).then((res) => res.json()).then((data) => { // If there is a user with the term
    container.innerHTML = '' // Delete everything

    console.log(data)
    data.forEach((user) => { // Loop through the array, for each user insert that data in HTML
      container.insertAdjacentHTML('beforeend', `

      <li>
        <section>
          <figure><img src="img/components/${user.img}" alt="">
            <figcaption class="card_cap">
              <h2>${user.name}, ${user.age}</h2>
              <h3>${user.location}</h3>
              <h3 class="userProfession">${user.profession}</h3>
            </figcaption>
          </figure>
          <form action="/match" method="POST">
            <div class="decline">
              <div class="white-btn">
                <input type="submit" value=${user._id} src="img/components/cross.svg" name="dislike">
              </div>
            </div>
            <div class="superlike">
              <div class="white-btn">
                <input type="image" value="superlike" src="img/components/star.svg" name="superlike">
              </div>
            </div>
            <div class="like">
              <div class="white-btn">
                <input type="submit" value=${user._id} src="img/components/heart.svg" name="like">
              </div>
            </div>
          </form>
        </section>
      </li>


    `)
    })
    console.log(data)
  })

  Array.from(profession).forEach((profession) => {
    console.log(profession)
  })
})
