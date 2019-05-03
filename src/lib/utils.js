export const alphabeticSort = (a, b) => {
  // Force a to always be a string to avoid errors
  const resolvedA = typeof a === 'string' ? a : '';

  return resolvedA.localeCompare(b, undefined, {
    sensitivity: 'base',
  });
};
