import { TimeLogger } from '@/time-logger/time-logger'

const timeLoggers: Map<string, TimeLogger> = new Map<string, TimeLogger>()

export function MainLogMethod(
  target: unknown,
  name: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function(...args: Array<unknown>) {
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

export function MonitorTime(parent?: string) {
  return (target: unknown, name: string, descriptor: PropertyDescriptor) => {
    const original = descriptor.value
    if (typeof original === 'function') {
      descriptor.value = function(...args: Array<unknown>) {
        let newTimeLogger
        if (parent && timeLoggers.has(parent)) {
          const parentLogger: TimeLogger = timeLoggers.get(parent) as TimeLogger
          newTimeLogger = parentLogger.addInnerLogger(name)
        } else {
          newTimeLogger = new TimeLogger(name)
        }
        if (!timeLoggers.has(name)) {
          timeLoggers.set(name, newTimeLogger)
        }

        timeLoggers.get(name)?.initTime()
        const res = original.apply(this, args)
        timeLoggers.get(name)?.addTime()
        return res
      }
    }
    return descriptor
  }
}
