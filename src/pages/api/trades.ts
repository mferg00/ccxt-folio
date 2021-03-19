import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as fs from "fs";
import * as ccxt from "ccxt";
import { readJSON, writeJSON } from '../../util/io'

const DATA_DIR = process.env["DATA_DIR"] || path.resolve(__dirname, '../../data');

export const getTrades = async (
    exchange: string,
    base: string,
    quote: string,
    { storeCache = true, refreshCache = false } = {}
): Promise<ccxt.Trade[]> => {
    const publicKey = process.env[exchange.toUpperCase() + '_PUBLIC_KEY']
    const privateKey = process.env[exchange.toUpperCase() + '_PRIVATE_KEY']

    if (!publicKey || !privateKey) {
        const missing = [
            !publicKey && exchange.toUpperCase() + '_PUBLIC_KEY',
            !privateKey && exchange.toUpperCase() + '_PRIVATE_KEY'
        ]

        throw `Missing in .env file: ${missing}.`
    }

    exchange = exchange.toLowerCase();

    const tradesPath = path.resolve(
        DATA_DIR,
        exchange,
        base.toUpperCase() + "-" + quote.toUpperCase(),
        "trades.json"
    );

    if (fs.existsSync(tradesPath) && !refreshCache) {
        const raw = await fs.promises.readFile(tradesPath, "utf8");
        return JSON.parse(raw) as ccxt.Trade[];
    }

    // TODO: FIX!!
    const api = new ccxt[exchange]({
        apiKey: publicKey,
        secret: privateKey
    }) as ccxt.Exchange

    const symbol = base.toUpperCase() + "/" + quote.toUpperCase();

    if (api.hasFetchMyTrades) {
        const data = await api.fetchMyTrades(symbol);
        writeJSON(tradesPath, data).catch((e) => console.error(e));
        return data;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // TODO: add actual type validation
    try {
        const { exchange, base, quote } = req.query as { [key: string]: string }
        const data = await getTrades(exchange, base, quote)
        res.status(200).json({ data })
        return
    } catch (e) {
        console.error(e)
        res.status(400).json({ error: e })
    }
}