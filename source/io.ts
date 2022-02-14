import { v4 as uuid } from "uuid"
import path from "path"
import fs from "fs"

export interface Task {
    id: string
    created_at: string
    content: string
}

export interface Model {
    tasks: Record<string, Task[]>
}


class TaskManager {
    constructor() {
        this.init()
    }

    private defaultContents: Model = { 
        tasks: {
            [this.getTodaysDate()]: []
        }
    }

    private contents: Model = this.defaultContents

    private PATH: string = path.join(__dirname, "./tasks.json")

    private init() {
        this.loadTasks()
    }

    private sliceDate(date: string) {
        return date.slice(0, 10)
    }

    private fileExists(filename: string) {
        try {
            fs.accessSync(filename)
            return true
        } catch {
            return false
        }
    }

    private writeData(data: Model) {
        fs.writeFileSync(this.PATH, JSON.stringify(data, null, 2))
        this.contents = data;
    }

    private loadTasks() {
        if (!this.fileExists(this.PATH)) {
            this.writeData(this.defaultContents)
            return
        }

        const contents = fs.readFileSync(this.PATH, 'utf8')
        this.contents = JSON.parse(contents)
    }

    // PUBLIC

    getTodaysDate() {
        return this.sliceDate((new Date()).toISOString())
    }

    getYesterdaysDate() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return this.sliceDate(date.toISOString())
    }

    getDayName(date: string) {
        return (new Date(date)).toLocaleDateString("en-IE", { weekday: 'long' })
    }

    getTasks(date: string = this.getTodaysDate()) {
        return this.contents.tasks[date]
    }

    addTask(task: string) {
        const date = this.getTodaysDate()
        const clonedContents = { ...this.contents }

        const newTask: Task = {
            id: uuid(),
            created_at: date,
            content: task
        }

        if (Array.isArray(clonedContents.tasks[date])) {
            clonedContents.tasks[date]?.push(newTask)
        } else {
            clonedContents.tasks[date] = [newTask]
        }

        this.writeData(clonedContents)
    }

    removeTask(taskNumber: number) {
        const date = this.getTodaysDate()
        const clonedContents = { ...this.contents }

        clonedContents.tasks[date]?.splice(taskNumber - 1, 1)
        this.writeData(clonedContents)
    }

    clearTasks(date: string = this.getTodaysDate()) {
        const clonedContents = { ...this.contents }

        clonedContents.tasks[date] = []
        this.writeData(clonedContents)
    }
}

const manager = new TaskManager()

export default manager