export default function makeAuthActions(feathersClient, globalModels) {
  return {
    authenticate(store, data) {
      const { commit, state } = store;

      commit("setAuthenticatePending");
      if (state.errorOnAuthenticate) {
        commit("clearAuthenticateError");
      }

      let promise = !!data
        ? feathersClient.authenticate(data)
        : feathersClient.reAuthenticate();
      return promise
        .then((response) => {
          if (response.accessToken) {
            commit("setAccessToken", response.accessToken);
            commit("setPayload", response);
            commit("setUser", response.user);
            commit("unsetAuthenticatePending");

            // If there was not an accessToken in the response, allow the response to pass through to handle two-factor-auth
          } else {
            return response;
          }
        })
        .catch((error) => {
          commit("setAuthenticateError", error);
          commit("unsetAuthenticatePending");
          return Promise.reject(error);
        });
    },

    logout({ commit }) {
      commit("setLogoutPending");
      return feathersClient
        .logout()
        .then((response) => {
          commit("logout");
          commit("unsetLogoutPending");
          return response;
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    },
  };
}
