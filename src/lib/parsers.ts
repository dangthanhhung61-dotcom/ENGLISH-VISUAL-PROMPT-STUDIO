/**
 * Utility parsers for teacher content input
 */

export function parseWordList(input: string): string[] {
  if (!input) return [];
  return input
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function formatWordListToString(words: string[]): string {
  return words.join(', ');
}

export function cleanText(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}
