import { Plugin } from 'vue';
import { IInitPlugin } from '@/types/common.d';

import { initPlugin as initPluginNotify } from './notify';
import { initPlugin as initPluginSvgSprites } from './svg-sprites';
import { initErrorReporter } from './errorReporter';


initErrorReporter();

const install: IInitPlugin = (app, options) => {
  initPluginNotify(app, options);
  initPluginSvgSprites(app, options);
};

export const initPlugins: Plugin = {
  install,
};
