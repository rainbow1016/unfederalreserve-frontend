/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable vue/one-component-per-file */

// eslint-disable-next-line object-curly-newline
import {
  App,
  DefineComponent,
  Component,
  ComponentInternalInstance,
  onBeforeUnmount,

  createApp,
  defineAsyncComponent,
  getCurrentInstance,
  h,
} from 'vue';
import { IUnModalBase } from './UnModalBase.component';


// From https://git.io/JlvW9
function createChildApp(appCfg: Component, parentApp: App) {
  const app = createApp(appCfg);

  app.config.globalProperties = parentApp.config.globalProperties;

  // @ts-ignore TODO: for reload
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-unused-vars
  const { reload, ...appContext } = parentApp._context;
  // eslint-disable-next-line no-underscore-dangle
  Object.assign(app._context, appContext);

  return app;
}

const UnModalBase = defineAsyncComponent(() => import(
  /* webpackChunkName: "UnModalBase" */
  './UnModalBase.vue'
));

const MODAL_PARENT_KEY = '__modal_parent__';

const useModalInner = <
  IPropsData extends Record<string, unknown> = Record<string, unknown>,
  IReturnData = boolean
  >(
    asyncComponent: DefineComponent | ReturnType<typeof defineAsyncComponent>,
    modalPropsData: IUnModalBase['$props'],
    defaultPopsData: Record<string, unknown>,
    instance: ComponentInternalInstance,
  ) => {
  let isMounted = false;
  let onCloseModal = (result?: IReturnData) => {
    if (!isMounted) return;
    // eslint-disable-next-line no-console
    console.warn('[App warn]: empty onCloseModal', result);
  };

  const createAppModal = (
    defaultPopsData_2: typeof defaultPopsData,
    propsData: IPropsData,
  ) => {
    const appModal = createChildApp({
      name: 'UnModal',
      setup() {
        const childProps = {
          ...defaultPopsData_2,
          ...propsData,
          [MODAL_PARENT_KEY]: instance,
          onClose: onCloseModal,
        };

        const component = asyncComponent as unknown as DefineComponent;
        const getChildren = () => h(component, childProps);

        return () => h(UnModalBase, {
          ...modalPropsData,
          onClose: onCloseModal,
        }, { default: getChildren });
      },
    }, instance.appContext.app);

    return appModal;
  };

  const show = (
    propsData: IPropsData,
  ) => {
    // eslint-disable-next-line no-underscore-dangle
    const parentNode = instance.appContext.app._container as HTMLElement;
    const element = document.createElement('div');
    element.classList.add('app-modal-root');
    parentNode.appendChild(element);

    return new Promise<IReturnData | undefined>((resolve) => {
      const appModal = createAppModal(defaultPopsData, propsData);
      isMounted = true;

      onCloseModal = (result?: IReturnData) => {
        try {
          appModal.unmount();
        } catch {
          // eslint-disable-next-line no-empty
        }

        try {
          element.parentNode?.removeChild(element);
        } catch {
          // eslint-disable-next-line no-empty
        }

        resolve(result);
      };

      appModal.mount(element);

      // @ts-ignore TODO
      // eslint-disable-next-line @typescript-eslint/no-use-before-define, no-underscore-dangle
      result._appModal = appModal;
    });
  };

  // on hook @vnode-before
  onBeforeUnmount(() => {
    onCloseModal();
  }, instance);

  const result = {
    show,
    // TODO: close modal by instance
    hide: () => onCloseModal(),
  };

  return result;
};

export const useModal = <
  IPropsData extends Record<string, unknown> = Record<string, unknown>,
  IReturnData = boolean
  >(
    asyncComponent: DefineComponent | ReturnType<typeof defineAsyncComponent>,
    modalPropsData: IUnModalBase['$props'] = {},
    defaultPopsData: Record<string, unknown> = {},
    parent: ComponentInternalInstance | null = null,
  ) => {
  let instance = (parent || getCurrentInstance()) as ComponentInternalInstance;

  {
    // Вызываем модалку в модалке? Тогда нам нужен instance.parent
    let parent2: ComponentInternalInstance | null = instance;
    while (parent2) {
      if (parent2?.attrs[MODAL_PARENT_KEY]) {
        instance = parent2?.attrs[MODAL_PARENT_KEY] as ComponentInternalInstance;
        break;
      }
      parent2 = parent2?.parent;
    }
  }

  if (!instance) {
    throw new Error('useModal: needs args.parent or use in hooks');
  }

  return useModalInner<IPropsData, IReturnData>(
    asyncComponent,
    modalPropsData,
    defaultPopsData,
    instance,
  );
};
