/**
 * Defines the existing log levels. Log level can be or-ed.
 */
export enum logLevel {
    info = 0x1,
    notice = 0x2,
    warning = 0x4,
    error = 0x8,
    all = 0xf
}

/**
 * A log class interface
 * 
 * Implement `doLog(levelDescr: string, msg: string): void` and `close(): void` methods in child class
 */
export default abstract class Log {
    private logLevel: number

    /**
     * Create a new log object
     * @param level The desired log level. It can be or-ed, eg logLevel.info | logLevel.error. See `logLevel` enum for more info
     */
    constructor (level: number = logLevel.all) {
        this.logLevel = level
    }

    /**
     * Do the log. Child classes should implement this method. See `ConsoleLog` class for an example.
     * @param levelDescr The log level description. Can be `INFO`, `NOTICE`, `WARNING` or `ERROR`
     * @param msg The message to log
     */
    protected abstract doLog(levelDescr: string, msg: string): void

    info(msg: string): void {
        if (this.logLevel & 0x1)
            this.doLog('INFO', msg)
    }

    notice(msg: string): void {
        if (this.logLevel >> 1 & 0x1)
            this.doLog('NOTICE', msg)
    }

    warning(msg: string): void {
        if (this.logLevel >> 2 & 0x1)
            this.doLog('WARNING', msg)
    }

    error(msg: string): void {
        if (this.logLevel >> 3 & 0x1)
            this.doLog('ERROR', msg)
    }

    setLevel(level: number): void {
        this.logLevel = level   
    }

    /**
     * Finishs the log class
     */
    close() {}
}

/**
 * A console log class
 */
export class ConsoleLog extends Log {
    protected doLog(levelDescr: string, msg: string) {
        // [<TIMESTAMP> - <LEVEL>] <MSG>
        console.log(`[${new Date().toLocaleString()} - ${levelDescr}] ${msg}`)
    }
}