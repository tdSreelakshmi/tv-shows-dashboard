import { createStore } from 'vuex'
import axios from 'axios'
const tvMazeHTTP = axios.create({
  baseURL: 'https://api.tvmaze.com/'
})
export default createStore({
  state: {
    showsByGenre: {},
    showsById: {},
    loaded: false,
    page: 1,
    shows: [],
    hasMore: true,
    selectedGenre: null,
    enableSearch: false,
    searchResults: null,
    screenHeight: screen.availHeight,
    scrollPosition: 0
  },
  getters: {
    getGenres: (state) => Object.keys(state.showsByGenre),
    getShowById: (state) => (id) => state.showsById[id],
    getShowsByGenre: (state) => (genre) => state.showsByGenre[genre]
  },
  mutations: {
    SET_SCROLL_POSTION (state, payload) {
      state.scrollPosition = payload
    },
    SET_SEARCH (state, payload) {
      state.enableSearch = payload
      if (!payload) state.searchResults = null
    },
    SET_SEARCH_RESULTS (state, payload) {
      state.searchResults = payload
    },
    SELECT_GENRE (state, payload) {
      state.selectedGenre = payload
    },
    SET_SHOWS (state, payload) {
      state.shows.push(...payload)

      if (!state.loaded) state.loaded = true
    },
    SET_SHOW (state, payload) {
      if (!state.showsById[payload.id]) {
        state.showsById[payload.id] = payload
        payload.genres.forEach((genre) => {
          if (!state.showsByGenre[genre]) state.showsByGenre[genre] = []
          state.showsByGenre[genre].push(payload.id)
        })
      }
    },
    SET_SHOW_INCREMENTLY (state, show) {
      state.showsById[show.id] = show

      show.genres.forEach((genre) => {
        if (!state.showsByGenre[genre]) {
          state.showsByGenre[genre] = []
        }

        const list = state.showsByGenre[genre]
        const rating = show.rating?.average ?? 0

        const i = list.findIndex(
          (id) => (state.showsById[id].rating?.average ?? 0) < rating
        )

        if (i === -1) list.push(show.id)
        else list.splice(i, 0, show.id)
      })
    }
  },
  actions: {
    async getCastCredits ({}, id) {
      try {
        const response = await tvMazeHTTP.get(`people/${id}?embed=castcredits`)
        return response.data
      } catch (error) {}
    },
    async showAkas ({}, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/akas`)
        const showNames = response.data.map((show) => show.name)
        return showNames
      } catch (error) {}
    },
    async searchShow ({ commit }, term) {
      try {
        const response = await tvMazeHTTP.get(`search/shows?q=${term}`)
        commit('SET_SEARCH_RESULTS', response.data)
      } catch (error) {
        commit('SET_SEARCH_RESULTS', null)
      }
    },
    async getShow ({ commit }, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}`)

        const show = response.data
        commit('SET_SHOW', show)
        return show
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async setShows ({ commit, state }) {
      while (state.shows.length || state.hasMore) {
        if (state.shows.length) { commit('SET_SHOW_INCREMENTLY', state.shows.shift()) }

        if (state.shows.length % 5 === 0) {
          await new Promise((r) => setTimeout(r))
        }
      }
    },
    async getShows ({ state, dispatch }) {
      let page = 1
      state.hasMore = true
      while (state.hasMore) {
        try {
          const fetched = await dispatch('fetchData', page)
          // state.hasMore = false;

          if (!fetched || fetched.length === 0) {
            state.hasMore = false
          } else {
            page++
          }
        } catch (err) {
          console.error('Fetch failed:', err)
          state.hasMore = false
        }
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 50)
        })
      }
    },

    async fetchData ({ commit }, page) {
      try {
        const response = await tvMazeHTTP.get(`shows?page=${page}`)
        const shows = response.data

        if (shows.length > 0) {
          commit('SET_SHOWS', shows)

          return shows
        } else {
          return null
        }
      } catch (error) {
        console.error('Error fetching page', page, error)
        throw error
      }
    },
    async getShowImages (_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/images`)

        const images = response.data.reduce((images, r) => {
          const image = r.resolutions?.original?.url ?? null

          if (image && r.type === 'poster') images.push(image)
          return images
        }, [])
        return images
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getShowCast (_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/cast`)

        return response.data
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async getCastInfo (_, id) {
      try {
        const response = await tvMazeHTTP.get(`characters/${id}`)

        return response.data.image?.medium ?? null
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  modules: {}
})
