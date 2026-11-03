(function () {
  const form = document.getElementById('searchForm')
  const capitalInput = document.getElementById('capital')
  const status = document.getElementById('status')
  const table = document.getElementById('countriesTable')
  const tbody = document.getElementById('countriesBody')

  function getCapitalName(country) {
    return country.capitals?.[0]?.name || '—'
  }

  function renderCountries(countries) {
    tbody.innerHTML = ''

    for (const country of countries) {
      const tr = document.createElement('tr')

      const values = [
        country.names?.common || '—',
        getCapitalName(country),
        country.population != null ? country.population : '—',
        country.region || '—',
        country.subregion || '—'
      ]

      for (const value of values) {
        const td = document.createElement('td')
        td.textContent = value
        tr.appendChild(td)
      }

      tbody.appendChild(tr)
    }

    table.hidden = false
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const capital = capitalInput.value.trim()
    if (!capital) {
      status.textContent = 'Wpisz nazwę stolicy.'
      table.hidden = true
      tbody.innerHTML = ''
      return
    }

    if (!window.API_KEY) {
      status.textContent = 'Brak API_KEY w config.js.'
      return
    }

    status.textContent = 'Pobieranie danych…'
    table.hidden = true
    tbody.innerHTML = ''

    const url =
      'https://api.restcountries.com/countries/v5/capitals/' +
      encodeURIComponent(capital) +
      '?response_fields=names.common,capitals,population,region,subregion'

    fetch(url, {
      headers: {
        Authorization: 'Bearer ' + window.API_KEY,
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (response.status === 404) {
          throw new Error('Nie znaleziono kraju dla podanej stolicy.')
        }
        if (!response.ok) {
          throw new Error('Błąd pobierania danych (HTTP ' + response.status + ').')
        }
        return response.json()
      })
      .then(function (json) {
        const countries = json?.data?.objects || []

        if (!countries.length) {
          throw new Error('Nie znaleziono kraju dla podanej stolicy.')
        }

        renderCountries(countries)
        status.textContent =
          'Znaleziono: ' +
          countries.length +
          (countries.length === 1 ? ' kraj' : ' krajów')
      })
      .catch(function (error) {
        table.hidden = true
        tbody.innerHTML = ''
        status.textContent = error.message || 'Wystąpił błąd.'
      })
  })
})()
