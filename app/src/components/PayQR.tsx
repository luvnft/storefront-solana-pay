import { encodeURL, createQR } from '@solana/pay';
import { FC, useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { SIMULATED_LOVE_MINT, SIMULATED_USDC_MINT } from '../util/const';


type SupportedSplToken = {
  symbol: string;
  mint?: string;
};

type TransactionRequestQRProps = {
  reference: PublicKey;
  total: number;
  order: number;
  webpos: number;
  luvnft: number;
  healxyz: number;
};

const queryBuilder = (baseUrl: string, params: string[][]) => {
  let url = baseUrl + '?';
  params.forEach((p, i) => url += p[0] + '=' + p[1] + (i != params.length - 1 ? '&' : ''));
  return url;
}

const PayQR: FC<TransactionRequestQRProps> = (
  { reference, total, order, webpos, luvnft, healxyz }
) => {
  const [currentTokenSelection, setCurrentTokenSelection] =
    useState<SupportedSplToken>({ symbol: 'SOL', mint: 'SOL' });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = [
      ['reference', reference.toBase58()],
      ['amount', (total * 0.001).toString()],
      ['order', order.toString()],
      ['webpos', webpos.toString()],
      ['luvnft', luvnft.toString()],
      ['healxyz', healxyz.toString()],
    ];
    if (currentTokenSelection.mint) params.push(['token', currentTokenSelection.mint]);
    const apiUrl = queryBuilder(
      `${window.location.protocol}//${window.location.host}/api/transaction`,
      params,
    );
    console.log(`TOKEN: ${currentTokenSelection.symbol}`)
    const qr = createQR(
      encodeURL({ link: new URL(apiUrl) }),
      360,
      'transparent'
    );
    qr.update({ backgroundOptions: { round: 1000 } });
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [total, reference, currentTokenSelection, order, webpos, luvnft, healxyz]);

  return (
    <div className='flex flex-col justify-between w-auto mx-auto text-center bg-white border border-black border-solid shadow-md rounded-2xl'>
      <div className='m-2 mt-4 justify-self-start'>
        <p>Select an SPL Token to pay with:</p>
        <li className='flex flex-row justify-between mx-10 my-4 text-xl'>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-green-600 p-2 bg-opacity-${currentTokenSelection.symbol === 'SOL' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'SOL', mint: 'SOL' })}
            disabled={currentTokenSelection.symbol === 'SOL'}
          >
            SOL
          </button>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-blue-600 p-2 bg-opacity-${currentTokenSelection.symbol === 'USDC' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'USDC', mint: SIMULATED_USDC_MINT })}
            disabled={currentTokenSelection.symbol === 'USDC'}
          >
            USDC
          </button>
          <button
            className={`rounded-lg border-solid border border-gray-500 bg-orange-400 p-2 bg-opacity-${currentTokenSelection.symbol === 'LOVE' ? 20 : 60}`}
            onClick={() => setCurrentTokenSelection({ symbol: 'LOVE', mint: SIMULATED_LOVE_MINT })}
            disabled={currentTokenSelection.symbol === 'LOVE'}
          >
            LOVE
          </button>
        </li>
        {currentTokenSelection && (
          <p className='my-auto'>
            Current selection:{' '}
            <span
              className={`font-bold text-xl`}
            >
              {currentTokenSelection.symbol}
            </span>
          </p>
        )}
      </div>
      <div ref={ref} className='overflow-hidden rounded-xl'></div>
    </div>
  );
};

export default PayQR;
