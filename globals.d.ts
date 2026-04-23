declare function gtag(command: string, eventName: string, params?: unknown): void

declare module '*.json' {
    const value: any
    export default value
}

declare module 'esbuild' {
    const esbuild: any
    export = esbuild
    export default esbuild
}

declare module 'globals' {
    const globals: any
    export default globals
}

declare module '@eslint/js' {
    const js: any
    export default js
}

declare module 'eslint-config-prettier' {
    const prettierConfig: any
    export default prettierConfig
}

interface FileSystemWritableFileStream {
    write(data: unknown): Promise<void>
    close(): Promise<void>
}

interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>
}

interface SaveFilePickerType {
    description?: string
    accept: Record<string, string[]>
}

interface SaveFilePickerOptions {
    suggestedName?: string
    types?: SaveFilePickerType[]
    excludeAcceptAllOption?: boolean
}

interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
}
