'use client'; // this makes next know that this page should be rendered in the client
import { useEffect, useState } from 'react';
import PayQR from '@/src/components/PayQR';
import { Keypair, PublicKey } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { PizzaOrder, displayOnChainPizzaOrder, getOrderPublicKey } from '@/src/util/order';
import { CONNECTION } from '@/src/util/const';


type PizzaOrderType = {
  demicolor: number,
  permanentcolor: number,
  silkpress: number,
}

export default function Home() {
  const [pizzaOrder, setPizzaOrder] = useState<PizzaOrderType>()
  const [total, setTotal] = useState(0);
  const [reference, setReference] = useState<PublicKey>();
  const [orderNumber, setOrderNumber] = useState<number>();

  const [orderPublicKey, setOrderPublicKey] = useState<PublicKey>();
  const [onChainOrderDetails, setOnChainOrderDetails] = useState<PizzaOrder>();

  const addAddon = (addon: PizzaOrderType) => {
    if (pizzaOrder) {
      setPizzaOrder(addon)
      setTotal(total + 0.5)
    }
  };

  const subtractPepperoni = () => {
    if (pizzaOrder && pizzaOrder.demicolor != 0) {
      setPizzaOrder({ ...pizzaOrder, demicolor: pizzaOrder.demicolor -= 1 })
      setTotal(total - 0.5)
    }
  };
  const subtractMushrooms = () => {
    if (pizzaOrder && pizzaOrder.demicolor != 0) {
      setPizzaOrder({ ...pizzaOrder, permanentcolor: pizzaOrder.permanentcolor -= 1 })
      setTotal(total - 0.5)
    }
  };
  const subtractOlives = () => {
    if (pizzaOrder && pizzaOrder.demicolor != 0) {
      setPizzaOrder({ ...pizzaOrder, silkpress: pizzaOrder.silkpress -= 1 })
      setTotal(total - 0.5)
    }
  };


  useEffect(() => {
    setReference(Keypair.generate().publicKey);
    const randomOrderNumber = Math.floor(Math.random() * 255);
    setOrderNumber(randomOrderNumber);
    setPizzaOrder(new PizzaOrder({
      order: randomOrderNumber,
      demicolor: 0,
      permanentcolor: 0,
      silkpress: 0,
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        if (reference && orderNumber) {
          const signatureInfo = await findReference(CONNECTION, reference);
          // do something here when the transaction is confirmed
          console.log('Transaction confirmed', signatureInfo);
          const parsedSender = (
            await CONNECTION.getParsedTransaction(signatureInfo.signature)
          )?.transaction.message.accountKeys.filter((key) => key.signer)[0];
          if (parsedSender) {
            const orderPublicKey = getOrderPublicKey(
              orderNumber,
              parsedSender.pubkey
            );
            setOrderPublicKey(orderPublicKey);
            setOnChainOrderDetails(await displayOnChainPizzaOrder(
              orderPublicKey,
            ));
          }
        }
      } catch (e) {
        if (e instanceof FindReferenceError) {
          console.log('No transaction found for the reference');
          return;
        }
        console.error('Unknown error', e);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [orderNumber, orderPublicKey, reference]);

  return (
    <main className='min-h-screen p-2 bg-red-500'>
      {pizzaOrder && <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-[url('../public/pizzeria.jpg')]">
        <div className="w-full min-h-screen pt-4 bg-fixed bg-red-900 bg-center bg-no-repeat bg-cover bg-opacity-60">
          {onChainOrderDetails ?

            <div className='p-2 mx-auto bg-white border border-black border-solid shadow-md rounded-2xl w-fit'>
              <div className='px-3 pt-2 pb-6 text-center'>
                <h2 className='my-8 text-2xl'>
                  Confirmed!{' '}
                </h2>
                <p className='my-4 text-sm text-gray-700'>
                  Your Order :
                </p>
                <div className='mx-auto text-center w-96'>
                  <ul className='text-sm text-gray-600'>
                    <li
                      className='flex flex-row justify-center mx-16 my-2 text-lg'
                    >
                      <p className='font-bold'>Solana QR POS</p>
                      <p className='ml-auto font-bold text-red-600'>{onChainOrderDetails.demicolor}</p>
                    </li>
                    <li
                      className='flex flex-row mx-16 my-2 text-lg justify-left'
                    >
                      <p className='font-bold'>Branded LUV NFT</p>
                      <p className='ml-auto font-bold text-red-600'>{onChainOrderDetails.permanentcolor}</p>
                    </li>
                    <li
                      className='flex flex-row mx-16 my-2 text-lg justify-left'
                    >
                      <p className='font-bold'>HealXYZ Session</p>
                      <p className='ml-auto font-bold text-red-600'>{onChainOrderDetails.silkpress}</p>
                    </li>
                  </ul>
                </div>
                <p className='mx-auto mt-6 text-sm text-gray-700'>
                  On-Chain Address :
                </p>
                <p className='mx-auto mt-2 text-sm'>
                  <a
                    className='text-blue-600 underline'
                    target='_blank' 
                    rel='noopener noreferrer' 
                    href={`https://explorer.solana.com/address/${orderPublicKey?.toBase58()}/anchor-account?cluster=devnet`}>{orderPublicKey?.toBase58()}</a>
                </p>
              </div>
            </div>
            :
            <div className='flex flex-col justify-center'>

              {/* Order Builder */}
              <div className='p-2 mx-auto mb-2 bg-white border border-black border-solid shadow-md rounded-xl w-fit'>
                <h4 className='text-xl text-slate-700'>@WizardofHahz</h4>
              </div>
              <div className='p-2 mx-auto mb-2 bg-white border border-black border-solid shadow-md rounded-2xl w-fit'>
                <div className='px-3 pt-2 pb-6 text-center'>
                  <p className='my-4 text-sm text-gray-700'>
                  📍 Atlanta,GA What3Words.com ///notebook.roofer.pushed
                  </p>
                  <ul className='text-sm text-gray-600'>
                    <li className='flex flex-row mx-10 my-2 text-lg justify-left'>
                      <p className='font-bold'>Solana QR POS</p>
                      <p className='ml-auto font-bold text-red-600'>{pizzaOrder.demicolor}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, demicolor: pizzaOrder.demicolor += 1 })}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractPepperoni()}><span>-</span></button>
                    </li>
                    <li className='flex flex-row mx-10 my-2 text-lg justify-left'>
                      <p className='font-bold'>Branded LUV NFT</p>
                      <p className='ml-auto font-bold text-red-600'>{pizzaOrder?.permanentcolor}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, permanentcolor: pizzaOrder.permanentcolor += 1 })}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractMushrooms()}><span>-</span></button>
                    </li>
                    <li className='flex flex-row mx-10 my-2 text-lg justify-left'>
                      <p className='font-bold'>HealXYZ Session</p>
                      <p className='ml-auto font-bold text-red-600'>{pizzaOrder?.silkpress}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, silkpress: pizzaOrder.silkpress += 1 })}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractOlives()}><span>-</span></button>
                    </li>
                  </ul>
                  <h2 className='mt-8 text-2xl'>
                    Order Total :{' '}
                    <span className='text-blue-600 front-heavy'>{total}</span>
                  </h2>
                </div>
              </div>

              {/* Pay QR */}
              {total != 0 && reference && orderNumber && pizzaOrder && (
                <PayQR
                  reference={reference}
                  total={total}
                  order={orderNumber}
                  demicolor={pizzaOrder.demicolor}
                  permanentcolor={pizzaOrder.permanentcolor}
                  silkpress={pizzaOrder.silkpress}
                />
              )}
            </div>
          }
        </div>
      </div>}
    </main>
  );
}
