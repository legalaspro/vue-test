import { createStore } from 'vuex';
import EventService from '@/services/EventService';

export default createStore({
  state: {
    user: 'Adam Jahr',
    events: [], // new events array
    totalEvents: 0,
    event: {},
  },
  mutations: {
    ADD_EVENT(state, event) {
      // our first mutation
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_TOTAL_EVENTS(state, totalEvents) {
      state.totalEvents = totalEvents;
    },
    SET_EVENT(state, event) {
      state.event = event;
    },
  },
  actions: {
    createEvent({ commit }, event) {
      EventService.postEvent(event)
        .then(() => {
          // add event to Vuex state
          commit('ADD_EVENT', event);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchEvent({ commit }, id) {
      return EventService.getEvent(id)
        .then((response) => {
          commit('SET_EVENT', response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            return {
              name: '404Resource',
              params: { resource: 'event' },
            };
          } else {
            return { name: 'NetworkError' };
          }
        });
    },
    fetchEvents({ commit }, { perPage, page }) {
      return EventService.getEvents(perPage, page || 1).then((response) => {
        commit('SET_EVENTS', response.data);
        commit('SET_TOTAL_EVENTS', response.headers['x-total-count']);
      });
    },
  },
  modules: {},
});
