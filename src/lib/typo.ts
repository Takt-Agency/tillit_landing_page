const NBSP = ' ';

/** French typography: keep ? ! : ; » glued to the previous word and « to the next one. */
export function fr(text: string): string {
  return text.replace(/ ([?!:;»])/g, `${NBSP}$1`).replace(/« /g, `«${NBSP}`);
}
