import Link from "next/link";
import {
    KeyboardArrowDownRounded,
    KeyboardArrowUpRounded,
} from "@material-ui/icons";
import { useState, useMemo } from "react";
import useSortableData from "../../hooks/useSortableData";
import Chart from "../Chart";
import styles from "./SummaryTable.module.css";

export type SummaryRowData = {
    base: string;
    quote: string;
    exchange: string;
    price: string;
    breakeven: string;
    performance: number;
    chart: HTMLDivElement;
};

export type SummaryRowHeaders = keyof SummaryRowData;

type SortArrowProps = {
    direction: "desc" | "asc";
};

const SortArrow = (props: SortArrowProps) => {
    const { direction } = props;

    if (!direction) {
        return <></>;
    }

    if (direction === "desc") {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowDownRounded color="inherit" />
            </div>
        );
    } else {
        return (
            <div className={styles.heading_arrow}>
                <KeyboardArrowUpRounded color="inherit" />
            </div>
        );
    }
};

export type SummaryRowProps = {
    base: string;
    quote: string;
    exchange: string;
    price: number;
    breakeven?: number;
    dates?: string[] | number[];
    prices?: number[];
};

const priceFormat = (price: number): string => {
    return price.toLocaleString("en-US", { maximumSignificantDigits: 8 });
};

export const SummaryRow = (props: SummaryRowProps) => {
    const { base, quote, exchange, price, breakeven, dates, prices } = props;
    const performance = breakeven
        ? Math.floor(((price - breakeven) / breakeven) * 100)
        : "?";

    return (
        <Link href={`/currencies/${base}/?quote=${quote}&exchange=${exchange}`}>
            <div className={styles.row}>
                <div className={styles.base}>{base}</div>
                <div className={styles.quote}>{quote}</div>
                <div className={styles.exchange}>{exchange}</div>
                <div className={styles.price}>{priceFormat(price)}</div>
                <div className={styles.breakeven}>
                    {breakeven ? priceFormat(breakeven) : "?"}
                </div>
                <div className={styles.performance}>{performance}</div>
                {!!prices && !!dates ? (
                    <div className={styles.chart}>
                        <Chart
                            prices={prices}
                            dates={dates}
                            breakeven={breakeven}
                        />
                    </div>
                ) : (
                    <div className={styles.chart}>?</div>
                )}
            </div>
        </Link>
    );
};

export type SummaryTableProps = {
    rows: SummaryRowProps[];
};

const SummaryTable = (props: SummaryTableProps) => {
    const { rows } = props;
    const { sortedItems, requestSort, sortConfig } = useSortableData(rows, {
        key: "base",
        direction: "asc",
    });

    return (
        <div>
            <div className={styles.heading}>
                <button
                    className={styles.heading_base}
                    onClick={() => requestSort("base", "flip")}
                >
                    <div>Base</div>
                    {sortConfig.key === "base" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button
                    className={styles.heading_quote}
                    onClick={() => requestSort("quote", "flip")}
                >
                    <div>Quote</div>
                    {sortConfig.key === "quote" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button
                    className={styles.heading_exchange}
                    onClick={() => requestSort("exchange", "flip")}
                >
                    <div>Exchange</div>
                    {sortConfig.key === "exchange" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button
                    className={styles.heading_price}
                    onClick={() => requestSort("price", "flip")}
                >
                    <div>Price</div>
                    {sortConfig.key === "price" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button
                    className={styles.heading_breakeven}
                    onClick={() => requestSort("breakeven", "flip")}
                >
                    <div>Breakeven</div>
                    {sortConfig.key === "breakeven" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button
                    className={styles.heading_performance}
                    onClick={() => requestSort("performance", "flip")}
                >
                    <div>Gain (%)</div>
                    {sortConfig.key === "performance" && (
                        <SortArrow direction={sortConfig.direction} />
                    )}
                </button>
                <button className={styles.heading_chart}>
                    <div>Trade History</div>
                </button>
            </div>
            {sortedItems.map((row, idx) => {
                const {
                    price,
                    exchange,
                    base,
                    quote,
                    breakeven,
                    prices,
                    dates,
                } = row;
                return (
                    <SummaryRow
                        key={idx}
                        price={price}
                        base={base}
                        quote={quote}
                        exchange={exchange}
                        prices={prices}
                        dates={dates}
                        breakeven={breakeven}
                    />
                );
            })}
        </div>
    );
};

export default SummaryTable;
