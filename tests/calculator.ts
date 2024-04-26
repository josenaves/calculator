import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
import { expect } from "chai";

const { SystemProgram } = anchor.web3;

// Moka works using predescribed it blocks
describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  // referencing the program - Abstraction that allows us to call methods of our SOL program.
  const program = anchor.workspace.Calculator as Program<Calculator>
  const programProvider = program.provider as anchor.AnchorProvider

  // generate a keypair for our calculator account
  const calculatorPair = anchor.web3.Keypair.generate()

  const text = "Summer School of Solana"

  // creating a test block
  it("Creating Calculator Instance!", async () => {
    // Calling create instance - set our Calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
        calculator: calculatorPair.publicKey,
        user: programProvider.publicKey,
        // systemProgram: SystemProgram.programId,
      }
    ).signers([calculatorPair]).rpc()

    // we fetch the account and read if the string is actually in the account
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.greeting).to.eql(text)
  });

  // another test step - test out addition
  it("Addition", async () => {
    // Calling create instance - set our Calculator keypair as a signer
    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
    .accounts({
      calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  });

});
