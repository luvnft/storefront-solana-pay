#![allow(unused_imports)]
#![allow(unused_variables)]
#![allow(unused_mut)]
use crate::{id, seahorse_util::*};
use anchor_lang::{prelude::*, solana_program};
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use std::{cell::RefCell, rc::Rc};

#[account]
#[derive(Debug)]
pub struct PizzaOrder {
    pub order: u8,
    pub demicolor: u8,
    pub permanentcolor: u8,
    pub silkpress: u8,
}

impl<'info, 'entrypoint> PizzaOrder {
    pub fn load(
        account: &'entrypoint mut Box<Account<'info, Self>>,
        programs_map: &'entrypoint ProgramsMap<'info>,
    ) -> Mutable<LoadedPizzaOrder<'info, 'entrypoint>> {
        let order = account.order;
        let demicolor = account.demicolor;
        let permanentcolor = account.permanentcolor;
        let silkpress = account.silkpress;

        Mutable::new(LoadedPizzaOrder {
            __account__: account,
            __programs__: programs_map,
            order,
            demicolor,
            permanentcolor,
            silkpress,
        })
    }

    pub fn store(loaded: Mutable<LoadedPizzaOrder>) {
        let mut loaded = loaded.borrow_mut();
        let order = loaded.order;

        loaded.__account__.order = order;

        let demicolor = loaded.demicolor;

        loaded.__account__.demicolor = demicolor;

        let permanentcolor = loaded.permanentcolor;

        loaded.__account__.permanentcolor = permanentcolor;

        let silkpress = loaded.silkpress;

        loaded.__account__.silkpress = silkpress;
    }
}

#[derive(Debug)]
pub struct LoadedPizzaOrder<'info, 'entrypoint> {
    pub __account__: &'entrypoint mut Box<Account<'info, PizzaOrder>>,
    pub __programs__: &'entrypoint ProgramsMap<'info>,
    pub order: u8,
    pub demicolor: u8,
    pub permanentcolor: u8,
    pub silkpress: u8,
}

pub fn create_pizza_order_handler<'info>(
    mut payer: SeahorseSigner<'info, '_>,
    mut pizza_order: Empty<Mutable<LoadedPizzaOrder<'info, '_>>>,
    mut order: u8,
    mut demicolor: u8,
    mut permanentcolor: u8,
    mut silkpress: u8,
) -> () {
    let mut pizza_order = pizza_order.account.clone();

    assign!(pizza_order.borrow_mut().order, order);

    assign!(pizza_order.borrow_mut().demicolor, demicolor);

    assign!(pizza_order.borrow_mut().permanentcolor, permanentcolor);

    assign!(pizza_order.borrow_mut().silkpress, silkpress);
}
