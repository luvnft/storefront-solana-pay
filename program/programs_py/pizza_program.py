# pizza_program
# Built with Seahorse v0.2.7

from seahorse.prelude import *

declare_id('9v72LRyuGWQtrtNEkzRt7yLv8JvokMSY9vVy2Kn8Kkew')


class PizzaOrder(Account):
    order: u8
    webpos: u8
    luvnft: u8
    healxyz: u8


@instruction
def create_pizza_order(payer: Signer, pizza_order: Empty[PizzaOrder], order: u8, webpos: u8, luvnft: u8, healxyz: u8):
    pizza_order = pizza_order.init(
        payer=payer,
        seeds=['solami_pizza', order, payer]
    )
    pizza_order.order = order
    pizza_order.webpos = webpos
    pizza_order.luvnft = luvnft
    pizza_order.healxyz = healxyz
