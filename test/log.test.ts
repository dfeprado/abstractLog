import Log, { logLevel } from "../src/Log";

/**
 * TestLog is intended to log purpose only
 */
class TestLog extends Log {
    levelDescr: string = ''
    msg: string = ''
    protected doLog(levelDescr: string, msg: string): void {
        this.levelDescr = levelDescr
        this.msg = msg
    }
}

const log = new TestLog(logLevel.all)

test('Writing with all levels', () => {
    log.info('Hello, World!')
    expect(log.levelDescr).toBe('INFO')

    log.notice('Hello, World!')
    expect(log.levelDescr).toBe('NOTICE')

    log.warning('Hello, World!')
    expect(log.levelDescr).toBe('WARNING')

    log.error('Hello, World!')
    expect(log.levelDescr).toBe('ERROR')
})

test('All log levels but WARNING', () => {
    log.setLevel(logLevel.all & ~logLevel.warning)
    log.info('T2')
    expect(log.levelDescr).toBe('INFO')
    expect(log.msg).toBe('T2')

    log.warning('T2')
    expect(log.levelDescr).not.toBe('WARNING')
})

test('Only info level', () => {
    log.setLevel(logLevel.info)
    log.info('T3')
    expect(log.levelDescr).toBe('INFO')
    expect(log.msg).toBe('T3')

    log.notice('T3')
    expect(log.levelDescr).not.toBe('NOTICE')

    log.warning('T3')
    expect(log.levelDescr).not.toBe('WARNING')

    log.error('T3')
    expect(log.levelDescr).not.toBe('ERROR')
})