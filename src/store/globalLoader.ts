import { ref } from 'vue';


const isLoading = ref(false);

const show = () => {
  isLoading.value = true;
};

const hide = () => {
  isLoading.value = false;
};

const toggle = (value = !isLoading.value) => {
  isLoading.value = value;
};

export const useGlobalLoader = () => ({
  isLoading,
  show,
  hide,
  toggle,
});
