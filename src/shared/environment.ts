export const IS_APPLE = !['win32', 'wow32', 'win64', 'wow64'].some((s) =>
  navigator.userAgent.toLowerCase().includes(s),
);
