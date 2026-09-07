import React, { useState } from 'react';
import { Bookmark, Pin, Share2, Heart, Search, X, Sparkles, AlertCircle, Upload, Flame, ThumbsDown } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

import cursedDiy from '../assets/images/cursed_diy_craft_1788754970424.jpg';
import cursedFood from '../assets/images/cursed_food_recipe_1788754985383.jpg';
import cursedCake from '../assets/images/cursed_cake_disaster_1788755000508.jpg';
import cursedLifehack from '../assets/images/cursed_life_hack_1788755014912.jpg';
import cursedFurniture from '../assets/images/cursed_diy_furniture_1788755324776.jpg';
import cursedServer from '../assets/images/cursed_server_disaster_1788755308246.jpg';

interface WorstPinterestProps {
  onAddRage: () => void;
}

interface PinItem {
  id: string;
  img: string;
  title: string;
  board: string;
  author: string;
  saves: string;
  rating: number;
  commentsCount: number;
  featuredComment: string;
  tags: string[];
}

export const WorstPinterest: React.FC<WorstPinterestProps> = ({ onAddRage }) => {
  const [activeSearch, setActiveSearch] = useState('diy fails that cause physical pain');
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallClosePos, setPaywallClosePos] = useState({ x: 0, y: 0 });
  const [savedBoardToast, setSavedBoardToast] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<PinItem | null>(null);
  const [userFailUploaded, setUserFailUploaded] = useState<string | null>(null);
  const [hoverPinId, setHoverPinId] = useState<string | null>(null);

  const pins: PinItem[] = [
    {
      id: 'pin-1',
      img: cursedDiy,
      title: '🧶 Cursed Melting Monster Teapot Cozy (Beginner Friendly)',
      board: 'Cozy Cottagecore Crafts (Lethal)',
      author: 'CrochetKaren99',
      saves: '4.8M',
      rating: 1,
      commentsCount: 1420,
      featuredComment: 'My house cat saw this on the table and refused to enter the kitchen for 9 consecutive days.',
      tags: ['#crochet', '#nightmare', '#diyfail', '#aesthetic', '#whygodwhy'],
    },
    {
      id: 'pin-2',
      img: cursedFood,
      title: '🌭 1974 Vintage Hot Dog & Green Pea Gelatin Aspic Mold',
      board: 'Thanksgiving Horrors for Family You Dislike',
      author: 'AuntMildredRecipes',
      saves: '1.2M',
      rating: 0,
      commentsCount: 3912,
      featuredComment: 'Served this at our anniversary dinner. My husband silently signed the divorce papers before dessert.',
      tags: ['#vintagefood', '#aspic', '#culinarycrime', '#proteinshake', '#jello'],
    },
    {
      id: 'pin-3',
      img: cursedCake,
      title: '🎂 Melting Toddler Birthday Demon Cake Tutorial',
      board: 'Pinterest Mommy Baking Fails',
      author: 'SugarDisasterMom',
      saves: '890K',
      rating: 1,
      commentsCount: 2105,
      featuredComment: 'The birthday boy started weeping instantly. The candle heat melted the left candy tooth into the table.',
      tags: ['#cakedecorating', '#nailedit', '#horror', '#frostingfail', '#sugarhigh'],
    },
    {
      id: 'pin-4',
      img: cursedLifehack,
      title: '👓 5-Minute Crafts: Duct Tape Glasses-Fork Eating Multitool',
      board: 'Life Hacks for Extremely Lazy Humans',
      author: 'Hacks2Hospital',
      saves: '3.1M',
      rating: 1,
      commentsCount: 5410,
      featuredComment: 'Poked myself in the left eyelid while trying to eat tomato soup. Truly an efficient morning time-saver!',
      tags: ['#lifehacks', '#ducttape', '#genius', '#emergencyroom', '#diyideas'],
    },
    {
      id: 'pin-5',
      img: cursedFurniture,
      title: '👑 Royal Leopard Print Porcelain Toilet Living Room Throne',
      board: 'Cursed Upcycling & Interior Regrets',
      author: 'DesignGuruDisaster',
      saves: '5.9M',
      rating: 0,
      commentsCount: 6812,
      featuredComment: 'My mother-in-law sat in it and was speechless for 45 minutes. The best home makeover investment ever.',
      tags: ['#interiordesign', '#toiletdecor', '#leopardprint', '#upcycling', '#luxury'],
    },
    {
      id: 'pin-6',
      img: cursedServer,
      title: '🍕 100% Organic Marinara Thermal Paste Cloud Rack',
      board: 'Tech Hacks That Void Warranties',
      author: 'SysadminSufferer',
      saves: '2.4M',
      rating: 1,
      commentsCount: 4291,
      featuredComment: 'Ping time dropped to 3ms, but the fire department said we cannot host Minecraft on melted mozzarella.',
      tags: ['#sysadmin', '#pizzafail', '#serverfail', '#overclocking', '#fire'],
    },
  ];

  const searchChips = [
    '🔥 aesthetic kitchen fires',
    '🥒 cucumber & cement coffee table',
    '🧶 toilet seat crochet cozy',
    '🪥 toothbrush made of hot glue',
    '🥑 avocado pit chandelier',
    '🥪 sandwich inside old shoe',
  ];

  const handlePinAction = (pin: PinItem) => {
    playSound('coin');
    onAddRage();
    // Hostile UX: 65% chance to trigger the Pinterest Sign-up Wall of Agony!
    if (Math.random() > 0.35) {
      setShowPaywall(true);
    } else {
      setSavedBoardToast(`Pinned to board: "Things That Haunt My Dreams at 3AM" (+1 Saved Pin)`);
      setTimeout(() => setSavedBoardToast(null), 3000);
    }
  };

  const dodgePaywallClose = () => {
    playSound('beep');
    onAddRage();
    const x = (Math.random() - 0.5) * 220;
    const y = (Math.random() - 0.5) * 140;
    setPaywallClosePos({ x, y });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSound('win');
      onAddRage();
      const preview = URL.createObjectURL(file);
      setUserFailUploaded(preview);
    }
  };

  return (
    <section className="bg-[#f0ece1] border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive]">
      {/* Parody Pinterest Header */}
      <div className="bg-[#e60023] text-white p-4 border-2 border-black flex flex-wrap items-center justify-between gap-3 mb-6 shadow-[4px_4px_0px_#000]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-[#e60023] rounded-full flex items-center justify-center font-['Press_Start_2P',monospace] font-black text-lg shadow-inner">
            P
          </div>
          <div>
            <h2 className="font-['Press_Start_2P',monospace] text-xs md:text-sm text-yellow-300 leading-tight">
              PIN-TERRIBLE: WORST CURSED IDEAS
            </h2>
            <p className="text-xs font-mono text-white mt-0.5">
              50 Million Ideas You Wish You Could Unsee
            </p>
          </div>
        </div>

        {/* Fake Search Bar that auto-glitches */}
        <div className="flex-1 max-w-md bg-white border-2 border-black rounded-full px-3 py-1.5 flex items-center gap-2 text-black shadow-[2px_2px_0px_#000]">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => {
              playSound('glitch');
              setActiveSearch(e.target.value);
            }}
            placeholder="Search cursed crafts & food crimes..."
            className="w-full text-xs font-bold font-mono focus:outline-none bg-transparent"
          />
        </div>

        <button
          onClick={() => {
            playSound('honk');
            setShowPaywall(true);
          }}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
        >
          🔒 Log In with Myspace
        </button>
      </div>

      {/* Suggested Search Pills */}
      <div className="flex flex-wrap gap-1.5 items-center mb-6 pb-2 border-b-2 border-dashed border-gray-400">
        <span className="text-xs font-black text-gray-700 uppercase mr-1">
          Trending Nightmares:
        </span>
        {searchChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => {
              playSound('beep');
              setActiveSearch(chip);
            }}
            className="bg-white hover:bg-red-100 text-black border border-black rounded-full px-2.5 py-1 text-[11px] font-bold shadow-[1px_1px_0px_#000] cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {savedBoardToast && (
        <div className="mb-4 bg-green-200 border-2 border-black p-2.5 text-center font-bold text-xs text-green-900 shadow-[3px_3px_0px_#000] animate-bounce flex items-center justify-center gap-2">
          <Bookmark className="w-4 h-4 text-green-700" />
          {savedBoardToast}
        </div>
      )}

      {/* Masonry Pin Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {pins.map((pin) => (
          <div
            key={pin.id}
            onMouseEnter={() => setHoverPinId(pin.id)}
            onMouseLeave={() => setHoverPinId(null)}
            className="bg-white border-3 border-black rounded-2xl p-3 shadow-[5px_5px_0px_#000] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
          >
            {/* The Image Container with Overlays */}
            <div className="relative rounded-xl overflow-hidden border-2 border-black bg-gray-100 mb-3">
              <img
                src={pin.img}
                alt={pin.title}
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Aggressive "SAVE" Red Buttons on Hover */}
              {hoverPinId === pin.id && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 p-2 animate-in fade-in duration-150">
                  <button
                    onClick={() => handlePinAction(pin)}
                    className="bg-[#e60023] hover:bg-red-700 text-white font-['Press_Start_2P',monospace] text-[9px] px-4 py-2 rounded-full border-2 border-white shadow-[3px_3px_0px_#000] cursor-pointer animate-pulse"
                  >
                    📌 PIN IT NOW!
                  </button>
                  <button
                    onClick={() => {
                      playSound('error');
                      alert('Error: Board "Sanity" is full. Pinned to "Total Regret" instead.');
                    }}
                    className="bg-white/90 text-black font-bold text-[10px] px-3 py-1 rounded-full border border-black cursor-pointer"
                  >
                    Save to Secret Board
                  </button>
                </div>
              )}

              {/* Pin Badge */}
              <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] font-mono font-black px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000]">
                {pin.saves} SAVES
              </div>
            </div>

            {/* Pin Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 leading-snug mb-1">
                  {pin.title}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono mb-2">
                  Board: <strong className="text-purple-800">{pin.board}</strong>
                </p>

                {/* Featured Cursed Review */}
                <div className="bg-yellow-50 border border-black p-2 rounded-lg text-[11px] text-gray-800 italic mb-3">
                  💬 &quot;{pin.featuredComment}&quot;
                </div>
              </div>

              {/* Tags & Action row */}
              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pin.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Rating: 0.1 / 5</span>
                  </div>

                  <button
                    onClick={() => handlePinAction(pin)}
                    className="bg-[#e60023] hover:bg-red-700 text-white font-bold text-xs px-3 py-1 rounded-full border border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1"
                  >
                    <Pin className="w-3 h-3" /> Pin
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User "Upload Your Own Pinterest Catastrophe" Area */}
      <div className="bg-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] mb-8">
        <div className="bg-purple-900 text-yellow-300 p-2.5 rounded-xl border-2 border-black flex items-center justify-between mb-4">
          <h3 className="font-['Press_Start_2P',monospace] text-xs flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-300" />
            SUBMIT YOUR OWN CURSED PINTEREST CRAFT
          </h3>
          <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded-full">
            100% JUDGMENT GUARANTEED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <p className="text-xs text-gray-700 mb-3">
              Did you attempt a 5-minute craft and accidentally summon an ancient entity? Upload your craft or culinary disaster photo below:
            </p>

            <label className="border-3 border-dashed border-red-500 bg-pink-50/50 hover:bg-pink-100 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-8 h-8 text-red-600 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-black">
                Drag and drop your fail here or click to browse
              </span>
              <span className="text-[10px] text-gray-500 font-mono mt-1">
                Accepts JPG, PNG, WEBP (and your tears)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="border-2 border-black rounded-xl p-4 bg-amber-50 min-h-[160px] flex flex-col items-center justify-center text-center">
            {userFailUploaded ? (
              <div className="space-y-2">
                <img
                  src={userFailUploaded}
                  alt="Your uploaded fail"
                  className="max-h-40 rounded-lg border-2 border-black mx-auto shadow-[3px_3px_0px_#000]"
                />
                <div className="bg-red-600 text-white font-mono text-xs font-bold px-2 py-1 rounded-sm">
                  VERDICT: 10/10 CERTIFIED DISASTER!
                </div>
                <p className="text-[11px] text-gray-700 italic">
                  &quot;This belongs in the Louvre of Bad Decisions.&quot;
                </p>
              </div>
            ) : (
              <div className="text-gray-400 font-mono text-xs">
                [Your uploaded craft disaster preview will appear here]
              </div>
            )}
          </div>
        </div>
      </div>

      {/* The Notorious Pinterest Sign-up Wall of Agony */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl p-6 max-w-md w-full shadow-[12px_12px_0px_#e60023] font-['Comic_Neue',cursive] text-center relative animate-in zoom-in-95">
            {/* The Evasive Close Button */}
            <button
              onMouseEnter={dodgePaywallClose}
              onClick={dodgePaywallClose}
              style={{
                transform: `translate(${paywallClosePos.x}px, ${paywallClosePos.y}px)`,
                transition: 'transform 0.12s ease-out',
              }}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full border-2 border-black flex items-center justify-center font-bold text-xs cursor-pointer shadow-[2px_2px_0px_#000]"
              title="Try to close this paywall"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 bg-[#e60023] text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black mb-3 font-['Press_Start_2P',monospace] shadow-lg">
              P
            </div>

            <h3 className="font-['Press_Start_2P',monospace] text-xs text-red-600 mb-2 leading-snug">
              HOLD UP! SIGN UP TO SCROLL 1 MILLIMETER MORE
            </h3>

            <p className="text-xs text-gray-700 mb-4 leading-relaxed">
              You have browsed 3 cursed pins. To unlock infinite endless scrolling of ruined casseroles and hot-glue atrocities, you must authenticate your soul:
            </p>

            <div className="space-y-2.5 mb-4">
              <button
                onClick={() => {
                  playSound('error');
                  alert('Error: Your Facebook account is too mature for this nonsense.');
                }}
                className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-bold py-2.5 px-4 text-xs rounded-full border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Continue with Facebook (from 2009)
              </button>

              <button
                onClick={() => {
                  playSound('error');
                  alert('Error: Google refuses to be associated with hot dog gelatin molds.');
                }}
                className="w-full bg-white hover:bg-gray-50 text-black font-bold py-2.5 px-4 text-xs rounded-full border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
              >
                Continue with Google
              </button>

              <button
                onClick={() => {
                  playSound('glitch');
                  alert('Dialing your high school math teacher for identity confirmation...');
                }}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 px-4 text-xs rounded-full border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                Continue with AOL Instant Messenger (AIM)
              </button>
            </div>

            <button
              onClick={() => {
                playSound('win');
                setShowPaywall(false);
              }}
              className="text-[11px] text-gray-400 hover:text-black underline font-mono cursor-pointer"
            >
              [Mercy Pass: I swear I will only look, not touch]
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
