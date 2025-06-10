<template>
  <div class="min-h-screen bg-orange-50 p-15">
    <h1 class="text-4xl font-bold text-center text-purple-700 mb-6">❤️ Resep Favoritmu</h1>

    <div v-if="favorites.length === 0" class="text-center text-gray-500">
      Belum ada resep favorit. Tambahkan dulu yuk!
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="meal in favorites"
        :key="meal.idMeal"
        @click="goToMealDetail(meal.idMeal)"
        class="bg-white rounded-lg shadow p-4 flex flex-col transition hover:shadow-lg hover:scale-[1.01] duration-200 hover:ring-4 hover:ring-purple-800/40"
      >
        <img :src="meal.strMealThumb" :alt="meal.strMeal" class="w-full h-40 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-semibold">{{ meal.strMeal }}</h2>
          <p class="text-sm text-gray-500">{{ meal.strArea }}</p>

          <button
            @click.stop="removeFromFavorite(meal.idMeal)"
            class="mt-3 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 cursor-pointer"
          >
            Hapus dari Favorit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      favorites: [],
    };
  },
  methods: {
    goToMealDetail(idMeal) {
      this.$router.push(`/meal/${idMeal}`);
    },
    removeFromFavorite(idMeal) {
      this.favorites = this.favorites.filter((meal) => meal.idMeal !== idMeal);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
  },
  mounted() {
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  },
};
</script>
