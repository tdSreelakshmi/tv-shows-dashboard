let db

export function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this browser.'))
    }
    if (db) return resolve(db)
    const request = indexedDB.open('ShowsDatabase', 1)

    request.onerror = () => reject(new Error('Failed to open IndexedDB'))

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains('shows')) {
        database.createObjectStore('shows', { keyPath: 'id' })
      }

      if (!database.objectStoreNames.contains('genres')) {
        database.createObjectStore('genres', { keyPath: 'name' })
      }
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
    }
  })
}

export async function addShows(shows) {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('shows', 'readwrite')
    const store = transaction.objectStore('shows')
    for (const [id, show] of Object.entries(shows)) {
      store.put({ id, shows: JSON.parse(JSON.stringify(show)) })
    }

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new Error('Error adding shows'))
  })
}
export async function addGenres(genres) {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction('genres', 'readwrite')
    const store = transaction.objectStore('genres')

    for (const [name, showIds] of Object.entries(genres)) {
      store.put({
        name,
        ids: JSON.parse(JSON.stringify(showIds))
      })
    }

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(new Error('Error adding genres'))
  })
}

export async function getAllShows() {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('shows', 'readonly')
    const store = transaction.objectStore('shows')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Error fetching shows'))
  })
}
export async function getAllGenres() {
  const database = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('genres', 'readonly')
    const store = transaction.objectStore('genres')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Error fetching shows'))
  })
}
