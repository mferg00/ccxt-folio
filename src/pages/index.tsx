import Head from "next/head";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import SummaryTable, {
    SummaryRowProps,
    SummaryTableProps,
} from "../components/SummaryTable";
import { getOHLCV } from "./api/ohlcv";
import { getTrades } from "./api/trades";
import { getPrice, getBreakeven, getSymbol } from "../util/ccxt";
import { getExchanges, getActivePairs } from "./api/user";
import * as ccxt from "ccxt";

type HomeProps = {
    table: SummaryTableProps;
};

export const getStaticProps = async () => {
    const exchanges = getExchanges().filter((exchange) =>
        ccxt.exchanges.includes(exchange)
    );

    const sources = exchanges.reduce((acc, exchange) => {
        const pairs = getActivePairs(exchange);

        return [
            ...acc,
            ...pairs.map((pair) => {
                return {
                    exchange: exchange,
                    symbol: pair,
                };
            }),
        ];
    }, []);

    console.dir(sources, { depth: null });

    const rows: HomeProps["table"]["rows"] = await sources.reduce(
        async (_acc, source) => {
            const acc = await _acc;
            const { exchange, symbol } = source;

            const [base, quote] = symbol.split("/");

            try {
                const data = await getOHLCV(exchange, base, quote, {
                    storeCache: true,
                    refreshCache: false,
                });
                const row: SummaryRowProps = {
                    base: base,
                    quote: quote,
                    exchange: exchange,
                    price: (await getPrice(symbol, exchange)) || 0,
                    breakeven: getBreakeven(
                        symbol,
                        await getTrades(exchange, base, quote)
                    ),
                    prices: data.map(([t, o, h, l, c, v]) => c),
                    dates: data.map(([t, o, h, l, c, v]) => t),
                };
                return Promise.resolve([...acc, row]);
            } catch (e) {
                console.error(e);
                return Promise.resolve(acc);
            }
        },
        Promise.resolve([])
    );

    const data: HomeProps = {
        table: {
            rows: rows,
        },
    };

    return {
        props: {
            data,
        },
    };
};

const Home = ({ data }: { data: HomeProps }) => {
    return (
        <Layout>
            <SummaryTable rows={data.table.rows} />
        </Layout>
    );
};

export default Home;
