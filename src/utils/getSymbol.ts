import { currencies } from "./currency";

export const getSymbol = (network: string, value: string) => {
    return currencies.get(network.concat("_", value))?.symbol;
};