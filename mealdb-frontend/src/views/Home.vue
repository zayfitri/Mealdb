<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <div class="flex-1 mt-16">
      <!-- Search and Header -->
      <div class="bg-orange-100 p-6 text-center">
        <h1 class="text-5xl font-bold text-purple-700">Yuk Masak Resep Kesukaanmu 🍽️</h1>
        <div class="flex justify-center mt-5 space-x-2">
          <div class="relative w-full max-w-lg">
            <LucideSearch class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              v-model="searchQuery"
              @keyup.enter="searchMeals"
              type="text"
              placeholder="Cari Resep..."
              class="w-full px-10 py-2 border-2 border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <button
            @click="getRandomMeal"
            class="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 cursor-pointer"
          >
            🎲 Random Meal
          </button>
        </div>
      </div>

      <!-- Meal Grid -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="meal in meals"
          :key="meal.idMeal"
          @click="goToMealDetail(meal.idMeal)"
          class="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 transition transform hover:scale-[1.01] hover:ring-4 hover:ring-purple-800/40"
        >
          <figure>
            <img :src="meal.strMealThumb" :alt="meal.strMeal" class="w-full h-40 object-cover" />
          </figure>
          <div class="p-4">
            <div class="flex items-center space-x-2">
              <span class="material-symbols-outlined text-primary text-2xl">restaurant</span>
              <p class="text-sm font-semibold">Chef Juna</p>
            </div>
            <h2 class="text-lg font-bold mt-2">{{ meal.strMeal }}</h2>
            <p class="text-sm text-gray-500 flex items-center mt-1">
              <img
                :src="`https://flagcdn.com/w40/${getCountryCode(meal.strArea)}.png`"
                class="inline-block h-4 w-6 mr-1"
                :alt="meal.strArea"
                @error="handleFlagError"
              />
              {{ meal.strArea }}
            </p>

            <!-- Ikon Favorite -->
            <div class="mt-4">
              <LucideHeart
                :class="[
                  'w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110',
                  isFavorite(meal.idMeal) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                ]"
                @click.stop="toggleFavorite(meal)"
                style="cursor: pointer;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LucideSearch, LucideHeart } from "lucide-vue-next";

export default {
  components: {
    LucideSearch,
    LucideHeart,
  },
  data() {
    return {
      searchQuery: "",
      meals: [],
      isLoading: true,
      favorites: JSON.parse(localStorage.getItem("favorites")) || [],
      countryCodes: {
        American: "us",
        British: "gb",
        Canadian: "ca",
        Chinese: "cn",
        Dutch: "nl",
        Egyptian: "eg",
        French: "fr",
        Greek: "gr",
        Indian: "in",
        Irish: "ie",
        Italian: "it",
        Jamaican: "jm",
        Japanese: "jp",
        Kenyan: "ke",
        Malaysian: "my",
        Mexican: "mx",
        Moroccan: "ma",
        Russian: "ru",
        Spanish: "es",
        Thai: "th",
        Tunisian: "tn",
        Turkish: "tr",
        Vietnamese: "vn",
        Unknown: "xx",
      },
    };
  },
  methods: {
    async searchMeals() {
      if (!this.searchQuery) return;
      try {
        this.isLoading = true;
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.searchQuery}`
        );
        const data = await res.json();
        this.meals = data.meals || [];
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchDefaultMeals() {
      try {
        this.isLoading = true;
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=chicken");
        const data = await res.json();
        this.meals = data.meals || [];
      } catch (error) {
        console.error("Error fetching default meals:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async getRandomMeal() {
      try {
        this.isLoading = true;
        const randomMeals = [];

        for (let i = 0; i < 8; i++) {
          const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
          const data = await res.json();
          if (data.meals && data.meals.length > 0) {
            const meal = data.meals[0];
            if (!randomMeals.find(m => m.idMeal === meal.idMeal)) {
              randomMeals.push(meal);
            } else {
              i--;
            }
          }
        }

        this.meals = randomMeals;
      } catch (error) {
        console.error("Error fetching random meals:", error);
      } finally {
        this.isLoading = false;
      }
    },

    toggleFavorite(meal) {
      const index = this.favorites.findIndex(fav => fav.idMeal === meal.idMeal);
      if (index === -1) {
        this.favorites.push(meal);
      } else {
        this.favorites.splice(index, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },

    isFavorite(idMeal) {
      return this.favorites.some(meal => meal.idMeal === idMeal);
    },

    getCountryCode(area) {
      return this.countryCodes[area] || "xx";
    },

    handleFlagError(event) {
      event.target.src = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Earth_flag_PD.jpg";
    },

    goToMealDetail(idMeal) {
      this.$router.push(`/meal/${idMeal}`);
    },
  },

  async mounted() {
    await this.fetchDefaultMeals();
  },
};
</script>
