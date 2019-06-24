export function getMissingDependencies(available: string[], required: string[]): string[] {
  const availableSet = new Set(available);
  const requiredSet = new Set(required);
  const difference = new Set(Array.from(requiredSet).filter((p) => !availableSet.has(p)));

  return Array.from(difference.values()).sort();
}
