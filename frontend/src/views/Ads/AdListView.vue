<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" lg="6">
        <h1 class="test--secondary mb-3 mt-3">My ads</h1>
        
        <!-- Проверка на наличие пользователя -->
        <div v-if="user && myAds.length > 0">
          <v-card v-for="ad in myAds" :key="ad.id" class="mb-3" max-width="1000">
            <v-row>
              <v-col xs="4">
                <v-img :src="ad.src" height="175px" cover></v-img>
              </v-col>
              <v-col xs="8">
                <h2 class="text--primary">{{ ad.title }}</h2>
                <p style="height: 85px; overflow: hidden; text-overflow: ellipsis;">
                  {{ ad.desc }}
                </p>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" variant="text" :to="'/ad/' + ad.id">
                    Open
                  </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </div>
        
        <!-- Сообщение, если нет объявлений -->
        <div v-else>
          <p v-if="user">You don't have any ads yet. Start by creating one!</p>
          <p v-else>Loading user data...</p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  computed: {
    myAds() {
      return this.$store.getters.myAds;
    },
    user() {
      return this.$store.getters.user; // Получаем текущего пользователя
    }
  },
  created() {
    // Если пользователь еще не загружен, загружаем его из localStorage
    if (!this.user && localStorage.getItem('user')) {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      this.$store.commit('user/setUser', savedUser);
    }
  }
}
</script>
