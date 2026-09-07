import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CreditCard, DollarSign, Sparkles, AlertTriangle, Check, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

import cursedServer from '../assets/images/cursed_server_disaster_1788755308246.jpg';
import cursedFurniture from '../assets/images/cursed_diy_furniture_1788755324776.jpg';

interface WorstStoreProps {
  onAddRage: () => void;
}

export const WorstStore: React.FC<WorstStoreProps> = ({ onAddRage }) => {
  // Dynamic price surge on items
  const [waterPrice, setWaterPrice] = useState(14.99);
  const [cartCount, setCartCount] = useState(0);
  const [tipPercent, setTipPercent] = useState(150);
  const [shippingMethod, setShippingMethod] = useState<'pigeon' | 'snail' | 'quantum'>('pigeon');
  const [cardNumber, setCardNumber] = useState('');
  const [placeOrderOffset, setPlaceOrderOffset] = useState({ x: 0, y: 0 });
  const [orderPlacedToast, setOrderPlacedToast] = useState(false);
  const [autoInsurance, setAutoInsurance] = useState(true);

  // Prices dynamically surge to simulate predatory surge pricing
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterPrice((p) => +(p + (Math.random() * 2 - 0.3)).toFixed(2));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productName: string) => {
    playSound('coin');
    onAddRage();
    // Hostile UX: adding 1 actually adds 10!
    setCartCount((c) => c + 10);
    alert(`AUTOMATIC BUNDLE: To protect the planet, we added 10x units of "${productName}" to your cart!`);
  };

  const dodgePlaceOrder = () => {
    playSound('beep');
    onAddRage();
    const x = (Math.random() - 0.5) * 260;
    const y = (Math.random() - 0.5) * 100;
    setPlaceOrderOffset({ x, y });
  };

  const handleCardTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('glitch');
    // Scrambles input
    const val = e.target.value;
    const scrambled = val
      .split('')
      .map((c) => (Math.random() > 0.4 ? 'X' : c))
      .join('');
    setCardNumber(scrambled);
  };

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    playSound('honk');
    setTipPercent(val);
    if (val < 50) {
      alert('TIP WARNING: Tipping under 50% makes our server hamster cry. Emotional damage fee ($25) added.');
    }
  };

  const calculateSubtotal = () => {
    return cartCount * 14.99;
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    const tip = (sub * tipPercent) / 100;
    const shipping = shippingMethod === 'pigeon' ? 45 : shippingMethod === 'snail' ? 89 : 299;
    const fee = autoInsurance ? 35 : 0;
    return +(sub + tip + shipping + fee).toFixed(2);
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('win');
    setOrderPlacedToast(true);
  };

  return (
    <section className="bg-lime-200 border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive]">
      {/* Header */}
      <div className="bg-red-600 text-yellow-300 p-3 border-2 border-black flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-['Press_Start_2P',monospace] text-sm md:text-base flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white animate-bounce" />
            THE PREDATORY E-COMMERCE BAZAAR
          </h2>
          <p className="text-[11px] font-mono text-white mt-1">
            Official Guinness Record for Most Hidden Surcharges & Fleeing Buttons
          </p>
        </div>
        <div className="bg-black text-lime-400 font-mono text-xs px-3 py-1.5 border border-yellow-400 font-bold shadow-[2px_2px_0px_#fff]">
          CART: {cartCount} ITEMS (${calculateSubtotal().toFixed(2)})
        </div>
      </div>

      {/* Product Catalog */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Item 1 */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-yellow-300 border border-black p-1 text-[10px] font-bold text-center text-red-700 uppercase mb-2 animate-pulse">
              ⚡ LIVE SURGE PRICING!
            </div>
            <div className="h-28 bg-blue-100 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-3xl mb-2">
              💧📦
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              Dehydrated Water Can
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              100% dry hydrogen. Just add 500ml of water to activate.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              ${waterPrice}{' '}
              <span className="text-[10px] text-gray-500 line-through">$4.99</span>
            </div>
            <button
              onClick={() => handleAddToCart('Dehydrated Water')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-pink-300 border border-black p-1 text-[10px] font-bold text-center text-pink-900 uppercase mb-2">
              ONLY 1 REMAINING!
            </div>
            <div className="h-28 bg-gray-100 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-3xl mb-2">
              🎧🗑️
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              Single Left AirPod (3rd Owner)
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              Found on subway floor. Plays mysterious Morse code at night.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              $49.99
            </div>
            <button
              onClick={() => handleAddToCart('Single Left AirPod')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-green-300 border border-black p-1 text-[10px] font-bold text-center text-green-900 uppercase mb-2">
              ECO CERTIFIED
            </div>
            <div className="h-28 bg-lime-100 border-2 border-dashed border-lime-400 flex flex-col items-center justify-center text-3xl mb-2">
              🟩✨
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              One Free-Range Pixel (#00FF00)
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              Guaranteed 100% vegetarian, non-GMO phosphor pixel.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              $0.05 <span className="text-[9px] text-gray-500">(+$89 handling)</span>
            </div>
            <button
              onClick={() => handleAddToCart('Organic Pixel')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>

        {/* Item 4 */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-purple-300 border border-black p-1 text-[10px] font-bold text-center text-purple-900 uppercase mb-2">
              HOT MYSTERY
            </div>
            <div className="h-28 bg-amber-100 border-2 border-dashed border-amber-400 flex flex-col items-center justify-center text-3xl mb-2">
              📦❓
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              Cardboard Box of Regret
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              May contain pure air, or an expired coupon from Blockbuster.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              $29.99
            </div>
            <button
              onClick={() => handleAddToCart('Box of Regret')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>

        {/* Item 5: Cursed Pizza Server Rack */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-red-600 text-white p-1 text-[10px] font-bold text-center uppercase mb-2 animate-pulse">
              🔥 OVERHEATED CLOUD SERVER
            </div>
            <div className="h-32 bg-gray-900 border-2 border-black rounded-sm overflow-hidden mb-2">
              <img
                src={cursedServer}
                alt="Smoking server covered in pizza"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              Pepperoni-Cooled Cloud Server
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              Runs Linux on marinara thermal paste. Smoke smell included.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              $1,499.00
            </div>
            <button
              onClick={() => handleAddToCart('Pepperoni Cloud Server')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>

        {/* Item 6: Leopard Toilet Sofa */}
        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="bg-purple-600 text-yellow-300 p-1 text-[10px] font-bold text-center uppercase mb-2">
              👑 ROYALTY LIVING ROOM
            </div>
            <div className="h-32 bg-amber-100 border-2 border-black rounded-sm overflow-hidden mb-2">
              <img
                src={cursedFurniture}
                alt="Leopard print toilet armchair"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-sm text-purple-900 leading-tight">
              Leopard Porcelain Throne Couch
            </h4>
            <p className="text-[11px] text-gray-600 my-1">
              Plush velvet armrests on vintage glazed ceramic. Zero plumbing needed.
            </p>
          </div>
          <div>
            <div className="text-base font-black text-red-600 font-mono mb-2">
              $899.99
            </div>
            <button
              onClick={() => handleAddToCart('Porcelain Throne Couch')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-1.5 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              ADD TO CART (+10x)
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Arena from Hell */}
      <div className="bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_#000]">
        <div className="bg-purple-900 text-yellow-300 p-2 border-2 border-black mb-4 flex items-center justify-between">
          <h3 className="font-['Press_Start_2P',monospace] text-xs flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-300" />
            CHECKOUT GAUNTLET
          </h3>
          <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5">
            SURCHARGES MANDATORY
          </span>
        </div>

        <form onSubmit={handleFinishOrder} className="space-y-4">
          {/* Tip Slider */}
          <div className="bg-yellow-100 p-3 border-2 border-black">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-black uppercase">
                1. Server Emotional Support Tip (Default: 150%):
              </label>
              <span className="bg-red-600 text-white font-mono text-xs px-2 py-0.5 font-bold">
                {tipPercent}% (${((calculateSubtotal() * tipPercent) / 100).toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              value={tipPercent}
              onChange={handleTipChange}
              className="w-full accent-red-600 cursor-pointer"
            />
            <p className="text-[10px] text-gray-600 italic">
              Slide below 50% at your own moral hazard.
            </p>
          </div>

          {/* Shipping Method */}
          <div className="bg-blue-50 p-3 border-2 border-black">
            <label className="block text-xs font-bold text-black uppercase mb-2">
              2. Choose Your Inconvenient Shipping Method:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
              <label className={`p-2 border-2 border-black flex items-center gap-2 cursor-pointer ${shippingMethod === 'pigeon' ? 'bg-yellow-300 font-bold' : 'bg-white'}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'pigeon'}
                  onChange={() => {
                    playSound('beep');
                    setShippingMethod('pigeon');
                  }}
                />
                <span>Carrier Pigeon ($45.00, 18-24 Mo)</span>
              </label>

              <label className={`p-2 border-2 border-black flex items-center gap-2 cursor-pointer ${shippingMethod === 'snail' ? 'bg-yellow-300 font-bold' : 'bg-white'}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'snail'}
                  onChange={() => {
                    playSound('beep');
                    setShippingMethod('snail');
                  }}
                />
                <span>Snail Express ($89.00, 3-5 Years)</span>
              </label>

              <label className={`p-2 border-2 border-black flex items-center gap-2 cursor-pointer ${shippingMethod === 'quantum' ? 'bg-yellow-300 font-bold' : 'bg-white'}`}>
                <input
                  type="radio"
                  name="shipping"
                  checked={shippingMethod === 'quantum'}
                  onChange={() => {
                    playSound('beep');
                    setShippingMethod('quantum');
                  }}
                />
                <span>Quantum Beam ($299.00, 0% Success)</span>
              </label>
            </div>
          </div>

          {/* Card Number */}
          <div className="bg-gray-50 p-3 border-2 border-black">
            <label className="block text-xs font-bold text-black uppercase mb-1">
              3. Credit Card Number (Auto-Scrambled for Security):
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardTyping}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-white border-2 border-black p-2 font-mono text-sm tracking-widest focus:bg-pink-50"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              Every key you press is randomly converted to &apos;X&apos; to protect your identity from yourself.
            </p>
          </div>

          {/* Auto Insurance Checkbox */}
          <div className="bg-amber-100 p-2 border border-black flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoInsurance}
                onChange={(e) => {
                  playSound('error');
                  if (!e.target.checked) {
                    alert('NICE TRY: Unchecking package insurance voids your guarantee of oxygen.');
                  }
                  setAutoInsurance(true); // Automatically forces true!
                }}
                className="accent-red-600"
              />
              <span className="font-bold">
                Mandatory Cosmic Insurance Fee ($35.00) (Cannot be unchecked)
              </span>
            </label>
            <ShieldCheck className="w-4 h-4 text-green-700" />
          </div>

          {/* Total Breakdown */}
          <div className="bg-black text-lime-400 p-4 border-2 border-yellow-400 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span>Items Subtotal ({cartCount} units):</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-yellow-300">
              <span>Required Tip ({tipPercent}%):</span>
              <span>${((calculateSubtotal() * tipPercent) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cyan-300">
              <span>Shipping ({shippingMethod}):</span>
              <span>${shippingMethod === 'pigeon' ? '45.00' : shippingMethod === 'snail' ? '89.00' : '299.00'}</span>
            </div>
            <div className="flex justify-between text-pink-300">
              <span>Cosmic Insurance:</span>
              <span>$35.00</span>
            </div>
            <div className="border-t border-dashed border-lime-400 pt-2 flex justify-between text-sm md:text-base font-bold text-red-500">
              <span>TOTAL DAMAGE:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          {/* Running Place Order Button */}
          <div className="relative min-h-[90px] border-2 border-dashed border-red-500 bg-red-100 flex items-center justify-center p-2 overflow-hidden">
            <button
              type="submit"
              onMouseEnter={dodgePlaceOrder}
              style={{
                transform: `translate(${placeOrderOffset.x}px, ${placeOrderOffset.y}px)`,
                transition: 'transform 0.12s ease-out',
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-['Press_Start_2P',monospace] text-xs py-3 px-6 border-4 border-black shadow-[4px_4px_0px_#000] cursor-pointer select-none"
            >
              💸 PLACE ORDER & SURRENDER WEALTH
            </button>
          </div>
        </form>

        {orderPlacedToast && (
          <div className="mt-4 bg-green-200 border-2 border-black p-4 text-center animate-bounce">
            <h4 className="font-bold text-sm text-green-900">
              🎉 TRANSACTION SUCCESSFUL!
            </h4>
            <p className="text-xs text-green-800 mt-1">
              We charged ${calculateTotal()} to your card. Your Carrier Pigeon has departed from Antarctica. Estimated arrival: October 2028.
            </p>
            <button
              onClick={() => setOrderPlacedToast(false)}
              className="mt-2 bg-black text-white px-3 py-1 text-xs font-mono font-bold cursor-pointer"
            >
              Acknowledge Bankruptcy
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
