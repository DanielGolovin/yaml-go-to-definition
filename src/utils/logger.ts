export interface ILogger {
  startPerformanceLog: Console["time"];
  endPerformanceLog: Console["timeEnd"];
  log: Console["log"];
}

export class Logger implements ILogger {
  constructor(private console?: Console) {}

  startPerformanceLog(...args: any[]): void {
    this.console?.time(...args);
  }

  endPerformanceLog(...args: any[]): void {
    this.console?.timeEnd(...args);
  }

  log(...args: any[]): void {
    this.console?.log(...args);
  }
}
