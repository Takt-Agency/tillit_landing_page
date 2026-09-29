export const ASK_ASSISTANT_EVENT = 'tillit:ask-assistant';

export function askAssistant(question: string) {
  window.dispatchEvent(new CustomEvent<string>(ASK_ASSISTANT_EVENT, { detail: question }));
}
