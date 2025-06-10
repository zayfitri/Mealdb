<template>
  <div class="min-h-screen bg-white p-15">
    <div class="max-w-5xl mx-auto bg-white shadow-md p-6 rounded-lg">
      <!-- Gambar & Nama Resep -->
      <div class="flex flex-col md:flex-row items-start gap-6">
        <img
          :src="mealDetail?.strMealThumb"
          :alt="mealDetail?.strMeal"
          class="w-72 h-72 rounded-xl object-cover shadow"
        />
        <div>
          <h1 class="text-3xl font-bold text-purple-700">{{ mealDetail?.strMeal }}</h1>
          <div class="flex items-center text-sm mt-2 text-gray-600 gap-2">
            <img
              src="https://i.pravatar.cc/40"
              alt="Chef Juna"
              class="w-6 h-6 rounded-full object-cover"
            />
            <span>Chef Juna</span>
            <span class="mx-2">•</span>
            {{ mealDetail?.strArea }}
          </div>
          <p class="mt-4 text-gray-700 leading-relaxed">
            {{ mealDetail?.strMeal }} adalah salah satu makanan khas yang terkenal dengan cita rasa yang lezat. Berikut bahan-bahan dan langkah-langkah pembuatannya.
          </p>
        </div>
      </div>

      <!-- Bahan -->
      <div class="mt-8">
        <h2 class="text-lg font-bold bg-purple-100 text-purple-700 px-4 py-2 rounded-t-md inline-bloc k">
          Bahan
        </h2>
        <div class="border rounded-md p-4 bg-gray-50">
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(ingredient, index) in ingredients" :key="index">
              {{ ingredient }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Langkah-langkah -->
      <div class="mt-6">
        <h2 class="text-lg font-bold bg-yellow-100 text-yellow-700 px-4 py-2 rounded-t-md inline-block">
          Langkah - Langkah
        </h2>
        <div class="border rounded-md p-4 bg-gray-50">
          <p class="text-sm leading-relaxed whitespace-pre-line">{{ mealDetail?.strInstructions }}</p>
        </div>
      </div>

      <!-- Tombol Video dan Kembali -->
      <div class="flex flex-col sm:flex-row gap-4 mt-6">
        <a
          :href="mealDetail?.strYoutube"
          target="_blank"
          class="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-md shadow hover:bg-purple-700 text-sm text-center transition flex items-center gap-2 justify-center"
        >
          <PlayCircle class="w-5 h-5" /> Tonton Video Tutorial
        </a>

        <button
          @click="goBack"
          class="cursor-pointer bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-md text-sm shadow transition flex items-center gap-2 justify-center"
        >
          <ArrowLeft class="w-5 h-5" /> Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PlayCircle, ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const mealDetail = ref({});
const ingredients = ref([]);

const fetchMealDetail = async () => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  mealDetail.value = data.meals[0];

  ingredients.value = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDetail.value[`strIngredient${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.value.push(ingredient.trim());
    }
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/home');
  }
};

onMounted(fetchMealDetail);
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1;
}
</style>
