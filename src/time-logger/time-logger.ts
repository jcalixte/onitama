function getCurrentTime() {
  return performance.now()
}

export class TimeLogger {
  private identifier = ''
  private refTime = 0
  private time = 0
  private innerTimes: Map<string, TimeLogger> = new Map<string, TimeLogger>()

  constructor(identifier: string) {
    this.identifier = identifier
  }

  public initTime(): void {
    this.refTime = getCurrentTime()
  }

  public addInnerLogger(identifier: string): TimeLogger {
    const innerLogger: TimeLogger = new TimeLogger(identifier)
    this.innerTimes.set(identifier, innerLogger)
    return innerLogger
  }

  public addTime(): void {
    this.time = this.time + getCurrentTime()
  }

  public logAllTimes(refTime?: number) {
    const globalTime = refTime ? refTime : this.time
    this.logTime(this.time)
    this.innerTimes.forEach((value: TimeLogger) => {
      value.logAllTimes(globalTime)
    })
  }

  public logTime(refTime: number) {
    const percentage: string = ((this.time / refTime) * 100).toFixed(2) + '%'
    console.log(this.identifier, this.time, percentage)
  }
}
