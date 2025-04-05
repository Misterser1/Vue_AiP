<template>
<v-app>
  <v-navigation-drawer app v-model="drawer">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          КИПУ
        </v-list-item-title>
          <v-list-item-subtitle>
          Учебный проект
          </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
      v-for="link in links"
      :key="link.title"
      :to="link.url">
        <template v-slot:prepend>
          <v-icon :icon="link.icon"></v-icon>
        </template>
        <v-list-item-title>{{link.title}}</v-list-item-title>
      </v-list-item>
      <v-list-item
      @click="logout"
      v-if="isAuthenticated">
        <template v-slot:prepend>
        <v-icon icon="mdi-exit-to-app"></v-icon>
        </template>
        <v-list-item-title>logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar app dark color="primary">
  <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
  <v-toolbar-title>
    <v-btn to="/">
      Home
    </v-btn>
  </v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items class="hidden-sm-and-down">
    <v-btn 
    v-for="link in links"
    :key="link.title"
    :to="link.url">
      <v-icon
          start
          :icon="link.icon"
      ></v-icon>
      {{link.title}}
    </v-btn>
    <v-btn @click="logout"
    v-if="isAuthenticated">
    <v-icon
    start
    icon="mdi-exit-to-app"
    ></v-icon>
    Logout
    </v-btn>
  </v-toolbar-items>
  </v-app-bar>
  <v-main>
    <router-view></router-view>
  </v-main>
    <v-snackbar
      v-model="error"
      multi-line
      :timeout="2000"
      color="primary">
      {{ error }}
      <template v-slot:actions>
        <v-btn
        variant="text"
        @click="closeError"
        >Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
  return {
    drawer: false
  }
},
  computed: {
  error() {
    return this.$store.getters.error;
  },
  isAuthenticated() {
    return this.$store.getters.isAuthenticated;
  },
  links() {
    if (this.isAuthenticated) {
      return [
        { title: "Orders", icon: "mdi-bookmark-multiple-outline", url: "/orders" },
        { title: "New ad", icon: "mdi-note-plus-outline", url: "/new" },
        { title: "My ads", icon: "mdi-view-list-outline", url: "/list" },
      ];
    } else {
      return [
        { title: "Login", icon: "mdi-lock", url: "/login" },
        { title: "Registration", icon: "mdi-face", url: "/registration" }
      ];
    }
  }
},
  methods: {
    closeError(){
      this.$store.dispatch('clearError')
    },
    logout(){
      this.$store.dispatch('logoutUser')
      this.$router.push("/login")
    }
  },

  mounted() {
    // Восстановление состояния из localStorage при запуске приложения
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.$store.commit('setUser', parsedUser);  // Восстанавливаем пользователя в Vuex
    }
  }
}
</script>