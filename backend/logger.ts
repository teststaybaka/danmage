import { Log, Logging } from "@google-cloud/logging";
import "../environment";

export interface Logger {
  info(str: string): void;
  warn(str: string): void;
  error(str: string): void;
}

export class RemoteLogger implements Logger {
  public constructor(private internalLogger: Log) {}

  public static create(): RemoteLogger {
    return new RemoteLogger(new Logging().log("backend"));
  }

  public info(str: string): void {
    this.internalLogger.info(this.internalLogger.entry(str));
  }
  public warn(str: string): void {
    this.internalLogger.warning(this.internalLogger.entry(str));
  }
  public error(str: string): void {
    this.internalLogger.error(this.internalLogger.entry(str));
  }
}

export class ConsoleLogger implements Logger {
  public info(str: string): void {
    console.log(str);
  }
  public warn(str: string): void {
    console.warn(str);
  }
  public error(str: string): void {
    console.error(str);
  }
}

export let LOGGER: Logger = (function () {
  if (globalThis.ENVIRONMENT === "prod" || globalThis.ENVIRONMENT === "dev") {
    return RemoteLogger.create();
  } else {
    return new ConsoleLogger();
  }
})();
