import { onBeforeMount, onBeforeUnmount } from 'vue';


let count = 0;
const callbacks: ((event: MouseEvent) => void)[] = [];

const onClickAll = (event: MouseEvent) => {
  callbacks.forEach((callback) => callback(event));
};

export const useOutsideClick = (selectors: string, callback: () => void) => {
  const onClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest(selectors)) return;
    callback();
  };

  onBeforeMount(() => {
    callbacks.push(onClick);

    count += 1;
    if (count > 1) return;

    window.addEventListener('click', onClickAll, true);
  });

  onBeforeUnmount(() => {
    const index = callbacks.indexOf(onClick);
    callbacks.splice(index, 1);

    count -= 1;
    if (count > 0) return;

    window.removeEventListener('click', onClickAll);
  });

  return {
    // TODO: start and stop
  };
};
