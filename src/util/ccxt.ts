import * as ccxt from 'ccxt'

export const getSymbol = (base: string, quote: string) => base.trim().toUpperCase() + '/' + quote.trim().toUpperCase()

// TODO: add logic for trade.fee price factoring
export const getBreakeven = (symbol: string, trades: ccxt.Trade[]): number => {
    const [totalAmount, totalSpent] = trades.filter(trade => trade.symbol === symbol).reduce((acc, trade) => {
        const [accAmount, accSpent] = acc
        const amount = trade.amount
        const spent = trade.cost

        return [accAmount + amount, accSpent + spent]
    }, [0, 0])

    const breakeven = 1 / (totalAmount / totalSpent)
    return breakeven
}

export const getPrice = async (symbol: string, exchange: string): Promise<number> => {
    const api = new ccxt[exchange]() as ccxt.Exchange

    const ticker = await api.fetchTicker(symbol)
    return ticker.ask
}