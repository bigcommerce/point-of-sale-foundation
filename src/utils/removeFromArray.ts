export const removeFromArray = (arr: string[], value: string) => {
  const index = arr.findIndex(v => v === value);

  if (index === -1) return;

  arr.splice(index, 1);
};
