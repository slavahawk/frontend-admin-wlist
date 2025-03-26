import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { CountryService } from "w-list-api";
import { type Country } from "wlist-types";
import { handleError } from "@/utils/handleError.ts";
import { useToast } from "primevue/usetoast";
import { checkData } from "w-list-utils";

export const useCountryStore = defineStore("country", () => {
  const countries = ref<Country[]>([]);
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
      const data = await CountryService.getAll();
      checkData(data);
      countries.value = data;
    } catch (err) {
      handleError(err, toast);
    } finally {
      loading.value = false;
    }
  };

  return {
    countries,
    loading,
    fetchCountries,
    countriesOptions,
    getCountryNameById,
  };
});
