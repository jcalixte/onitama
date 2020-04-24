import { TimeLogger } from '@/time-logger/time-logger'

const timeLoggers: Map<string, TimeLogger> = new Map<string, TimeLogger>()

export function MainLogMethod(
  _target: unknown,
  name: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function(...args: Array<any>) {
      try {
        return original.apply(this, args)
      } finally {
        timeLoggers.get(name)?.logAllTimes()
        timeLoggers.clear()
      }
    }
  }
  return descriptor
}

export function MonitorTime(
  _target: unknown,
  name: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function(...args: Array<any>) {
      if (!timeLoggers.has(name)) {
        timeLoggers.set(name, new TimeLogger(name))
      }
      timeLoggers.get(name)?.initTime()
      const res = original.apply(this, args)
      console.log('TOTO')
      timeLoggers.get(name)?.addTime()
      return res
    }
  }
  return descriptor
}
