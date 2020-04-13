/* eslint-disable @typescript-eslint/no-explicit-any */
type Key = 'update'

class BusService {
  public listeners = new Map<Key, Array<(...params: any[]) => void>>()

  public on(key: Key, callback: (...params: any[]) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [callback])
    } else {
      this.listeners.get(key)?.push(callback)
    }
  }

  public off(key: Key, callback: (...params: any[]) => void) {
    if (!this.listeners.has(key)) {
      return
    }
    const callbacks =
      this.listeners.get(key)?.filter((cb) => cb !== callback) ?? []
    this.listeners.set(key, callbacks)
  }

  public emit(key: Key, ...params: any[]) {
    this.listeners.get(key)?.forEach((callback) => callback(...params))
  }
}

export const busService = new BusService()
