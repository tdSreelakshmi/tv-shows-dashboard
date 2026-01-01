import { createStore } from "vuex";
import { addShows, getAllShows, getAllGenres, addGenres } from "../indexeddb";
import axios from "axios";
const tvMazeHTTP = axios.create({
  baseURL: "https://api.tvmaze.com/"
});
export default createStore({
  state: {
    showsByGenre: {},
    showsById: {},
    loaded: false,
    page: 1,
    hasMore: true,
    selectedGenre: null,
    screenHeight: screen.availHeight,
    scrollPosition: 0,
    searchTerm: null
  },
  getters: {
    getGenres: (state) => Object.keys(state.showsByGenre),
    getShowById: (state) => (id) => state.showsById[id],
    getShowsByGenre: (state) => (genre) => state.showsByGenre[genre]
  },
  mutations: {
    SET_SEARCH_TERM(state, payload) {
      state.searchTerm = payload;
    },
    SET_LOADED(state, payload) {
      state.loaded = payload;
    },
    SET_SCROLL_POSTION(state, payload) {
      state.scrollPosition = payload;
    },

    SELECT_GENRE(state, payload) {
      state.selectedGenre = payload;
    },

    SET_SHOW(state, payload) {
      if (!state.showsById[payload.id]) {
        state.showsById[payload.id] = payload;
        payload.genres.forEach((genre) => {
          if (!state.showsByGenre[genre]) state.showsByGenre[genre] = [];
          state.showsByGenre[genre].push(payload.id);
        });
      }
    },
    SET_SHOW_INCREMENTALLY(state, show) {
      if (!state.showsById[show.id]) {
        state.showsById[show.id] = show;

        show.genres.forEach((genre) => {
          if (!state.showsByGenre[genre]) {
            state.showsByGenre[genre] = [];
            state.showsByGenre[genre].push(show.id);
          } else {
            const list = state.showsByGenre[genre];
            const rating = show.rating?.average ?? 0;
            if (rating === 0) list.push(show.id);
            else {
              let left = 0;
              let right = list.length - 1;
              while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const midRating = state.showsById[list[mid]].rating?.average ?? 0;
                if (midRating < rating) {
                  right = mid - 1;
                } else {
                  left = mid + 1;
                }
              }
              list.splice(left, 0, show.id);
            }
          }
        });
      }
    },
    SET_SHOWS(state, payload) {
      payload.forEach((showInfo) => {
        state.showsById[showInfo.id] = showInfo.shows;
      });
    },
    SET_GENRES(state, payload) {
      payload.forEach((genre) => {
        state.showsByGenre[genre.name] = genre.ids;
      });
    }
  },
  actions: {
    async getCastCredits(_, id) {
      try {
        const response = await tvMazeHTTP.get(`people/${id}?embed=castcredits`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async showAkas(_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/akas`);
        const showNames = response.data.map((show) => show.name);
        return showNames;
      } catch (error) {}
    },
    async searchShow(_, term) {
      const response = await tvMazeHTTP.get(`search/shows?q=${term}`);

      return response.data;
    },
    async getShow({ state, commit }, id) {
      if (state.showsById[id]) return state.showsById[id];
      try {
        const response = await tvMazeHTTP.get(`shows/${id}`);

        const show = response.data;
        commit("SET_SHOW", show);
        return show;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },

    async getShows({ state, commit, dispatch }) {
      let shows = [];
      let genres = null;

      try {
        const lastShowsFetched = parseInt(localStorage.getItem("lastShowsFetched")) || 0;
        const fetchNewShows = Date.now() - lastShowsFetched > 24 * 60 * 60 * 1000;
        if (lastShowsFetched && !fetchNewShows) {
          shows = await getAllShows("shows");
          genres = await getAllGenres("genres");

          if (shows.length > 0 && genres && Object.keys(genres).length > 0) {
            commit("SET_SHOWS", shows);
            commit("SET_GENRES", genres);
            return;
          }
        }
      } catch (err) {
        console.log("Failed to read IndexedDB:", err);
      }
      let page = Math.floor((shows[shows.length - 1]?.id || 0) / 250);
      state.hasMore = true;
      let allPagesFetched = true;
      while (state.hasMore) {
        try {
          const fetched = await dispatch("fetchData", page);

          if (!fetched) state.hasMore = false;
          else page++;
        } catch (err) {
          console.error("Fetch failed:", err);
          state.hasMore = false;
          allPagesFetched = false;
        }
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 50);
        });
      }

      if (allPagesFetched) {
        localStorage.setItem("lastShowsFetched", Date.now());
        await addShows(state.showsById);
        await addGenres(state.showsByGenre);
      }
    },

    async fetchData({ commit }, page) {
      try {
        const response = await tvMazeHTTP.get(`shows?page=${page}`);
        const shows = response.data;

        if (shows.length > 0) {
          let index = 0;
          while (index < shows.length) {
            commit("SET_SHOW_INCREMENTALLY", shows[index]);
            index++;

            if (index % 5 === 0) {
              await new Promise((resolve) => setTimeout(resolve, 0));
            }
          }
          commit("SET_LOADED", true);

          return true;
        } else {
          return false;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return false;
        }
        console.error("Error fetching page", page, error);
        throw error;
      }
    },
    async getShowImages(_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/images`);

        const images = response.data.reduce((images, r) => {
          const image = r.resolutions?.original?.url ?? null;

          if (image && r.type === "poster") images.push(image);
          return images;
        }, []);
        return images;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getShowCast(_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/cast`);

        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getShowSeasons(_, id) {
      try {
        const response = await tvMazeHTTP.get(`shows/${id}/seasons`);
        let seasons = null;
        if (response.data.length > 0)
          seasons = response.data.reduce((seasons, s) => {
            if (s.id) seasons[s.id] = s;
            return seasons;
          }, {});
        return seasons;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getShowEpisodesBySeason(_, id) {
      try {
        const response = await tvMazeHTTP.get(`seasons/${id}/episodes`);

        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async getCastInfo(_, id) {
      try {
        const response = await tvMazeHTTP.get(`characters/${id}`);

        return response.data.image?.medium ?? null;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  },
  modules: {}
});
