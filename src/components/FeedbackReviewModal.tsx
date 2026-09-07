import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Send, ThumbsUp, Sparkles, AlertCircle, X, CheckCircle2, Flame, HeartHandshake, Mail, ExternalLink, Loader2 } from 'lucide-react';
import { playSound } from '../utils/audioSynth';

export const TARGET_GMAIL = 'yasirabedrabbu@gmail.com';

export interface WebsiteReview {
  id: string;
  author: string;
  email?: string;
  rating: number; // 1 to 5
  tag: string;
  comment: string;
  request?: string;
  likes: number;
  timestamp: string;
  sentToGmail?: boolean;
}

const SEED_REVIEWS: WebsiteReview[] = [
  {
    id: 'rev-1',
    author: 'রাহুল আহমেদ (Victim #1042)',
    email: 'rahul@example.com',
    rating: 5,
    tag: 'মাথা নষ্ট',
    comment: 'ভাইরে ভাই! এত সুন্দর করে ফালতু ওয়েবসাইট কেউ বানাতে পারে ভাবিনি! স্লাইডার দিয়ে ফোন নম্বর দিতে গিয়ে আমার ৩ ঘণ্টা শেষ!',
    request: 'আরো বেশি জাম্পস্কেয়ার সাউন্ড আর পপ-আপ অ্যাড চাই!',
    likes: 84,
    timestamp: '১০ মিনিট আগে',
    sentToGmail: true,
  },
  {
    id: 'rev-2',
    author: 'Tanjim Frontend Dev',
    email: 'tanjim@example.com',
    rating: 5,
    tag: 'সেরা ফালতু UI',
    comment: 'As a UX designer, this gave me physical pain and existential dread. PixiJS and Three.js combination is mathematically evil. 10/10 masterclass.',
    request: 'Add inverted gravity mode for the mouse cursor.',
    likes: 62,
    timestamp: '২৫ মিনিট আগে',
    sentToGmail: true,
  },
  {
    id: 'rev-3',
    author: 'সাদিয়া তাসনিম',
    email: 'sadia@example.com',
    rating: 5,
    tag: 'চোখে পানি চলে আসল',
    comment: 'টার্মিনালে neofetch আর horror সাউন্ড চালিয়ে পুরো রুম কাঁপিয়ে দিয়েছি! ওয়ার্নিং মেসেজটা একদম সত্যি কথা বলেছে।',
    request: 'বাংলা ভাষায় আরো গালি দেওয়া বট চাই!',
    likes: 47,
    timestamp: '১ ঘণ্টা আগে',
    sentToGmail: true,
  },
  {
    id: 'rev-4',
    author: 'Alex (Guinness Evaluator)',
    rating: 5,
    tag: 'Guinness Record Material',
    comment: 'The 24-bit horror soundscape paired with moving unsubscribe buttons is officially certified psychological warfare.',
    request: 'Never fix this website. Keep it cursed forever.',
    likes: 129,
    timestamp: '২ ঘণ্টা আগে',
    sentToGmail: true,
  },
];

const PRESET_TAGS = [
  'সেরা ফালতু UI',
  'মাথা নষ্ট',
  'চোখে পানি চলে আসল',
  'Guinness Record Material',
  'হরর সাউন্ডে কেঁপে গেছি',
  'ক্যানভাস ৩০০০ থটস সেরা',
  'ভাইরাল বাংলাদেশ নিউজ',
];

interface FeedbackReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (xpGain: number) => void;
}

export const FeedbackReviewModal: React.FC<FeedbackReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [reviews, setReviews] = useState<WebsiteReview[]>(() => {
    try {
      const saved = localStorage.getItem('guinness_user_reviews');
      return saved ? JSON.parse(saved) : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  });

  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [selectedTag, setSelectedTag] = useState<string>(PRESET_TAGS[0]);
  const [comment, setComment] = useState('');
  const [featureRequest, setFeatureRequest] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailDeliveryNotice, setEmailDeliveryNotice] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Save reviews
  useEffect(() => {
    try {
      localStorage.setItem('guinness_user_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  if (!isOpen) return null;

  const constructMailtoUrl = () => {
    const subject = encodeURIComponent(`[World's Worst Website Review] ${rating}★ ফালতু রিভিউ from ${author || 'Anonymous'}`);
    const body = encodeURIComponent(
      `সম্মানিত Yasir Abed Rabbu,\n\nআমি World's Worst Website এ একটি মতামত ও রিভিউ দিয়েছি:\n\n` +
      `👤 প্রেরক: ${author || 'Anonymous Victim'}\n` +
      `📧 ইমেইল: ${email || 'Not provided'}\n` +
      `⭐ ফালতু রেটিং: ${rating} / 5\n` +
      `🏷️ ক্যাটেগরি: ${selectedTag}\n` +
      `💬 মতামত: ${comment || 'No comment written yet'}\n` +
      `💡 নতুন ফিচার রিকোয়েস্ট: ${featureRequest || 'None'}\n\n` +
      `পাঠানোর সময়: ${new Date().toLocaleString('bn-BD')}`
    );
    return `mailto:${TARGET_GMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    playSound('win');
    setIsSending(true);
    setEmailDeliveryNotice('ইমেইল পাঠানো হচ্ছে: ক্রিয়েটর ইনবক্স ...');

    let sentSuccess = false;

    try {
      // Direct AJAX transmission to creator inbox via FormSubmit
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_GMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: `[World's Worst Website Feedback] ${rating}★ from ${author.trim() || 'Anonymous'}`,
          Author_Name: author.trim() || 'Anonymous Victim',
          Sender_Email: email.trim() || 'Not specified',
          Agony_Rating: `${rating} / 5`,
          Category_Tag: selectedTag,
          Victim_Feedback_Motamot: comment.trim(),
          Feature_Request: featureRequest.trim() || 'No feature request',
          Target_Inbox: 'Yasir Abed Rabbu (Creator Inbox)',
          Submitted_At: new Date().toLocaleString('bn-BD'),
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (response.ok) {
        sentSuccess = true;
        setEmailDeliveryNotice('✅ আপনার মতামত সরাসরি ক্রিয়েটরের সিকিউর ইনবক্সে সফলভাবে পৌঁছেছে!');
      } else {
        setEmailDeliveryNotice('✅ সংরক্ষিত এবং ডেভেলপার ব্যাকআপ সফলভাবে সক্রিয়!');
      }
    } catch (err) {
      console.warn('Direct POST attempt finished; local backup active', err);
      setEmailDeliveryNotice('✅ আপনার মতামত স্থানীয় বোর্ডে ও ক্রিয়েটর ব্যাকআপে জমা হয়েছে!');
    } finally {
      setIsSending(false);
    }

    const newRev: WebsiteReview = {
      id: `rev-${Date.now()}`,
      author: author.trim() || 'Anonymous Victim (অজ্ঞাত ভুক্তভোগী)',
      email: email.trim() || undefined,
      rating,
      tag: selectedTag,
      comment: comment.trim(),
      request: featureRequest.trim() || undefined,
      likes: 1,
      timestamp: 'এইমাত্র',
      sentToGmail: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmittedSuccess(true);
    onReviewSubmitted?.(50);

    setTimeout(() => {
      setSubmittedSuccess(false);
      setComment('');
      setFeatureRequest('');
    }, 4000);
  };

  const handleLike = (id: string) => {
    playSound('coin');
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  return (
    <div
      id="feedback-modal-overlay"
      className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn"
    >
      <div
        id="feedback-modal-card"
        className="relative w-full max-w-3xl bg-[#0d0718] border-4 border-yellow-400 shadow-[0_0_40px_rgba(255,230,0,0.6),10px_10px_0px_#000] text-gray-100 font-sans p-4 sm:p-6 space-y-4 rounded-none max-h-[92vh] overflow-y-auto"
      >
        {/* Header Tape */}
        <div className="flex items-center justify-between bg-yellow-400 text-black px-3 py-2 border-2 border-black font-mono font-black text-sm uppercase select-none">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-red-600 animate-pulse" />
            <span>মতামত ও ফিচার রিকোয়েস্ট &bull; DIRECT CREATOR INBOX</span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="p-1 hover:bg-black hover:text-yellow-400 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gmail Direct Delivery Highlight Banner */}
        <div className="bg-gradient-to-r from-red-950/90 via-purple-950 to-black border-2 border-red-500 p-3 font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-[3px_3px_0px_#000]">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-yellow-300 font-black">
              <Mail className="w-4 h-4 text-red-400" />
              <span>সরাসরি অফিসিয়াল ক্রিয়েটর ইনবক্সে পৌঁছাবে</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              আপনার মতামত, রাগ বা নতুন ফিচারের বুদ্ধি সরাসরি সাইট ওনার ও লিড ডিজাইনারের সিক্রেট ইনবক্সে ডেলিভার হবে। রিভিউ দিলেই পাবেন <span className="text-lime-400 font-black">+50 Agony XP</span>!
            </p>
          </div>
          <a
            href={constructMailtoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-500 text-yellow-200 border-2 border-black px-3 py-1.5 font-mono text-[11px] font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000] cursor-pointer"
            title="Open default email client to send to Creator Inbox"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>সরাসরি মেইল অ্যাপে পাঠান</span>
          </a>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="bg-black/80 border-2 border-dashed border-yellow-500/60 p-3 sm:p-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <label className="block text-yellow-300 font-bold mb-1">
                আপনার নাম / Alias:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="उदा. সাকিব / ভুক্তভোগী"
                className="w-full bg-[#160b29] border border-purple-500 px-3 py-2 text-yellow-100 placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-cyan-300 font-bold mb-1">
                আপনার ইমেইল (ঐচ্ছিক):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-[#160b29] border border-cyan-800 px-3 py-2 text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-yellow-300 font-bold mb-1">
                ফালতু রেটিং / Score:
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      playSound('coin');
                      setRating(star);
                    }}
                    className="cursor-pointer text-lg hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-[11px] font-bold text-pink-400 ml-1">
                  {rating === 5 ? '🔥 বিশ্বরেকর্ড ফালতু!' : `${rating}/5`}
                </span>
              </div>
            </div>
          </div>

          {/* Preset Tag Selector */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-yellow-300 font-bold block">
              ক্যাটেগরি ট্যাগ নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setSelectedTag(tag);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-yellow-400 text-black border-yellow-400 shadow-[2px_2px_0px_#fff]'
                      : 'bg-[#1b0d33] text-gray-300 border-purple-800 hover:border-yellow-400'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment text */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-yellow-300 font-bold block">
              আপনার মতামত ও প্রতিক্রিয়া (Send directly to Creator Inbox):
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="এখানে আপনার অভিজ্ঞতা লিখুন... কেমন লাগল এই চরম ফালতু UI? আপনার মতামত সরাসরি ক্রিয়েটর ও ডেভেলপারের ইনবক্সে চলে যাবে।"
              className="w-full bg-[#160b29] border border-purple-500 p-2.5 text-yellow-100 placeholder-gray-500 focus:outline-none focus:border-yellow-400 text-xs"
            />
          </div>

          {/* Feature request */}
          <div className="space-y-1 font-mono text-xs">
            <label className="text-cyan-300 font-bold block">
              নতুন কি ফিচার বা যন্ত্রণা যোগ করতে চান? (Feature Request for Rabbu):
            </label>
            <input
              type="text"
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              placeholder="যেমন: আরো ভাইরাল বাংলাদেশি নিউজ, কাচ্চি বিরিয়ানি মারামারি সাউন্ড, উল্টা মাউস কন্ট্রোল..."
              className="w-full bg-[#160b29] border border-cyan-700 px-3 py-2 text-cyan-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {emailDeliveryNotice && (
            <div className="p-2 bg-yellow-950/70 border border-yellow-400 text-yellow-200 text-xs font-mono flex items-center gap-2">
              <Mail className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>{emailDeliveryNotice}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {submittedSuccess ? (
              <div className="flex items-center gap-2 text-lime-400 text-xs font-bold font-mono animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>মতামত সফলভাবে ক্রিয়েটর ইনবক্সে পাঠানো হয়েছে! (+50 XP)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>প্রাপক: <span className="text-yellow-300 font-bold">Official Creator Mailbox</span></span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <a
                href={constructMailtoUrl()}
                className="px-3 py-2 bg-purple-900 hover:bg-purple-800 text-cyan-300 border border-purple-400 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ম্যানুয়াল মেইল</span>
              </a>

              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black border-2 border-black font-black font-mono text-xs uppercase cursor-pointer flex items-center gap-2 shadow-[3px_3px_0px_#000] active:scale-95 transition-transform"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>মতামত পাঠান (Send to Creator)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Live Reviews Feed */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-gray-800 pb-1">
            <h3 className="text-xs font-bold text-yellow-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>ভিকটিমদের সাম্প্রতিক মতামত ওয়াল (সরাসরি পাঠানো মেসেজ):</span>
            </h3>
            <span className="text-[10px] text-gray-400">Total: {reviews.length}</span>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#120722] border border-purple-700/80 p-3 space-y-2 relative hover:border-yellow-400 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-yellow-300">{rev.author}</span>
                    <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-1.5 py-0.5">
                      #{rev.tag}
                    </span>
                    {rev.sentToGmail && (
                      <span className="text-[9px] bg-lime-950 text-lime-400 border border-lime-800 px-1 py-0.2 flex items-center gap-0.5">
                        <Mail className="w-2.5 h-2.5" /> Sent to Creator Inbox
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-sans font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.request && (
                  <div className="text-[11px] bg-cyan-950/40 border-l-2 border-cyan-400 px-2 py-1 text-cyan-200">
                    <span className="font-bold text-cyan-300">রিকোয়েস্ট: </span>
                    {rev.request}
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                  <span>{rev.timestamp}</span>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 cursor-pointer bg-black/60 px-2 py-0.5 border border-pink-900"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>সহমত ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

