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
    pub webpos: u8,
    pub luvnft: u8,
    pub healxyz: u8,
}

impl<'info, 'entrypoint> PizzaOrder {
    pub fn load(
        account: &'entrypoint mut Box<Account<'info, Self>>,
        programs_map: &'entrypoint ProgramsMap<'info>,
    ) -> Mutable<LoadedPizzaOrder<'info, 'entrypoint>> {
        let order = account.order;
        let webpos = account.webpos;
        let luvnft = account.luvnft;
        let healxyz = account.healxyz;

        Mutable::new(LoadedPizzaOrder {
            __account__: account,
            __programs__: programs_map,
            order,
            webpos,
            luvnft,
            healxyz,
        })
    }

    pub fn store(loaded: Mutable<LoadedPizzaOrder>) {
        let mut loaded = loaded.borrow_mut();
        let order = loaded.order;

        loaded.__account__.order = order;

        let webpos = loaded.webpos;

        loaded.__account__.webpos = webpos;

        let luvnft = loaded.luvnft;

        loaded.__account__.luvnft = luvnft;

        let healxyz = loaded.healxyz;

        loaded.__account__.healxyz = healxyz;
    }
}

#[derive(Debug)]
pub struct LoadedPizzaOrder<'info, 'entrypoint> {
    pub __account__: &'entrypoint mut Box<Account<'info, PizzaOrder>>,
    pub __programs__: &'entrypoint ProgramsMap<'info>,
    pub order: u8,
    pub webpos: u8,
    pub luvnft: u8,
    pub healxyz: u8,
}

pub fn create_pizza_order_handler<'info>(
    mut payer: SeahorseSigner<'info, '_>,
    mut pizza_order: Empty<Mutable<LoadedPizzaOrder<'info, '_>>>,
    mut order: u8,
    mut webpos: u8,
    mut luvnft: u8,
    mut healxyz: u8,
) -> () {
    let mut pizza_order = pizza_order.account.clone();

    assign!(pizza_order.borrow_mut().order, order);

    assign!(pizza_order.borrow_mut().webpos, webpos);

    assign!(pizza_order.borrow_mut().luvnft, luvnft);

    assign!(pizza_order.borrow_mut().healxyz, healxyz);
}
