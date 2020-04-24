function getCurrentTime() {
  return performance.now()
}

export class TimeLogger {
  public readonly identifier: string
  private readonly parent: TimeLogger | null
  private refTime = 0
  private time = 0
  private innerTimes: Map<string, TimeLogger> = new Map<string, TimeLogger>()

  constructor(identifier: string, parent: TimeLogger | null) {
    this.identifier = identifier
    this.parent = parent
  }

  public initTime(): void {
    this.refTime = getCurrentTime()
  }

  public addInnerLogger(childIdentifier: string): TimeLogger {
    if (!this.innerTimes.has(childIdentifier)) {
      this.innerTimes.set(
        childIdentifier,
        new TimeLogger(childIdentifier, this)
      )
    }
    return this.innerTimes.get(childIdentifier) as TimeLogger
  }

  public addTime(): void {
    this.time += getCurrentTime() - this.refTime
  }

  public logAllTimes(refTime?: number) {
    const globalTime = refTime ? refTime : this.time
    this.logTime(globalTime)
    this.innerTimes.forEach((value: TimeLogger) => {
      value.logAllTimes(globalTime)
    })
  }

  public logTime(refTime: number) {
    const percentage: string = ((this.time / refTime) * 100).toFixed(2) + '%'
    const level = this.getLevel()
    const toPrint =
      '  '.repeat(level) +
      ' ' +
      this.identifier +
      ' ' +
      this.time +
      ' ' +
      percentage
    console.log(toPrint)
  }

  public getCompleteIdentifier(): string {
    if (this.parent) {
      return this.parent?.getCompleteIdentifier() + '.' + this.identifier
    } else {
      return this.identifier
    }
  }

  public getLevel(): number {
    if (this.parent) {
      return this.parent?.getLevel() + 1
    } else {
      return 0
    }
  }
}
