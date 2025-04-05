import axios from 'axios';

export default {
  state: {
    ads: [
      {
        title: "First",
        desc: "First Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
        id: 1,
        userId: null
      },
      {
        title: "Second",
        desc: "Second Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
        id: 2,
        userId: null
      },
      {
        title: "Third",
        desc: "Third Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
        id: 3,
        userId: null
      },
      {
        title: "Fouth",
        desc: "Fouth Desc",
        promo: true,
        src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
        id: 4,
        userId: null
      }
    ],
    userId: null  // 👈 добавлено сюда
  },

  mutations: {
    createAd(state, payload) {
      state.ads.push(payload);
      console.log("Объявление добавлено:", payload);
      console.log("Все объявления:", state.ads);
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    updateAd(state, {title, desc, id}) {
        const ad = state.ads.find(a => {
            return a.id === id
        })
        ad.title = title
        ad.desc = desc
    }
  },

  actions: {
    createAd({ commit }, payload) {
      return new Promise((resolve, reject) => {
        // Получаем userId залогиненного пользователя
        axios.get('http://localhost:8081/api/users/id', { withCredentials: true })
          .then((response) => {
            // Вставляем userId в payload
            const userId = response.data;  // Предположим, что response.data содержит userId

            // Добавляем userId в payload
            payload.id = Math.random();
            payload.userId = userId;

            // Отправляем данные в commit
            commit('createAd', payload);
            commit('setUserId', userId);  // Сохраняем userId в store

            console.log("Объявление создано:", payload);

            resolve();
          })
          .catch((error) => {
            console.error("Ошибка при получении userId:", error);
            reject(error);
          });
      });
    },
    async updateAd({commit}, {title, desc, id}) {
        commit('cleanError')
        commit('SetLoading', true)
        let isRequestOk = true
        let promise = new Promise(function(resolve) {
            resolve('Done')
        });
        if(isRequestOk) {
            await promise.then(() => {
                commit('updateAd', {title, desc, id})
                commit('setLoading', false)
            })
        } else {
            await promise.then(() => {
                commit('setLoading', false)
                commit('setError', 'Ошибка редактирования объявления')
                throw 'Упс... Ошибка редактирования объявления'
            })
        }
    }
  },

  getters: {
    ads(state) {
      return state.ads;
    },
    promoAds(state) {
      return state.ads.filter(ad => ad.promo);
    },
    myAds(state, getters) {
        const user = getters.user;  // Получаем текущего пользователя из Vuex
  
        console.log("Текущий пользователь:", user);
  
        if (!user) {
          return [];
        }
  
        const myAds = state.ads.filter(ad => ad.userId === user.id);
        console.log("Мои объявления:", myAds);
        return myAds;
      },
    adById(state) {
      return id => {
        return state.ads.find(ad => ad.id == id);
      };
    },
    userId(state) {
      return state.userId;
    }
  }
};
