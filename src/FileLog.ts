import path from "path"
import fs from "fs"
import Log, { logLevel } from "./Log";

/**
 * A file logging class with per day file rotation
 */
export default class FileLog extends Log {
    private path!: string
    private fileName!: string
    private fileExt!: string
    private logStream?: fs.WriteStream
    private openNewFileStreamTimeout?: NodeJS.Timeout

    constructor(logPath: string, level: logLevel = logLevel.all) {
        super(level)

        logPath = logPath.trim()
        if (!logPath)
            throw new Error('You should provide an log path to FileLog')

        this.path = path.dirname(logPath)
        this.fileExt = path.extname(logPath)
        this.fileName = path.basename(logPath, this.fileExt)
        fs.mkdirSync(this.path, {recursive: true})
        this.openFileStream()
    }

    /**
     * Agenda a rotação do arquivo de log para um dia
     * @param lastFileCreationTs Timestamp da criação do último arquivo
     */
    private scheduleFileRotation(lastFileCreationTs: Date) {
        const reopenTs = new Date(lastFileCreationTs.getFullYear(), lastFileCreationTs.getMonth(), lastFileCreationTs.getDate()+1)
        this.openNewFileStreamTimeout = setTimeout(() => this.openFileStream(), reopenTs.getTime() - lastFileCreationTs.getTime())
    }

    private openFileStream() {
        if (this.logStream)
            this.logStream.close()

        const createTs = new Date()
        // fileName = <filename>_ddmmyyyy.<ext>
        const fileName = `${this.fileName}_${createTs.getDate()}${createTs.getMonth() + 1}${createTs.getFullYear()}${this.fileExt}`
        this.logStream = fs.createWriteStream(path.resolve(this.path, fileName), {autoClose: true, flags: 'a+'})

        this.scheduleFileRotation(createTs)
    }

    protected doLog(levelDescr: string, msg: string): void {
        if (!msg)
            return
        
        this.logStream?.write(`[${new Date().toLocaleString()} - ${levelDescr}] ${msg}\n`)
    }

    close() {
        super.close()
        if (this.openNewFileStreamTimeout)
            clearTimeout(this.openNewFileStreamTimeout)
    }
}