// eslint-disable-next-line object-curly-newline
import { defineComponent, ref, PropType, onMounted, onBeforeUnmount } from 'vue';
import { blockedBody, unBlockedBody } from '@/helpers/blocked-body';


export type IUnModalBase = InstanceType<typeof Component>;

const listeners = {
  list: [] as Array<(event: KeyboardEvent) => void>,

  add(callback: (event: KeyboardEvent) => void) {
    this.list.push(callback);

    if (this.list.length === 1) {
      window.addEventListener('keydown', this.listener);
    }
  },

  remove(callback: (event: KeyboardEvent) => void) {
    const index = this.list.indexOf(callback);
    if (index > -1) this.list.splice(index, 1);

    if (this.list.length === 0) {
      window.addEventListener('keydown', this.listener);
    }
  },

  listener: (event: KeyboardEvent) => {
    // only last !!!
    const callback = listeners.list[listeners.list.length - 1];
    if (callback) callback(event);
  },
};

const TIMEOUT = 200;

const Component = defineComponent({
  name: 'UnModalBase',
  props: {
    noBackdropDismiss: Boolean as PropType<boolean>,
    noRouteDismiss: Boolean as PropType<boolean>,
    noEscDismiss: Boolean as PropType<boolean>,
    maximized: Boolean as PropType<boolean>,
  },
  emits: ['close'],
  setup(props, context) {
    const isActive = ref(true);

    const onClose = (...args: unknown[]) => {
      isActive.value = false;
      setTimeout(() => {
        context.emit('close', ...args);
      }, TIMEOUT);
    };

    const onCloseBackdrop = () => {
      if (props.noBackdropDismiss) return;
      onClose();
    };

    if (!props.noEscDismiss) {
      const closeOnEsc = (event: KeyboardEvent) => {
        // eslint-disable-next-line no-underscore-dangle
        if (event.keyCode === 27) {
          onClose();
        }
      };

      onMounted(() => {
        listeners.add(closeOnEsc);
      });

      onBeforeUnmount(() => {
        listeners.remove(closeOnEsc);
      });
    }

    onMounted(() => blockedBody());
    onBeforeUnmount(() => unBlockedBody());

    return {
      isActive,
      onClose,
      onCloseBackdrop,
    };
  },
});

export default Component;
