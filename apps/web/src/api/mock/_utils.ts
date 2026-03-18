export const delay = (ms = 800) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))
