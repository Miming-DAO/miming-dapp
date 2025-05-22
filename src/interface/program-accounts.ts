import { PublicKey } from "@solana/web3.js";

export interface VaultTeleportAccount {
    teleporter: PublicKey;
    vault: PublicKey;
    mimingToken: PublicKey;
    teleporterMimingToken: PublicKey;
    vaultMimingToken: PublicKey;
    vaultRegistry: PublicKey;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    systemProgram: PublicKey;
}