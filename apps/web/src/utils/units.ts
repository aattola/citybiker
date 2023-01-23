export const convertTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time - hours * 3600) / 60)
  const seconds = time - hours * 3600 - minutes * 60
  if (hours) return `${hours}h ${minutes}m ${seconds}s`
  return `${minutes}m ${seconds}s`
}

export const convertDistance = (distance: number | null) => {
  if (distance === null) return 0

  return (distance / 1000).toFixed(1)
}
