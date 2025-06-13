/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/miming_spoke_solana.json`.
 */
export type MimingSpokeSolana = {
  "address": "3e2igyWExmDZmJfRpMRwn5mrM838Fam3AMzPYvttxRT8",
  "metadata": {
    "name": "mimingSpokeSolana",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "docs": [
    "This module contains the implementation of the Miming Spoke Solana program.",
    "",
    "It defines the functions for interacting with the multisig, vault, and staking functionalities."
  ],
  "instructions": [
    {
      "name": "multisigApproveProposal",
      "docs": [
        "Approves a proposal for a multisig account.",
        "",
        "This function calls the `approve_proposal` function from the `multisig::MultisigInstructions` module",
        "to approve the proposal.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `MultisigApproveProposal` instruction."
      ],
      "discriminator": [
        183,
        135,
        81,
        64,
        169,
        103,
        138,
        9
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentProposal",
          "writable": true
        },
        {
          "name": "currentMultisig",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "multisigCreateProposal",
      "docs": [
        "Creates a new proposal for a multisig account.",
        "",
        "This function calls the `create_proposal` function from the `multisig::MultisigInstructions` module",
        "to create the proposal.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `MultisigCreateProposal` instruction.",
        "* `name` - The name of the proposal.",
        "* `threshold` - The number of approvals required for the proposal to be executed.",
        "* `signers` - The list of signers for the proposal."
      ],
      "discriminator": [
        48,
        101,
        145,
        142,
        50,
        211,
        139,
        192
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentMultisig",
          "writable": true
        },
        {
          "name": "proposalIdentifier",
          "writable": true
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "proposal_identifier.id",
                "account": "identifierAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "threshold",
          "type": "u8"
        },
        {
          "name": "signers",
          "type": {
            "vec": {
              "defined": {
                "name": "multisigSigners"
              }
            }
          }
        }
      ]
    },
    {
      "name": "multisigInitialize",
      "docs": [
        "Initializes a new multisig account.",
        "",
        "This function calls the `initialize` function from the `multisig::MultisigInstructions` module",
        "to perform the initialization.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `MultisigInitialization` instruction."
      ],
      "discriminator": [
        142,
        86,
        11,
        245,
        124,
        93,
        47,
        134
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "proposalIdentifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108,
                  95,
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "multisigSignProposal",
      "docs": [
        "Signs a proposal for a multisig account.",
        "",
        "This function calls the `sign_proposal` function from the `multisig::MultisigInstructions` module",
        "to sign the proposal.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `MultisigSignProposal` instruction."
      ],
      "discriminator": [
        141,
        255,
        185,
        210,
        186,
        73,
        140,
        152
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentProposal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "stakingFreeze",
      "docs": [
        "Freezes a staking account.",
        "",
        "This function calls the `freeze` function from the `staking::StakingInstructions` module",
        "to freeze the account.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `StakingFreeze` instruction.",
        "* `reference_number` - The reference number for the freeze operation."
      ],
      "discriminator": [
        244,
        216,
        157,
        19,
        29,
        145,
        46,
        194
      ],
      "accounts": [
        {
          "name": "staker",
          "writable": true,
          "signer": true
        },
        {
          "name": "token",
          "writable": true
        },
        {
          "name": "stakerToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "staker"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "stakingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "stakingRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "referenceNumber",
          "type": "string"
        }
      ]
    },
    {
      "name": "stakingThaw",
      "docs": [
        "Thaws a staking account.",
        "",
        "This function calls the `thaw` function from the `staking::StakingInstructions` module",
        "to thaw the account.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `StakingThaw` instruction."
      ],
      "discriminator": [
        152,
        129,
        142,
        133,
        31,
        201,
        16,
        88
      ],
      "accounts": [
        {
          "name": "staker",
          "writable": true,
          "signer": true
        },
        {
          "name": "token",
          "writable": true
        },
        {
          "name": "stakerToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "staker"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "stakingConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "stakingRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vaultCreateTransferProposal",
      "docs": [
        "Creates a new transfer proposal from a vault.",
        "",
        "This function calls the `create_transfer_proposal` function from the `vault::VaultTransferProposalInstructions` module",
        "to create a proposal for transferring tokens from the vault to a specified recipient.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `VaultCreateTransferProposal` instruction.",
        "* `recipient` - The public key of the recipient who will receive the tokens.",
        "* `amount` - The amount of tokens to be transferred in the proposal."
      ],
      "discriminator": [
        81,
        122,
        254,
        187,
        123,
        142,
        122,
        74
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentMultisig",
          "writable": true
        },
        {
          "name": "transferProposalIdentifier",
          "writable": true
        },
        {
          "name": "transferProposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "transfer_proposal_identifier.id",
                "account": "identifierAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "vaultExecuteTransferProposal",
      "docs": [
        "",
        "This function calls the `execute_transfer_proposal` function from the `vault::VaultTransferProposalInstructions` module",
        "to execute a transfer proposal, transferring tokens from the vault to the specified recipient if the proposal has met the required approvals.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `VaultExecuteTransferProposal` instruction."
      ],
      "discriminator": [
        142,
        92,
        1,
        60,
        117,
        167,
        22,
        218
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentMultisig",
          "writable": true
        },
        {
          "name": "currentTransferProposal",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "ledgerIdentifier",
          "writable": true
        },
        {
          "name": "ledger",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  100,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "ledger_identifier.id",
                "account": "identifierAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vaultInitialize",
      "docs": [
        "Initializes a new vault account.",
        "",
        "This function calls the `initialize` function from the `vault::VaultInitializationInstructions` module",
        "to perform the initialization.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `VaultInitialization` instruction."
      ],
      "discriminator": [
        164,
        192,
        189,
        148,
        250,
        255,
        120,
        250
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "ledgerIdentifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  100,
                  103,
                  101,
                  114,
                  95,
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "transferProposalIdentifier",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  110,
                  115,
                  102,
                  101,
                  114,
                  95,
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108,
                  95,
                  105,
                  100,
                  101,
                  110,
                  116,
                  105,
                  102,
                  105,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vaultSignTransferProposal",
      "docs": [
        "Signs a transfer proposal from a vault.",
        "",
        "This function calls the `sign_transfer_proposal` function from the `vault::VaultTransferProposalInstructions` module",
        "to sign a transfer proposal for transferring tokens from the vault.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `VaultSignTransferProposal` instruction."
      ],
      "discriminator": [
        165,
        50,
        86,
        31,
        241,
        214,
        218,
        67
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "currentMultisig",
          "writable": true
        },
        {
          "name": "currentTransferProposal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "vaultTeleport",
      "docs": [
        "Teleports tokens from a vault.",
        "",
        "This function calls the `teleport` function from the `vault::VaultTeleportInstructions` module",
        "to perform the teleportation.",
        "",
        "# Arguments",
        "",
        "* `ctx` - The context for the `VaultTeleport` instruction.",
        "* `amount` - The amount of tokens to teleport."
      ],
      "discriminator": [
        226,
        53,
        7,
        51,
        184,
        57,
        3,
        184
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "ledgerIdentifier",
          "writable": true
        },
        {
          "name": "ledger",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  100,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "ledger_identifier.id",
                "account": "identifierAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "identifierAccount",
      "discriminator": [
        151,
        160,
        6,
        83,
        0,
        209,
        68,
        223
      ]
    },
    {
      "name": "multisigAccount",
      "discriminator": [
        77,
        9,
        180,
        199,
        183,
        246,
        156,
        81
      ]
    },
    {
      "name": "multisigProposalAccount",
      "discriminator": [
        42,
        75,
        65,
        152,
        239,
        185,
        226,
        223
      ]
    },
    {
      "name": "stakingConfigAccount",
      "discriminator": [
        69,
        12,
        194,
        53,
        93,
        8,
        175,
        113
      ]
    },
    {
      "name": "stakingRegistryAccount",
      "discriminator": [
        164,
        113,
        228,
        247,
        41,
        215,
        250,
        20
      ]
    },
    {
      "name": "vaultLedgerAccount",
      "discriminator": [
        247,
        65,
        125,
        188,
        56,
        96,
        200,
        81
      ]
    },
    {
      "name": "vaultTransferProposalAccount",
      "discriminator": [
        223,
        218,
        127,
        232,
        235,
        18,
        79,
        46
      ]
    }
  ],
  "events": [
    {
      "name": "vaultLedgerLogEvent",
      "discriminator": [
        158,
        163,
        110,
        201,
        62,
        96,
        210,
        48
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "thresholdLimitReached",
      "msg": "The proposal has already reached the required number of approvals."
    },
    {
      "code": 6001,
      "name": "signerLimitReached",
      "msg": "The number of signers has reached the allowed maximum."
    },
    {
      "code": 6002,
      "name": "alreadyResolved",
      "msg": "This proposal has been finalized and cannot be changed."
    },
    {
      "code": 6003,
      "name": "unauthorizedSigner",
      "msg": "The public key is not authorized to sign this proposal."
    },
    {
      "code": 6004,
      "name": "duplicateSignature",
      "msg": "This public key has already provided a signature."
    },
    {
      "code": 6005,
      "name": "insufficientSignatures",
      "msg": "Not enough signatures have been collected to proceed."
    }
  ],
  "types": [
    {
      "name": "identifierAccount",
      "docs": [
        "Stores a unique identifier for account management.",
        "",
        "The `IdentifierAccount` struct is an on-chain account that holds a single `u64` identifier.",
        "This account can be used to track or reference unique entities within the program, such as",
        "for indexing, mapping, or associating data with a specific ID.",
        "",
        "## Fields",
        "",
        "- `id` - A 64-bit unsigned integer representing the unique identifier.",
        "",
        "## Size",
        "",
        "The total size of the account is defined by `IdentifierAccount::LEN`, which includes",
        "the Anchor account discriminator and the size of the `u64` field.",
        "",
        "## Example",
        "",
        "```rust",
        "let identifier_account = IdentifierAccount { id: 42 };",
        "```"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "signers",
            "type": {
              "vec": {
                "defined": {
                  "name": "multisigSigners"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "multisigAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "signers",
            "type": {
              "vec": {
                "defined": {
                  "name": "multisigSigners"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "multisigProposalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "data",
            "type": {
              "defined": {
                "name": "multisig"
              }
            }
          },
          {
            "name": "requiredSigners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "signers",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "multisigProposalStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "multisigProposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "approved"
          }
        ]
      }
    },
    {
      "name": "multisigSigners",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "pubkey",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "stakingConfigAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minStakingAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stakingRegistryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referenceId",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "vaultLedger",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "transaction",
            "type": {
              "defined": {
                "name": "vaultTransaction"
              }
            }
          },
          {
            "name": "balanceIn",
            "type": "u64"
          },
          {
            "name": "balanceOut",
            "type": "u64"
          },
          {
            "name": "mimingFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultLedgerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "ledger",
            "type": {
              "defined": {
                "name": "vaultLedger"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultLedgerLogEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "data",
            "type": {
              "defined": {
                "name": "vaultLedger"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultTransaction",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "teleport",
            "fields": [
              {
                "name": "from",
                "type": "pubkey"
              },
              {
                "name": "amount",
                "type": "u64"
              }
            ]
          },
          {
            "name": "transfer",
            "fields": [
              {
                "name": "to",
                "type": "pubkey"
              },
              {
                "name": "amount",
                "type": "u64"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "vaultTransferProposalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "transaction",
            "type": {
              "defined": {
                "name": "vaultTransaction"
              }
            }
          },
          {
            "name": "multisigRequiredSigners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "multisigSigners",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "vaultTransferProposalStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultTransferProposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "executed"
          }
        ]
      }
    }
  ]
};
