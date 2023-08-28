import { ref, onBeforeMount, onBeforeUnmount } from 'vue';


const BREAKPOINTS = {
  TABLET: 768,
  DESKTOP: 980,
  DESKTOP_MD: 1024,
};


let count = 0;
const isTablet = ref(false);
const isDesktop = ref(false);
const isDesktopMD = ref(false);

export const useBreakpoints = () => {
  const onResize = () => {
    isTablet.value = window?.innerWidth < BREAKPOINTS.TABLET;
    isDesktop.value = window?.innerWidth >= BREAKPOINTS.DESKTOP;
    isDesktopMD.value = window?.innerWidth >= BREAKPOINTS.DESKTOP_MD;
  };

  onBeforeMount(() => {
    count += 1;
    if (count > 1) return;

    onResize();
    window.addEventListener('resize', onResize, { passive: true });
  });

  onBeforeUnmount(() => {
    count -= 1;
    if (count > 0) return;
    window.removeEventListener('resize', onResize);
  });

  return {
    isTablet,
    isDesktop,
    isDesktopMD,
  };
};
