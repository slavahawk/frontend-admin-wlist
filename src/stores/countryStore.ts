import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { CountryService, type Country } from "w-list-api";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";

export const useCountryStore = defineStore("country", () => {
  const countries = ref<Country[]>([]);
  const selectedCountry = ref<Country | null>(null);
  const loading = ref(false);
  const toast = useToast();

  const countriesOptions = computed(() => {
    return countries.value.map((country) => ({
      value: country.id,
      label: country.name,
    }));
  });

  const getCountryNameById = (countryId: number): string | null =>
    countries.value.find((c: Country) => c.id === countryId)?.name ?? null;

  const fetchCountries = async () => {
    loading.value = true;

    try {
      countries.value = await CountryService.getAll();
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  const fetchCountryById = async (id: number) => {
    loading.value = true;

    try {
      selectedCountry.value = await CountryService.getById(id);
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  const clearSelectedCountry = () => {
    selectedCountry.value = null;
  };

  return {
    countries,
    selectedCountry,
    loading,
    fetchCountries,
    fetchCountryById,
    clearSelectedCountry,
    countriesOptions,
    getCountryNameById,
  };
});
