function getCurrentTime() {
  return performance.now()
}

export class TimeLogger {
  private readonly identifier: string
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
    if (!this.innerTimes.has(identifier)) {
      this.innerTimes.set(identifier, new TimeLogger(identifier))
    }
    return this.innerTimes.get(identifier) as TimeLogger
  }

  public addTime(): void {
    this.time = this.time + getCurrentTime() - this.refTime
  }

  public logAllTimes(refTime?: number, level = 0) {
    const globalTime = refTime ? refTime : this.time
    this.logTime(globalTime, level)
    this.innerTimes.forEach((value: TimeLogger) => {
      value.logAllTimes(globalTime, level + 1)
    })
  }

  public logTime(refTime: number, level: number) {
    const percentage: string = ((this.time / refTime) * 100).toFixed(2) + '%'
    const toPrint =
      ' '.repeat(level) +
      ' ' +
      this.identifier +
      ' ' +
      this.time +
      ' ' +
      percentage
    console.log(toPrint)
  }
}
