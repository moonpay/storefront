export interface ITokenMetadata {
    name: string;
    description: string;
    image: string;
}

interface ITokenAllocationBreakdown {
    remainingAllocation?: number;
    pricePerToken: number;
}

export interface ITokenAllocation {
    allocation: ITokenAllocationBreakdown[]
}

export interface IToken {
    id: number;
    price: number;
    supply: number;
    remaining: number;
    totalSupply: number;
    maxPerTransaction: number;
    tokenAddress?: string;
    tokenAccountAddress?: string;
}