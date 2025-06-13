import { PublicKey } from "@solana/web3.js";

export interface VaultInitializeAccount {
    signer: PublicKey;
    ledgerIdentifier: PublicKey;
    systemProgram: PublicKey;
}

export interface VaultTeleportAccount {
    signer: PublicKey;
    vault: PublicKey;
    ledgerIdentifier: PublicKey;
    ledger: PublicKey;
    systemProgram: PublicKey;
}