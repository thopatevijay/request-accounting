import { currencies } from "./currency";

export const getDecimals = (network: string, value: string) => {
    return currencies.get(network.concat("_", value))?.decimals;
};
