<template>
  <div class="p-15 min-h-screen bg-gray-100">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-purple-700">
        Resep dengan bahan: "{{ route.params.name }}"
      </h1>
      <router-link
        to="/bahan"
        class="text-sm bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition"
      >
        ⬅ Kembali ke Daftar Bahan
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center">Loading...</div>

    <!-- Resep Ditemukan -->
    <div
      v-else-if="meals.length"
      class="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="meal in meals"
        :key="meal.idMeal"
        @click="goToMealDetail(meal.idMeal)"
        class="cursor-pointer bg-white rounded-lg shadow p-4 flex flex-col transition hover:shadow-lg hover:scale-[1.01] duration-200 hover:ring-4 hover:ring-purple-800/40 relative"
      >
        <img
          :src="meal.strMealThumb"
          :alt="meal.strMeal"
          class="w-full h-32 object-cover rounded-md"
        />
        <p class="text-center text-sm font-medium text-gray-800">
          {{ meal.strMeal }}
        </p>

        <!-- Favorite Icon -->
        <p
          class="absolute top-2 right-2 text-xl cursor-pointer"
          :class="isFavorite(meal.idMeal) ? 'text-red-600' : 'text-gray-500'"
          @click.stop="toggleFavorite(meal)"
        >
          {{ isFavorite(meal.idMeal) ? '❤️' : '🤍' }}
        </p>
      </div>
    </div>

    <!-- Tidak Ada Resep -->
    <div v-else class="text-center text-gray-500">
      Tidak ada resep ditemukan untuk bahan "{{ route.params.name || searchQuery }}".
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router' // ⬅️ Tambahan

const route = useRoute()
const router = useRouter() // ⬅️ Tambahan

const meals = ref([])
const loading = ref(true)
const searchQuery = ref('')
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"))

const fetchMeals = async () => {
  loading.value = true
  try {
    const query = route.params.name || searchQuery.value
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`)
    const data = await res.json()
    meals.value = data.meals || []
  } catch (error) {
    console.error('Error fetching meals:', error)
    meals.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchMeals)
watch(() => route.params.name, fetchMeals)
watch(searchQuery, fetchMeals)

// 🧡 FAVORITE Logic
const toggleFavorite = (meal) => {
  const index = favorites.value.findIndex(f => f.idMeal === meal.idMeal)
  if (index !== -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(meal)
  }
  localStorage.setItem("favorites", JSON.stringify(favorites.value))
}

const isFavorite = (idMeal) => {
  return favorites.value.some(f => f.idMeal === idMeal)
}

const goToMealDetail = (idMeal) => {
  router.push(`/meal/${idMeal}`)
}
</script>
