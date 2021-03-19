import path from "path";
import * as fs from "fs";
import * as ccxt from "ccxt";

export const writeJSON = async (outPath: string, data: any) => {
    const outDir = path.dirname(outPath)
    await fs.promises.mkdir(outDir, { recursive: true })
    const dataStr = JSON.stringify(data, null, 4)
    await fs.promises.writeFile(outPath, dataStr, 'utf8')
}

export const readJSON = async (inPath: string): Promise<any> => {
    const raw = await fs.promises.readFile(inPath, 'utf8')
    const data = JSON.parse(raw)
    return data
}