export interface ITokenMetadata {
    name: string;
    description: string;
    image: string;
    animation_url?: string | null;
    attributes?: unknown | null;
    external_url?: string | null;
}

export interface ITokenAllocationBreakdown {
    remainingAllocation?: number;
    pricePerToken: number;
}

export interface IToken {
    id: number;
    animation_url?: string | null;
    attributes?: unknown | null;
    description: string;
    external_url?: string | null
    image: string;
    maxPerTransaction: number;
    name: string;
    price: number;
    remaining: number;
}

export interface IListToken {
    id: number;
    maxPerTransaction: number;
    price: number;
    remaining: number;
    supply: number;
    totalSupply: number;
}
