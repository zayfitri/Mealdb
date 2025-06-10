<template>
  <div class="p-4 ml-16 mt-20">
    <div class="text-2xl font-bold mb-4">Kategori Makanan</div>

    <div class="mb-4">
      <label for="kategori" class="block text-sm font-medium text-gray-700">Pilih Kategori</label>
      <select
        v-model="selectedCategory"
        @change="fetchMealsByCategory"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option disabled value="">-- Pilih Kategori --</option>
        <option v-for="kategori in kategoriList" :key="kategori.strCategory" :value="kategori.strCategory">
          {{ kategori.strCategory }}
        </option>
      </select>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <router-link
        v-for="meal in meals"
        :key="meal.idMeal"
        :to="`/meal/${meal.idMeal}`"
        class="bg-white rounded-lg shadow p-4 flex flex-col transition hover:shadow-lg hover:scale-[1.01] duration-200 hover:ring-4 hover:ring-purple-800/40"
      >
        <img :src="meal.strMealThumb" :alt="meal.strMeal" class="w-full h-40 object-cover rounded-md mb-2" />

        <div class="p-2">
          <div class="flex items-center space-x-2 mb-2">
            <span class="material-symbols-outlined text-primary text-2xl">restaurant</span>
            <p class="text-sm font-semibold">Chef Juna</p>
          </div>

          <div class="font-semibold text-lg text-left mb-1">{{ meal.strMeal }}</div>

          <div class="text-sm text-gray-600 flex items-center gap-2 mb-1">
            <img
              v-if="meal.strArea && validCountryCode(meal.strArea)"
              :src="`https://flagcdn.com/w40/${getCountryCode(meal.strArea)}.png`"
              :alt="meal.strArea"
              class="w-5 h-4 object-cover rounded"
            />
            <span>{{ meal.strArea }}</span>
          </div>

          <!-- Icon love di bawah bendera dengan jarak -->
          <div class="flex justify-start">
            <button
              @click.stop.prevent="toggleFavorite(meal.idMeal)"
              class="mt-2 cursor-pointer transition transform hover:scale-110 hover:opacity-80"
            >
              <Heart
                :class="isFavorite(meal.idMeal)
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-400'"
                class="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Heart } from 'lucide-vue-next' // pastikan sudah install: npm i lucide-vue-next

const kategoriList = ref([])
const selectedCategory = ref('')
const meals = ref([])
const favorites = ref([])

const countryCodeMap = {
  "American": "us", "British": "gb", "Canadian": "ca", "Chinese": "cn", "Croatian": "hr", "Dutch": "nl",
  "Egyptian": "eg", "Filipino": "ph", "French": "fr", "Greek": "gr", "Indian": "in", "Irish": "ie",
  "Italian": "it", "Jamaican": "jm", "Japanese": "jp", "Kenyan": "ke", "Malaysian": "my", "Mexican": "mx",
  "Moroccan": "ma", "Polish": "pl", "Portuguese": "pt", "Russian": "ru", "Spanish": "es", "Thai": "th",
  "Tunisian": "tn", "Turkish": "tr", "Vietnamese": "vn",
}

const fetchKategori = async () => {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    const data = await res.json()
    kategoriList.value = data.categories
  } catch (error) {
    console.error("Gagal memuat kategori:", error)
  }
}

const fetchMealsByCategory = async () => {
  if (!selectedCategory.value) return
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory.value}`)
    const data = await res.json()

    const detailPromises = data.meals.map(async (meal) => {
      const resDetail = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
      const detailData = await resDetail.json()
      return detailData.meals[0]
    })

    meals.value = await Promise.all(detailPromises)
  } catch (error) {
    console.error("Gagal memuat makanan:", error)
  }
}

const toggleFavorite = (idMeal) => {
  const existingIndex = favorites.value.findIndex(fav => fav.idMeal === idMeal)
  if (existingIndex !== -1) {
    favorites.value.splice(existingIndex, 1)
  } else {
    const meal = meals.value.find(m => m.idMeal === idMeal)
    if (meal) {
      favorites.value.push(meal)
    }
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value))
}

const isFavorite = (idMeal) => {
  return favorites.value.some(fav => fav.idMeal === idMeal)
}
const validCountryCode = (area) => !!countryCodeMap[area]
const getCountryCode = (area) => countryCodeMap[area] || null

onMounted(() => {
  fetchKategori()
  favorites.value = JSON.parse(localStorage.getItem("favorites")) || []
})
</script>
