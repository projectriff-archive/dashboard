export const status = {
  Error: 'Error',
  Restarted: 'Restarted',
  Startup: 'Startup',
  Shutdown: 'Shutdown',
  Running: 'Running',
  Unknown: 'Unknown'
};

export const statusOrder = [
  status.Error,
  status.Restarted,
  status.Startup,
  status.Shutdown,
  status.Running,
  status.Unknown
]

// TODO extreamly dodgy, someone must have good health status logic we can use
export function check({ metadata, status: { phase, conditions, containerStatuses } }) {
  if (metadata.deletionTimestamp) return 'Shutdown';
  if (phase === 'Pending') return 'Startup';
  if (phase === 'Running') {
    if (conditions.find(condition => condition.type ==='Ready').status === 'True') {
      if (containerStatuses && containerStatuses.some(status => status.restartCount > 0)) {
        return 'Restarted';
      } else {
        return 'Running';
      }
    } else {
      return 'Error';
    }
  }
  return 'Unknown';
}
