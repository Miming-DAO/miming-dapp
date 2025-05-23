/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/miming_solana_multisig_vault.json`.
 */
export type MimingSolanaMultisigVault = {
  "address": "BceBSfdZfBSEApAiu4wNuHSauvUJxYhCLoY9UyxE5EAc",
  "metadata": {
    "name": "mimingSolanaMultisigVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "multisigApproveProposal",
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
          "name": "multisigRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
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
          "name": "uuid",
          "type": "string"
        }
      ]
    },
    {
      "name": "multisigCreateProposal",
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
          "name": "multisigRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
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
          "name": "actionType",
          "type": {
            "defined": {
              "name": "multisigProposalType"
            }
          }
        },
        {
          "name": "targetPubkey",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "multisigSignProposal",
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
          "name": "multisigRegistry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
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
          "name": "uuid",
          "type": "string"
        }
      ]
    },
    {
      "name": "stakingFreeze",
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
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
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
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
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
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
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
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
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
      "name": "vaultTeleport",
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
          "name": "teleporter",
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
                  109,
                  105,
                  109,
                  105,
                  110,
                  103,
                  95,
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
          "name": "mimingToken",
          "writable": true
        },
        {
          "name": "teleporterMimingToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "teleporter"
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
                "path": "mimingToken"
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
          "name": "vaultMimingToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vault"
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
                "path": "mimingToken"
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
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "multisigRegistry",
      "discriminator": [
        40,
        241,
        214,
        6,
        206,
        4,
        228,
        31
      ]
    },
    {
      "name": "stakingConfig",
      "discriminator": [
        45,
        134,
        252,
        82,
        37,
        57,
        84,
        25
      ]
    },
    {
      "name": "stakingRegistry",
      "discriminator": [
        82,
        145,
        139,
        169,
        210,
        136,
        180,
        49
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyRegistered",
      "msg": "This public key is already registered."
    },
    {
      "code": 6001,
      "name": "notRegistered",
      "msg": "This public key is not registered."
    },
    {
      "code": 6002,
      "name": "notAMember",
      "msg": "You are not a member of this multisig."
    },
    {
      "code": 6003,
      "name": "notARequiredSigner",
      "msg": "You are not listed as a required signer."
    },
    {
      "code": 6004,
      "name": "alreadyProcessed",
      "msg": "Proposal has already been approved or rejected."
    },
    {
      "code": 6005,
      "name": "proposalNotFound",
      "msg": "Proposal not found."
    },
    {
      "code": 6006,
      "name": "incompleteSignatures",
      "msg": "Not all required signatures are present."
    },
    {
      "code": 6007,
      "name": "alreadySigned",
      "msg": "This signer has already signed."
    }
  ],
  "types": [
    {
      "name": "multisigMember",
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
      "name": "multisigProposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uuid",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "actionType",
            "type": {
              "defined": {
                "name": "multisigProposalType"
              }
            }
          },
          {
            "name": "targetPubkey",
            "type": "pubkey"
          },
          {
            "name": "requiredSigners",
            "type": {
              "vec": {
                "defined": {
                  "name": "multisigMember"
                }
              }
            }
          },
          {
            "name": "signatures",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "multisigStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "multisigProposalType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "registerMember"
          },
          {
            "name": "unregisterMember"
          }
        ]
      }
    },
    {
      "name": "multisigRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "members",
            "type": {
              "vec": {
                "defined": {
                  "name": "multisigMember"
                }
              }
            }
          },
          {
            "name": "proposals",
            "type": {
              "vec": {
                "defined": {
                  "name": "multisigProposal"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "multisigStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "approved"
          },
          {
            "name": "rejected"
          },
          {
            "name": "unregister"
          }
        ]
      }
    },
    {
      "name": "stakingConfig",
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
      "name": "stakingRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referenceId",
            "type": "string"
          }
        ]
      }
    }
  ]
};
