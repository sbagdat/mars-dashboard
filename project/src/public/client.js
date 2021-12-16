let store = Immutable.fromJS({
  project: { name: 'Udacity Mars Dashboard Project' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  currentRover: { name: null, data: null },
  currentRoverPhotos: {},
})

const root = document.getElementById('root')

const updateStore = (newState) => {
  store = store.merge(newState)
  render(root, store)
}

const render = async (root, state) => {
  root.innerHTML = App(state)
}

// create content
const App = (state) => {
  return `
        ${Header()}
        <main>
          ${RoverButtons(state)}
          ${currentRoverInformation()}
        </main>
    `
}

window.addEventListener('load', () => {
  render(root, store)
})

// ------------------------------------------------------  COMPONENTS
const Header = () => {
  return `
      <header>
        <h1>${store.get('project').get('name')}</h1>
      </header>
    `
}

const RoverButton = (roverName) => {
  return `
      <header>
            <button class="button ${store.get('currentRover').get('name') === roverName && 'active'}" 
                    onclick="getRoverData('${roverName}')">
              ${roverName}
            </button>
        </header>
    `
}

const RoverButtons = (state) => {
  return `
        <div class="buttons">
            ${state.get('rovers').map(rover => RoverButton(rover)).join('')}
        </div>
    `
}

const Photo = (photo) => {
  return `
      <div class="photo">
        <img src="${photo.get('img_src')}" alt="${photo.get('id')}">
        <span>${photo.get('earth_date')}</span>
      </div>
    `
}

const currentRoverInformation = () => {
  if (store.get('currentRover').get('name') === null) {
    return `
        <div>
            <h2 style="margin: 1rem; text-align: center;">Select a rover</h2>
        </div>
    `
  }
  return `
        <div>
            <div class="rover-data">
                <div class="rover-data-item">
                    <h3>Status</h3>
                    <p>${store.get('currentRover').get('data').get('status')}</p>
                </div>
                <div class="rover-data-item">
                    <h3>Landing Date</h3>
                    <p>${store.get('currentRover').
    get('data').
    get('landing_date')}</p>
                </div>
                <div class="rover-data-item">
                    <h3>Launch Date</h3>
                    <p>
                    ${store.get('currentRover').get('data').get('launch_date')}
                    </p>
                </div>
            </div>
        </div>
        <div>
            <h2 style="margin: 1rem; text-align: center;">Latest Photos</h2>
            <div class="photos">
                ${store.get('currentRoverPhotos').get('data').map(photo => Photo(photo)).join('')}
            </div>
        </div>
    `
}

// ------------------------------------------------------  API CALLS
const getRoverPhotos = (roverName) => {
  fetch(`http://localhost:3000/rovers/${roverName}/photos`).
    then(res => res.json()).
    then(roverPhotos => updateStore(
      { currentRoverPhotos: { data: roverPhotos.data } }))
}

const getRoverData = (roverName) => {
  fetch(`http://localhost:3000/rovers/${roverName}`).
    then(res => res.json()).
    then(roverData => updateStore({
      currentRover: {
        name: roverName,
        data: roverData.data.photo_manifest,
      },
    }))

  getRoverPhotos(roverName)
}
