import axios from 'axios';

export default {
    state: {
        user: null,
        isAuthenticated: false,   // <-- Добавили флаг
        error: null
    },
    mutations: {
        setUser(state, payload){
            console.log(payload)
            state.user = payload
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify(payload));
        },
        setError(state, payload) {
            state.error = payload;
        },
        clearError(state) {
            state.error = null;
        },
        setAuthenticated(state, payload){
            state.isAuthenticated = payload;
        },
        loadUserFromLocalStorage(state) {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                state.user = JSON.parse(savedUser);
                state.isAuthenticated = true;
            }
        }
    },
    actions: {
       registerUser({commit}, {email, password}){
            commit('clearError')
            commit('setLoading', true)

           axios.post('http://localhost:8081/api/users/registration', {email, password}, { withCredentials: true })
           .then(() => {
            commit('setUser', { email, password });
            commit('setLoading', false);

            commit('setAuthenticated', true);

            axios.get('http://localhost:8081/api/users/id', { withCredentials: true })
            .then(response => {
                const userId = response.data;
                commit('setUser', { email, password, id: userId });
                localStorage.setItem('user', JSON.stringify({ email, password, id: userId }));
            });
            })
            .catch(error => {
                commit('setLoading', false);
                const errorMessage = error.response && error.response.data ? error.response.data : error.message;
                commit('setError', errorMessage);
            })
        },
        loginUser({commit}, {email, password}) {
            commit('clearError')
            commit('setLoading', true)
            
            return axios.post('http://localhost:8081/api/users/login', { email, password }, { withCredentials: true })  // <-- ДОБАВЬ return
                .then(() => {
                    commit('setUser', { email, password });
                    commit('setLoading', false);

                    commit('setAuthenticated', true);

                    axios.get('http://localhost:8081/api/users/id', { withCredentials: true })
                    .then(response => {
                        const userId = response.data;
                        commit('setUser', { email, password, id: userId });
                        localStorage.setItem('user', JSON.stringify({ email, password, id: userId }));
                    });
                })
                .catch(error => {
                    commit('setLoading', false);
                    const errorMessage = error.response && error.response.data 
                        ? error.response.data 
                        : error.message;
                    commit('setError', errorMessage);
                    //throw new Error(errorMessage);   // <-- ПРОБРОС ОШИБКИ
                });
        },
        logoutUser({ commit }) {
            return axios.post('http://localhost:8081/api/users/logout')
              .then(() => {
                commit('setUser', null);
                commit('setAuthenticated', false);

                localStorage.removeItem('user');

                const savedUser = localStorage.getItem('user');
                console.log('Saved user after logout:', savedUser); 
                 // Удаляем cookies (если используются сессии)
                 document.cookie = "JSESSIONID=; Max-Age=0; path=/; domain=localhost; HttpOnly; SameSite=Lax";
                 console.log(document.cookie);
              })
              .catch(error => {
                console.error("Ошибка при логауте", error);
              });
          }
    },
    getters: {
        user(state){
            return state.user
        },
        error(state) {
            return state.error;
        },
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        created() {
            // Восстанавливаем пользователя из localStorage при перезагрузке страницы
            this.commit('loadUserFromLocalStorage');
        }
    }
}