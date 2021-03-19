import type { NextApiRequest, NextApiResponse } from "next";

export const getExchanges = (): string[] => {
    const re = /(.+?)(?:_(?:PUBLIC|PRIVATE)_KEY)/;

    const exchanges = Object.keys(process.env).reduce((acc, key) => {
        const match = key.match(re);

        if (match && match.length > 1) {
            acc.add(match[1].toLowerCase());
        }

        return acc;
    }, new Set() as Set<string>);

    return Array.from(exchanges);
}

export const getActivePairs = (exchange: string): string[] => {
    const re = new RegExp(`${exchange.toUpperCase()}_PAIRS`)

    for (const key of Object.keys(process.env)) {
        if (key.match(re)) {
            const pairs = process.env[key]
            return pairs.split(',')
        }
    }

    return []
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const exchanges = getExchanges()

    const pairs = exchanges.map(exchange => {
        return {
            exchange: exchange,
            pairs: getActivePairs(exchange)
        }
    })

    res.status(200).json({
        data: pairs
    })
}
