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
        timeLoggers.forEach((logger: TimeLogger) => logger.logAllTimes())
        timeLoggers.clear()
      }
    }
  }
  return descriptor
}

export function MonitorTime(parentMethod = '') {
  return (
    target: unknown,
    currentMethod: string,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value
    if (typeof original === 'function') {
      descriptor.value = function(...args: Array<unknown>) {
        let newTimeLogger
        if (!timeLoggers.has(currentMethod)) {
          if (parentMethod && timeLoggers.has(parentMethod)) {
            const parentLogger: TimeLogger = timeLoggers.get(
              parentMethod
            ) as TimeLogger
            newTimeLogger = parentLogger.addInnerLogger(currentMethod)
          } else {
            newTimeLogger = new TimeLogger(currentMethod, null)
          }
          timeLoggers.set(currentMethod, newTimeLogger)
        }

        const addingKey: number | undefined = timeLoggers
          .get(currentMethod)
          ?.initTime()
        const res = original.apply(this, args)
        timeLoggers.get(currentMethod)?.addTime(addingKey as number)
        return res
      }
    }
    return descriptor
  }
}

export function BasicMonitorTime(
  target: unknown,
  currentMethod: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value
  if (typeof original === 'function') {
    descriptor.value = function(...args: Array<unknown>) {
      if (!timeLoggers.has(currentMethod)) {
        timeLoggers.set(currentMethod, new TimeLogger(currentMethod, null))
      }
      const addingKey: number | undefined = timeLoggers
        .get(currentMethod)
        ?.initTime()
      const res = original.apply(this, args)
      timeLoggers.get(currentMethod)?.addTime(addingKey as number)
      return res
    }
  }
  return descriptor
}
