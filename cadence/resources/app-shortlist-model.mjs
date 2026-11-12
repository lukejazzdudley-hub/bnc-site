// A documented-workflow filter, not a score or recommendation algorithm.
export function matchesOption(option, selection) {
  const matches = ['device', 'task', 'access'].every(key => {
    const selected = selection[key];
    return selected === 'all' || option[key].includes(selected);
  });
  if (!matches) return false;
  const offerDevices = option.accessDevices?.[selection.access];
  return !offerDevices || selection.device === 'all' || offerDevices.includes(selection.device);
}
