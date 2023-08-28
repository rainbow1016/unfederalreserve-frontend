import VueSvgInlinePlugin from 'vue-svg-inline-plugin';
import { IInitPlugin } from '@/types/common.d';


export const initPlugin: IInitPlugin = (app) => {
  app.use(VueSvgInlinePlugin);
};
