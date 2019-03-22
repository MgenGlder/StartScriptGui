const state = {
  activeServices: ['hello'],
};

const mutations = {
  UPDATE_ACTIVE_SERVICES(state, payload) {
    console.log('Mutation Payload', payload);
    state.activeServices = payload;
  },
};

const actions = {
  setActiveServices({ commit }, services) {
    console.log('DOING STUFF');
    commit('UPDATE_ACTIVE_SERVICES', services);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
