import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as fs from "fs";
import * as ccxt from "ccxt";
import { readJSON, writeJSON } from '../../util/io'

const DATA_DIR = process.env["DATA_DIR"] || path.resolve(__dirname, '../../data');

export const getOHLCV = async (
    exchange: string,
    base: string,
    quote: string,
    { storeCache = true, refreshCache = false } = {}
): Promise<ccxt.OHLCV[]> => {
    exchange = exchange.toLowerCase();

    const ohlcvPath = path.resolve(
        DATA_DIR,
        exchange,
        base.toUpperCase() + "-" + quote.toUpperCase(),
        "OHLCV.json"
    );

    if (fs.existsSync(ohlcvPath) && !refreshCache) {
        return await readJSON(ohlcvPath) as ccxt.OHLCV[]
    }

    const api = new ccxt[exchange]() as ccxt.Exchange;

    if (api.hasFetchOHLCV) {
        const symbol = base.toUpperCase() + "/" + quote.toUpperCase();
        const data = await api.fetchOHLCV(symbol, "1d");
        writeJSON(ohlcvPath, data).catch((e) => console.error(e));
        return data;
    }
};

const queryExample = {
    exchange: "binance",
    base: "eth",
    quote: "btc",
} as const;

type Query = typeof queryExample;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const missingKeys = Object.keys(req.query).reduce((acc, key) => {
        acc.delete(key);
        return acc;
    }, new Set(Object.keys(queryExample)));

    if (missingKeys.size > 0) {
        res.status(400).json({
            error: {
                code: 400,
                message: "Missing url query parameters.",
                data: {
                    missing: Array.from(missingKeys)
                }
            }
        });
        return;
    }

    const { exchange, base, quote } = req.query as Query;

    try {
        const data = await getOHLCV(exchange, base, quote);
        res.status(200).json({ data });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
};
