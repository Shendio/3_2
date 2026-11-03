(function () {
  const loadBtn = document.getElementById('loadBtn')
  const status = document.getElementById('status')
  const table = document.getElementById('stationsTable')
  const tbody = document.getElementById('stationsBody')

  const API_URL = '/api/stations?limit=100'

  function renderStations(stations) {
    tbody.innerHTML = ''

    stations.forEach(function (station) {
      const tr = document.createElement('tr')

      const values = [
        station.id || '—',
        station.name || '—',
        station.latitude != null ? station.latitude : '—',
        station.longitude != null ? station.longitude : '—'
      ]

      values.forEach(function (value) {
        const td = document.createElement('td')
        td.textContent = value
        tr.appendChild(td)
      })

      tbody.appendChild(tr)
    })

    table.hidden = false
  }

  function loadStations() {
    if (!window.API_KEY) {
      status.textContent = 'Brak API_KEY w config.js.'
      return
    }

    status.textContent = 'Pobieranie stacji…'
    table.hidden = true
    tbody.innerHTML = ''
    loadBtn.disabled = true

    fetch(API_URL, {
      headers: {
        token: window.API_KEY
      }
    })
      .then(function (response) {
        if (response.status === 401) {
          throw new Error('401 Unauthorized — sprawdź token API w config.js.')
        }
        if (!response.ok) {
          throw new Error('Błąd pobierania danych (HTTP ' + response.status + ').')
        }
        return response.json()
      })
      .then(function (json) {
        const stations = json.results || []

        if (!stations.length) {
          throw new Error('Brak stacji w odpowiedzi API.')
        }

        renderStations(stations)

        const total = json.metadata?.resultset?.count
        status.textContent =
          'Wyświetlono: ' +
          stations.length +
          (total != null ? ' z ' + total + ' dostępnych' : '')
      })
      .catch(function (error) {
        table.hidden = true
        tbody.innerHTML = ''
        status.textContent = error.message || 'Wystąpił błąd.'
      })
      .finally(function () {
        loadBtn.disabled = false
      })
  }

  loadBtn.addEventListener('click', loadStations)
})()
