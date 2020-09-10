
export function escapeRegexp(queryToEscape: string): string {
  return queryToEscape.toString().replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
}
