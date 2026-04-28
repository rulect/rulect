/// export const isUrl = (s) => s.startsWith("http://") || s.startsWith("https://");
export function isUrl(input: string) {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(input);
}
