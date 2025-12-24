import { createStore } from "vuex";
import axios from "axios";
const tvMazeHTTP = axios.create({
  baseURL: "https://api.tvmaze.com/",
});
export default createStore({
  state: {
    showsByGenre: {},
    showsById: {},
  },
  getters: {
    getGenres: (state) => Object.keys(state.showsByGenre),
    getShowById: (state) => (id) => state.showsById[id],
    getShowsByGenre: (state) => (genre) =>
      state.showsByGenre[genre].sort(
        (a, b) =>
          state.showsById[b].rating.average - state.showsById[a].rating.average
      ),
  },
  mutations: {
    SET_SHOWS(state, payload) {
      payload.forEach((show) => {
        state.showsById[show.id] = show;
        show.genres.forEach((genre) => {
          if (!state.showsByGenre[genre]) state.showsByGenre[genre] = [];
          state.showsByGenre[genre].push(show.id);
        });
      });
      // console.log(state.showsById)
      // console.log(state.showsByGenre)
    },
  },
  actions: {
    async getShows({ commit }) {
      try {
        const response = await tvMazeHTTP.get("shows");
        commit("SET_SHOWS", response.data);

        return response;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  modules: {},
});
