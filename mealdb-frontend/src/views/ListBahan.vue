<template>
  <div class="min-h-screen bg-gray-100 p-15">
    <h1 class="text-3xl font-bold text-center mb-6">Ingredients</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center">Loading ingredients...</div>

    <!-- Ingredient Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10"
    >
      <router-link
        v-for="ingredient in ingredients"
        :key="ingredient.idIngredient"
        :to="`/bahan/${ingredient.strIngredient}`"
        class="cursor-pointer bg-white rounded-xl p-4 shadow-md flex flex-col items-center space-y-2 hover:scale-105 no-underline border border-gray-200 transition hover:ring-4 hover:ring-purple-800/40"
      >
        <img
          :src="`https://www.themealdb.com/images/ingredients/${ingredient.strIngredient}.png`"
          :alt="ingredient.strIngredient"
          class="w-20 h-20 object-contain"
        />
        <p class="text-center text-sm font-medium text-gray-700">
          {{ ingredient.strIngredient }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const ingredients = ref([])
const loading = ref(true)

const fetchIngredients = async () => {
  loading.value = true
  try {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
    const data = await res.json()
    ingredients.value = data.meals.slice(0, 30) // Ambil 30 bahan saja untuk demo
  } catch (error) {
    console.error('Failed to fetch ingredients:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchIngredients)
</script>
