import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, HardDrive } from 'lucide-react';
import { PageType } from '../types';

interface PageTransitionLoaderProps {
  isLoading: boolean;
  page: PageType;
}

const PAGE_NAMES: Record<PageType, string> = {
  home: 'PAIN HUB (প্রধান দুর্যোগ)',
  halftone: 'HALFTONE STUDIO (ডট ম্যাট্রিক্স ও রেট্রো আর্ট)',
  viral: 'VIRAL NEWS BD (পদ্মা সেতু ও ভাইরাল সংবাদ)',
  pinterest: 'CURSED PINTEREST (সবচেয়ে ফালতু পিন)',
  shop: 'SCAM STORE (১৫০% টিপ আবশ্যক)',
  support: 'KAREN BOT SUPPORT (কিউ নং ৯,৮৪২)',
  unsubscribe: 'UNSUBSCRIBE MAZE (পালাতে পারবেন না)',
  records: 'GUINNESS HALL (১০টি চরম নিষ্ঠুর স্তম্ভ)',
};

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  isLoading,
  page,
}) => {
  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="fixed top-12 left-1/2 -translate-x-1/2 z-[99999] bg-black/95 text-yellow-300 border-2 border-lime-400 px-4 py-2 font-mono text-xs shadow-[0_0_20px_rgba(0,255,100,0.5),6px_6px_0px_#000] flex items-center gap-3 backdrop-blur-sm pointer-events-none select-none"
      >
        <HardDrive className="w-4 h-4 text-cyan-400 animate-spin" />
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-lime-400" />
            <span>হোস্টাইল মডিউল লোড হচ্ছে... / LOADING HOSTILE MODULE</span>
          </span>
          <span className="text-yellow-400 font-bold tracking-wide">
            &gt; {PAGE_NAMES[page] || page.toUpperCase()}
          </span>
        </div>
        <div className="w-16 h-2 bg-gray-900 border border-lime-400 overflow-hidden">
          <motion.div
            className="h-full bg-lime-400"
            initial={{ width: '10%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
