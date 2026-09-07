import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Flame, MessageSquare, Share2, Sparkles, TrendingUp, AlertTriangle, Award, ThumbsUp, Heart, Laugh, Compass, Volume2, RefreshCw, Eye, CheckCircle2, Send, Mail } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import { TARGET_GMAIL } from './FeedbackReviewModal';

import bdViralTraffic from '../assets/images/bd_viral_traffic_1788758465436.jpg';
import bdViralBiryani from '../assets/images/bd_viral_biryani_1788758485864.jpg';
import bdViralTeaStall from '../assets/images/bd_viral_tea_stall_1788758506463.jpg';
import bdViralPadmaBridge from '../assets/images/bd_viral_padma_bridge_1788758522959.jpg';

export interface ViralArticle {
  id: string;
  category: 'traffic' | 'biryani' | 'tea' | 'bridge';
  categoryLabelBn: string;
  categoryLabelEn: string;
  titleBn: string;
  titleEn: string;
  badge: string;
  image: string;
  views: string;
  readingAgony: string;
  summaryBn: string;
  summaryEn: string;
  quote: string;
  quoteAuthor: string;
  reactions: {
    laugh: number;
    fire: number;
    shock: number;
  };
}

const VIRAL_ARTICLES: ViralArticle[] = [
  {
    id: 'art-traffic',
    category: 'traffic',
    categoryLabelBn: '🚗 ঢাকা জ্যাম ও পরিবহন',
    categoryLabelEn: 'Dhaka Traffic Gridlock',
    titleBn: 'ফার্মগেট সিগন্যালে ৩ ঘণ্টা আটকে থেকে সিএনজি ড্রাইভারের সাথে বিয়ে সেরে ফেললেন যাত্রী!',
    titleEn: 'Stuck for 3 Hours at Farmgate: Commuter Marries CNG Driver Out of Pure Boredom',
    badge: '🔥 মেগা ভাইরাল',
    image: bdViralTraffic,
    views: '২.৮ মিলিয়ন ভিউ',
    readingAgony: '৯৮% মেজাজ গরম',
    summaryBn: 'মিরপুর থেকে মতিঝিল যাওয়ার পথে ফার্মগেটের জ্যামে স্থবির হয়ে যায় জনজীবন। গাড়ির ভেতর বসে বসে লুডু খেলা, কবিতা আবৃত্তি এবং অবশেষে পারিবারিক সমঝোতায় কাজি ডেকে বিয়ে সম্পন্ন করেন ভুক্তভোগী এক যাত্রী। প্রত্যক্ষদর্শীরা বলছেন, জ্যাম ছাড়ার আগেই তাদের হানিমুন ট্রিপও পরিকল্পনা শেষ!',
    summaryEn: 'Traffic was so permanently halted between Farmgate and Shahbagh that passengers formed a temporary local sovereign democracy, played board games, and held an impromptu wedding ceremony before the red signal turned amber.',
    quote: '"ভাই জ্যামে তো বসে আছিই, ভাবলাম একটা সংসার পেতে ফেলি!"',
    quoteAuthor: '— মোশাররফ করিম ফ্যান ক্লাব প্রতিনিধি',
    reactions: { laugh: 1420, fire: 890, shock: 310 },
  },
  {
    id: 'art-biryani',
    category: 'biryani',
    categoryLabelBn: '🍗 বিয়ে বাড়ি ও কাচ্চি রণক্ষেত্র',
    categoryLabelEn: 'Biye Bari Biryani War',
    titleBn: 'কাচ্চি বিরিয়ানিতে খাসির নাল্লী ও বড় আলু কম পড়ায় বরপক্ষ ও কনেপক্ষের তুমুল ধস্তাধস্তি!',
    titleEn: 'Epic Feast War: Wedding Erupts as Uncles Brawl Over Size of Mutton Shank and Potato',
    badge: '⚡ শীর্ষ ট্রেন্ডিং',
    image: bdViralBiryani,
    views: '৪.১ মিলিয়ন ভিউ',
    readingAgony: '১০০% কাচ্চি পাগল',
    summaryBn: 'মিরপুরের এক কমিউনিটি সেন্টারে দ্বিতীয় রাউন্ড কাচ্চি পরিবেশনের সময় বড় খাসির নাল্লী এক চাচার পাতে না দিয়ে বরের মামার পাতে দেওয়ায় কূটনৈতিক সঙ্কট চরমে পৌঁছায়। এরপর সালাদের শসা ও বোরহানির বোতলকে ঢাল বানিয়ে বীরদর্পে লড়াই করেন উভয় পক্ষের অভিজ্ঞ মুরুব্বিরা।',
    summaryEn: 'International peace treaties trembled as two factions clashed over the equitable distribution of spiced potatoes and prime mutton shanks. Eyewitnesses confirmed the Borhani was weaponized.',
    quote: '"কাচ্চিতে আলু নাই মানে সম্মানে আঘাত! আমরা এই সমঝোতা মানি না!"',
    quoteAuthor: '— বিক্ষুব্ধ মেঝ মামা',
    reactions: { laugh: 2940, fire: 1850, shock: 540 },
  },
  {
    id: 'art-tea',
    category: 'tea',
    categoryLabelBn: '☕ টংয়ের চা ও বিশ্বরাজনীতি',
    categoryLabelEn: 'Tong Er Dokan Think Tank',
    titleBn: '৭ কাপ মালাই চা খেয়ে জাতিসংঘকে পাশ কাটিয়ে মধ্যপ্রাচ্য ও ইউক্রেন সংকট সমাধান করলেন মতি চাচার দল!',
    titleEn: 'Local Tea Stall Elders Resolve Global Geopolitical Conflicts in 7 Cups of Condensed Milk Tea',
    badge: '🧠 মহা বিশেষজ্ঞ',
    image: bdViralTeaStall,
    views: '১.৯ মিলিয়ন ভিউ',
    readingAgony: '৮৫% আড্ডাবাজি',
    summaryBn: 'ধানমন্ডি লেকের পাড়ে লাল-সবুজ সাইনবোর্ডের টং দোকানে সন্ধ্যা ৭টা থেকে রাত ২টা পর্যন্ত তুমুল আলোচনার পর মার্কিন অর্থনীতি, জ্বালানি তেল সিন্ডিকেট এবং আইসিসি ক্রিকেট বিশ্বকাপের ফরম্যাট পুনর্গঠন করেছেন একদল চা-প্রেমী বিশেষজ্ঞ চাচা। জাতিসংঘ প্রতিনিধিরা নাকি নোট নিতে ঢাকায় আসছেন।',
    summaryEn: 'Armed with boiling condensed milk tea and toast biscuits, four neighborhood uncles drafted a comprehensive geopolitical blueprint that outperforms standard diplomacy by 400%.',
    quote: '"আরে তুমি বোঝ না, আসল গেমটা তো চলতেছে সুইজারল্যান্ডের ব্যাংকে!"',
    quoteAuthor: '— বিশিষ্ট টং তাত্ত্বিক করিম কাকা',
    reactions: { laugh: 3100, fire: 1200, shock: 410 },
  },
  {
    id: 'art-bridge',
    category: 'bridge',
    categoryLabelBn: '📸 পদ্মা সেতু সেলফি গ্যাং',
    categoryLabelEn: 'Padma Bridge Selfie Craze',
    titleBn: 'পদ্মা সেতুতে সেলফি স্টিক দিয়ে ড্রোন ভূপাতিত করে ‘ভাইরাল নায়ক’ খেতাব পেলেন বরিশালের যুবক!',
    titleEn: 'Padma Bridge Tourist Swats Low-Flying Drone with 8-Foot Telescopic Selfie Stick',
    badge: '👑 ভাইরাল কিং',
    image: bdViralPadmaBridge,
    views: '৩.৫ মিলিয়ন ভিউ',
    readingAgony: '৯৩% চরম নাটকীয়',
    summaryBn: 'পদ্মা সেতুর টোল প্লাজার কাছে সানগ্লাস পরে স্লো-মোশনে টিকটক ভিডিও বানানোর সময় একটি শখের ড্রোন বেশি কাছাকাছি চলে আসায় ৮ ফুট লম্বা সেলফি স্টিক দিয়ে ক্রিকেট শট মেরে তা নামিয়ে ফেলেন এক যুবক। ভিডিওটি ফেসবুকে ছাড়ার সাথে সাথে ৫ লাখ শেয়ার হয়েছে!',
    summaryEn: 'Posing in neon aviators at golden hour over the mighty river, a tourist reflexively smacked down an encroaching recording drone like Shakib Al Hasan hitting a cover drive.',
    quote: '"ড্রোন আমার মুখের ফিল্টার নষ্ট করতে আসছিল, তাই আর ধৈর্য ধরতে পারলাম না!"',
    quoteAuthor: '— ভাইরাল রিলস স্টার',
    reactions: { laugh: 2150, fire: 1670, shock: 820 },
  },
];

const PROCEDURAL_HEADLINES = [
  '🚨 ব্রেকিং: মিরপুর ১০ নম্বরে ড্রেন পরিষ্কার করতে গিয়ে পাওয়া গেল নবাব সিরাজউদ্দৌলার লুকানো কাচ্চি বিরিয়ানির রেসিপি!',
  '🚨 ব্রেকিং: ফেসবুক লাইভে এসে ১৬ ঘণ্টা একটানা কান্না করায় টিকটকারকে দেয়া হলো আন্তর্জাতিক কূটনৈতিক স্কলারশিপ!',
  '🚨 ব্রেকিং: রিকশাচালক ও যাত্রীর ১০ টাকা ভাড়া নিয়ে তর্ক জাতিসংঘের বিশেষ অধিবেশনে পেশ করার প্রস্তাব!',
  '🚨 ব্রেকিং: উত্তরায় বাড়ির ছাদে এলিয়েন নামার পর চা-বিস্কুট খাইয়ে আপ্যায়ন করলেন স্থানীয় বাড়িওয়ালা আঙ্কেল!',
  '🚨 ব্রেকিং: পরীক্ষার প্রশ্নপত্র আগেই কঠিন হওয়ার আশঙ্কায় পুরো ব্যাচ মিলে ফেসবুক গ্রুপে কান্নার ইভেন্ট আয়োজন করেছে!',
  '🚨 ব্রেকিং: ঢাকায় তীব্র যানজটের কারণে অফিস পৌঁছাতে না পেরে হেলিকপ্টার রেন্টাল সার্ভিস চালু করলেন কেরানীগঞ্জের পাইকার!',
];

interface BangladeshViralNewsProps {
  onOpenFeedbackModal: () => void;
  onGainXp: (amount: number) => void;
}

export const BangladeshViralNews: React.FC<BangladeshViralNewsProps> = ({
  onOpenFeedbackModal,
  onGainXp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<ViralArticle[]>(VIRAL_ARTICLES);
  const [generatedHeadline, setGeneratedHeadline] = useState<string | null>(null);
  const [activeReactionToast, setActiveReactionToast] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const filterCategories = [
    { id: 'all', label: '🔥 সব ভাইরাল (All Viral)' },
    { id: 'traffic', label: '🚗 ঢাকা ট্রাফিক (Traffic)' },
    { id: 'biryani', label: '🍗 কাচ্চি রণক্ষেত্র (Biryani)' },
    { id: 'tea', label: '☕ টংয়ের আড্ডা (Tea Adda)' },
    { id: 'bridge', label: '📸 পদ্মা সেতু (Bridge)' },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const handleReaction = (articleId: string, type: 'laugh' | 'fire' | 'shock', bnName: string) => {
    playSound('coin');
    onGainXp(5);
    setArticles((prev) =>
      prev.map((art) => {
        if (art.id === articleId) {
          return {
            ...art,
            reactions: {
              ...art.reactions,
              [type]: art.reactions[type] + 1,
            },
          };
        }
        return art;
      })
    );

    setActiveReactionToast(`রিঅ্যাক্ট দিয়েছেন: ${bnName}! (+5 Agony XP)`);
    setTimeout(() => setActiveReactionToast(null), 2500);
  };

  const handleGenerateHeadline = () => {
    playSound('win');
    onGainXp(15);
    const randomIndex = Math.floor(Math.random() * PROCEDURAL_HEADLINES.length);
    setGeneratedHeadline(PROCEDURAL_HEADLINES[randomIndex]);
  };

  const handleShare = (title: string) => {
    playSound('click');
    onGainXp(5);
    navigator.clipboard?.writeText?.(`${title} — World's Worst Website (BD Viral Edition)`);
    setShareToast('সংবাদ কপি হয়েছে! বন্ধুদের পাঠিয়ে হাসাহাসি করুন (+5 XP)');
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <section
      id="bangladesh-viral-news-section"
      className="bg-[#0e041c] border-4 border-yellow-400 p-4 sm:p-6 shadow-[10px_10px_0px_#000] text-gray-100 font-sans space-y-6 select-none my-8 relative overflow-hidden"
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Flashing Breaking News Marquee */}
      <div className="bg-red-600 border-2 border-yellow-300 text-yellow-300 p-2 font-mono text-xs font-black flex items-center gap-2 overflow-hidden shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1 text-[11px] font-black tracking-widest shrink-0 animate-pulse">
          <Flame className="w-4 h-4 text-red-500 fill-red-500" />
          <span>ব্রেকিং নিউজ</span>
        </div>
        <div className="whitespace-nowrap overflow-x-auto scrollbar-none py-0.5 animate-marquee text-xs">
          🚨 ফার্মগেটে যানজটে বাসর রাত কাটালেন বরযাত্রীরা! &bull; 🍗 কাচ্চির আলু কম পড়ায় বিয়ে বাড়িতে তুমুল সংঘর্ষ! &bull; 📸 পদ্মা সেতুতে সেলফি স্টিক দিয়ে ড্রোন ভূপাতিত! &bull; ☕ টং দোকানে ৭ কাপ মালাই চা খেয়ে আইএমএফ সমস্যা সমাধান! &bull; 📩 সব মতামত সরাসরি ক্রিয়েটরের ইনবক্সে পাঠানো হচ্ছে!
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-yellow-400 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-green-700 text-white font-mono font-black text-xs px-2.5 py-0.5 border border-yellow-300">
              🇧🇩 বাংলাদেশ স্পেশাল সংস্করণ
            </span>
            <span className="bg-red-600 text-yellow-300 font-mono font-bold text-xs px-2 py-0.5 animate-bounce">
              VIRAL EXCLUSIVE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tracking-tight flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-yellow-400 animate-pulse" />
            <span>ভাইরাল বাংলাদেশ নিউজ &bull; VIRAL NEWS BD</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-mono">
            সোশ্যাল মিডিয়া কাঁপানো খাঁটি বাংলাদেশি ভাইরাল ড্রামা, ট্রাফিক প্যারা, কাচ্চি বিরিয়ানির রণক্ষেত্র এবং টংয়ের চায়ের আড্ডা!
          </p>
        </div>

        {/* Action Buttons: Generator & Direct Gmail Feedback */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleGenerateHeadline}
            className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black px-3.5 py-2 font-mono font-black text-xs flex items-center gap-1.5 shadow-[3px_3px_0px_#000] cursor-pointer active:scale-95 transition-all"
            title="Generate procedural ridiculous news (+15 XP)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-black" />
            <span>🎲 ফেক নিউজ জেনারেটর (+15 XP)</span>
          </button>

          <button
            onClick={() => {
              playSound('coin');
              onOpenFeedbackModal();
            }}
            className="bg-purple-900 hover:bg-purple-800 text-cyan-300 border-2 border-cyan-400 px-3.5 py-2 font-mono font-bold text-xs flex items-center gap-1.5 shadow-[3px_3px_0px_#000] cursor-pointer active:scale-95 transition-all"
            title="Send your reviews directly to Creator Inbox"
          >
            <Mail className="w-3.5 h-3.5 text-yellow-300" />
            <span>মতামত পাঠান (Developer Mailbox)</span>
          </button>
        </div>
      </div>

      {/* Generated Headline Banner (If active) */}
      <AnimatePresence>
        {generatedHeadline && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-red-900 via-purple-900 to-black border-2 border-yellow-400 p-3 text-yellow-200 font-mono text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-[4px_4px_0px_#000]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 animate-spin" />
              <span>{generatedHeadline}</span>
            </div>
            <button
              onClick={() => handleShare(generatedHeadline)}
              className="bg-black text-yellow-300 hover:text-white px-2.5 py-1 text-xs border border-yellow-400 shrink-0 cursor-pointer"
            >
              কপি করুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Category Tabs */}
      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
        {filterCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playSound('click');
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 font-bold border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_#000] ${
              selectedCategory === cat.id
                ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_#fff]'
                : 'bg-[#1b0a33] text-gray-300 hover:bg-purple-900 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Viral News with Bangladesh Custom Imagery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-[#120722] border-3 border-purple-600/90 hover:border-yellow-400 p-4 space-y-3.5 transition-colors shadow-[6px_6px_0px_#000] flex flex-col justify-between"
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 font-bold">
                {art.categoryLabelBn}
              </span>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Eye className="w-3 h-3" />
                  {art.views}
                </span>
                <span className="text-pink-400 font-bold bg-black px-1.5 py-0.5 border border-purple-800">
                  {art.badge}
                </span>
              </div>
            </div>

            {/* Custom Generated High-Resolution Bangladesh Artwork */}
            <div className="relative border-2 border-black overflow-hidden group">
              <img
                src={art.image}
                alt={art.titleBn}
                referrerPolicy="no-referrer"
                className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110 brightness-105"
              />
              <div className="absolute top-2 left-2 bg-black/85 text-yellow-300 font-mono text-[10px] font-bold px-2 py-0.5 border border-yellow-400">
                {art.readingAgony}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[9px] px-2 py-0.5">
                SATIRICAL PHOTO ARCHIVE
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-yellow-300 leading-snug font-sans hover:text-yellow-200">
                {art.titleBn}
              </h3>
              <p className="text-[11px] text-gray-400 font-mono italic leading-tight">
                {art.titleEn}
              </p>
            </div>

            {/* Satirical Summary */}
            <p className="text-xs text-gray-200 leading-relaxed font-sans font-normal border-l-2 border-yellow-400/70 pl-2.5">
              {art.summaryBn}
            </p>

            {/* Famous Quote Box */}
            <div className="bg-[#1e0a38] border border-purple-500/60 p-2.5 space-y-1 font-mono text-xs">
              <div className="text-yellow-200 italic font-medium">
                {art.quote}
              </div>
              <div className="text-[10px] text-right text-pink-400 font-bold">
                {art.quoteAuthor}
              </div>
            </div>

            {/* Interactive Reactions Bar */}
            <div className="pt-2 border-t border-purple-900 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleReaction(art.id, 'laugh', 'হাসতে হাসতে শেষ')}
                  className="bg-black hover:bg-yellow-500 hover:text-black text-yellow-300 border border-yellow-500/70 px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  title="Laugh Reaction (+5 XP)"
                >
                  <Laugh className="w-3.5 h-3.5 text-yellow-400" />
                  <span>😂 {art.reactions.laugh}</span>
                </button>

                <button
                  onClick={() => handleReaction(art.id, 'fire', 'মারাত্মক আগুন')}
                  className="bg-black hover:bg-red-600 hover:text-white text-orange-300 border border-orange-500/70 px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  title="Fire Reaction (+5 XP)"
                >
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>🔥 {art.reactions.fire}</span>
                </button>

                <button
                  onClick={() => handleReaction(art.id, 'shock', 'চরম শক')}
                  className="bg-black hover:bg-pink-600 hover:text-white text-pink-300 border border-pink-500/70 px-2 py-1 flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  title="Shock Reaction (+5 XP)"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>❤️ {art.reactions.shock}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleShare(art.titleBn)}
                  className="bg-purple-950 hover:bg-purple-800 text-gray-200 border border-purple-500 px-2.5 py-1 flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Share headline"
                >
                  <Share2 className="w-3 h-3" />
                  <span>শেয়ার</span>
                </button>

                <button
                  onClick={() => {
                    playSound('coin');
                    onOpenFeedbackModal();
                  }}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black border border-black px-2.5 py-1 flex items-center gap-1 text-[11px] cursor-pointer"
                  title="Submit comment / motamot to Rabbu's Gmail"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>মন্তব্য</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Reaction Toasts */}
      {activeReactionToast && (
        <div className="fixed bottom-20 right-6 z-[100000] bg-yellow-400 text-black border-2 border-black font-mono text-xs font-black px-4 py-2 shadow-[4px_4px_0px_#000] animate-bounce">
          {activeReactionToast}
        </div>
      )}

      {shareToast && (
        <div className="fixed bottom-20 right-6 z-[100000] bg-lime-400 text-black border-2 border-black font-mono text-xs font-black px-4 py-2 shadow-[4px_4px_0px_#000] animate-bounce">
          {shareToast}
        </div>
      )}

      {/* Bottom Callout: Feedback Direct to Rabbu's Gmail */}
      <div className="bg-black/90 border-2 border-dashed border-red-500 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center font-black text-lg border border-yellow-300 shrink-0">
            ✉️
          </div>
          <div>
            <div className="text-yellow-300 font-bold">
              নতুন কোনো ভাইরাল বাংলাদেশি নিউজ বা ঘটনা যোগ করতে চান?
            </div>
            <div className="text-gray-400 text-[11px]">
              আপনার মতামত ও স্টোরি আইডিয়া সরাসরি ইয়াসির আবেদ রাব্বুর অফিসিয়াল ক্রিয়েটর ইনবক্সে পৌঁছে যাবে!
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('coin');
            onOpenFeedbackModal();
          }}
          className="bg-red-600 hover:bg-red-500 text-yellow-200 border-2 border-black px-4 py-2 font-black uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_#000] cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>সরাসরি স্টোরি পাঠান</span>
        </button>
      </div>
    </section>
  );
};
