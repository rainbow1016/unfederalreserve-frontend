import StackdriverErrorReporter from 'stackdriver-errors-js';


// eslint-disable-next-line import/no-mutable-exports
export let errorReporter: StackdriverErrorReporter;

export const initErrorReporter = () => {
  if (process.env.NODE_ENV === 'production') {
    errorReporter = new StackdriverErrorReporter();
    errorReporter.start({
      key: process.env.VUE_APP_STACKDRIVER_API_KEY,
      projectId: `${process.env.VUE_APP_SHORT_NAME}-dev`,
      service: 'lending-ts-frontend',
    });
  } else {
    errorReporter = {
      // eslint-disable-next-line no-console
      report: console.error,
    } as StackdriverErrorReporter;
  }
};
