export const truncateString = (str: string, length: number): string => {
    return str.length > length ? `${str.slice(0, length / 2)}...${str.slice(-length / 2)}` : str;
};