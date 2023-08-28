import './styles.scss';
import VueNotification from '@kyvg/vue3-notification';
import { IInitPlugin } from '@/types/common.d';

// TODO: make it async

export const initPlugin: IInitPlugin = (app) => {
  app.use(VueNotification);
};
