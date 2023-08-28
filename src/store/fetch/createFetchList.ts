import { Ref, ref, watch } from 'vue';
import { useCore } from '@/store/core';


type ICreateFetchListReturn<T, TA extends unknown[]> = {
  isLoading: Ref<boolean>;
  error_message: Ref<string>;
  list: Ref<T[]>;
  fetchList: (...args: TA) => Promise<T[]>;
}

type ICreateFetchDataReturn<T, TA extends unknown[]> = {
  isLoading: Ref<boolean>;
  error_message: Ref<string>;
  data: Ref<T>;
  fetchData: (...args: TA) => Promise<T>;
}

export function createFetch<T, TA extends unknown[]>(
  fn: (...args: TA) => Promise<T[]>,
  isList: true,
  resetOnChangeChainId: boolean,
): () => ICreateFetchListReturn<T, TA>;

export function createFetch<T, TA extends unknown[]>(
  fn: (...args: TA) => Promise<T>,
  isList: false,
  resetOnChangeChainId: boolean,
): () => ICreateFetchDataReturn<T, TA>;

export function createFetch<T, TA extends unknown[]>(
  fn: (...args: TA) => Promise<T[] | T>,
  isList: boolean,
  resetOnChangeChainId = false,
) {
  const { appChainId, wallet } = useCore();
  const data = isList ? ref<T[]>([]) as Ref<T[]> : ref<T>();
  const isLoading = ref(false);
  const error_message = ref('');

  const fetchData = async (...args: TA) => {
    isLoading.value = true;
    error_message.value = '';

    try {
      const result = await fn(...args);
      data.value = result;
      return data.value;
    } catch (error) {
      error_message.value = `ERROR FETCHING ${fn.name} (`;
      return Promise.reject(error);
    } finally {
      isLoading.value = false;
    }
  };

  if (resetOnChangeChainId) {
    watch([appChainId, () => wallet.value.ethAccount], () => {
      data.value = isList ? [] : void 0;
    });
  }

  return () => {
    const result = {
      isLoading,
      error_message,
    };

    return isList
      ? { ...result, list: data, fetchList: fetchData } as ICreateFetchListReturn<T, TA>
      : { ...result, data, fetchData } as ICreateFetchDataReturn<T, TA>;
  };
}
