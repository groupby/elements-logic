export function checkDependencies(available: string[], required: string[]) {
  const availableSet = new Set(available);
  const requiredSet = new Set(required);
  const difference = new Set(Array.from(requiredSet).filter((p) => !availableSet.has(p)));

  if (difference.size) {
    throw new Error('Unmet dependencies: ' + Array.from(difference.values()).sort().join(', '));
  }
}
