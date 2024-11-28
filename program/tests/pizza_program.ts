import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { PizzaProgram } from "../target/types/pizza_program";

describe("pizza_program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PizzaProgram as Program<PizzaProgram>;

  it("Create a pizza order", async () => {
    const orderNumber = 1 + Math.floor(Math.random() * 254);

    // Generate the pizza order account public key from its seeds
    const [orderPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("solami_pizza"),
        Buffer.from(Uint8Array.of(orderNumber)),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    console.log("Order Number: ", orderNumber);
    console.log("Order PublicKey: ", orderPublicKey.toBase58());
    console.log("Payer Address: ", provider.wallet.publicKey.toBase58());

    // Create order
    const webpos = 3;
    const luvnft = 2;
    const healxyz = 1;
    const transaction = await program.methods
      .createPizzaOrder(orderNumber, webpos, luvnft, healxyz)
      .accounts({
        payer: provider.wallet.publicKey,
        pizzaOrder: orderPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // fetch the account
    const orderAccount = await program.account.pizzaOrder.fetch(orderPublicKey);

    console.log("Order: ", orderAccount.order);
    console.log("Solana QR POS: ", orderAccount.webpos);
    console.log("Branded LUV NFT: ", orderAccount.luvnft);
    console.log("HealXYZ Session: ", orderAccount.healxyz);

    assert.equal(orderAccount.order, orderNumber);
    assert.equal(orderAccount.webpos, webpos);
    assert.equal(orderAccount.luvnft, luvnft);
    assert.equal(orderAccount.healxyz, healxyz);
  });
});
