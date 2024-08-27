const isBrowserLoggingEnabled =
  process.env.NEXT_PUBLIC_BROWSER_LOGGING === 'true'

export class Logger {
  private static _enabled: boolean = isBrowserLoggingEnabled

  public static info(message: any, ...args: any[]) {
    if (!this._enabled) return

    console.log('%cinfo:', 'color: #1dc9d4', message, ...args)
  }

  public static warn(message: any, ...args: any[]) {
    if (!this._enabled) return

    console.log('%cwarn:', 'color: #ffcb47', message, ...args)
  }

  public static error(message: any, ...args: any[]) {
    if (!this._enabled) return

    console.log('%cerror:', 'color: #d4291d', message, ...args)
  }
}