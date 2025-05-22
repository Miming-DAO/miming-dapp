export interface NetworkInfo {
    name: string;
    rpc: string;
}

export interface NetworkAsset {
    network: NetworkInfo;
    assets: string[];
}