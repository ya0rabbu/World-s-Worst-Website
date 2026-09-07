import React, { useState } from 'react';
import { Headset, Send, Bot, User, PhoneCall, AlertOctagon, HelpCircle } from 'lucide-react';
import { playSound } from '../utils/audioSynth';
import { useHeaderScramble } from '../hooks/useHeaderScramble';

interface WorstSupportProps {
  onAddRage: () => void;
}

export const WorstSupport: React.FC<WorstSupportProps> = ({ onAddRage }) => {
  const scrambledTitle = useHeaderScramble("CUSTOMER DISSERVICE CENTER", 2100);
  const scrambledSubtitle = useHeaderScramble("Certified by Guinness as the Fastest Way to Elevate Blood Pressure", 2700);

  // Chat messages
  const [messages, setMessages] = useState<{ sender: 'karen' | 'user'; text: string; time: string }[]>([
    {
      sender: 'karen',
      text: "HELLO. I am KAREN-9000. Whatever your problem is, it is 100% your fault. How may I dismiss you today?",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [queueNumber, setQueueNumber] = useState(9842);
  const [phoneTreeResult, setPhoneTreeResult] = useState<string | null>(null);

  // Karen pre-made dismissive responses
  const karenReplies = [
    "Have you tried turning your brain off and back on again?",
    "Your ticket has been routed to our trash bin. Estimated response time: 42 weeks.",
    "I talked to my manager, and we agree that you are being unreasonable.",
    "Did you read the 4,200 page manual? Section 91, paragraph 4 says no refunds ever.",
    "I am putting you on hold while I listen to cool elevator music.",
    "Please wait while I pretend to type something to look busy...",
    "Error 404: Sympathy not found in database.",
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playSound('beep');
    onAddRage();
    const userMsg = inputText;
    setInputText('');

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Now' },
    ]);

    // Karen reply after short delay
    setTimeout(() => {
      playSound('glitch');
      const randomReply = karenReplies[Math.floor(Math.random() * karenReplies.length)];
      setMessages((prev) => [
        ...prev,
        { sender: 'karen', text: randomReply, time: 'Now' },
      ]);
      setQueueNumber((q) => q + 1); // Queue increases instead of decreasing!
    }, 600);
  };

  const handlePhoneButton = (key: number) => {
    playSound('honk');
    onAddRage();
    if (key === 1) {
      setPhoneTreeResult("Option 1 chosen: Sales. You have been transferred to hold forever (Current song: 8-bit polka).");
    } else if (key === 2) {
      setPhoneTreeResult("Option 2 chosen: Complaints. Your complaint has been printed directly into our office fireplace.");
    } else if (key === 3) {
      setPhoneTreeResult("Option 3 chosen: Human Operator. Error: All humans were replaced with angry badgers in 2018.");
    } else {
      setPhoneTreeResult(`Option ${key} chosen: Unrecognized key. Dialing your ex-girlfriend...`);
    }
  };

  return (
    <section className="bg-yellow-200 border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_#000] font-['Comic_Neue',cursive]">
      {/* Header */}
      <div className="bg-purple-900 text-yellow-300 p-3 border-2 border-black flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="font-['Press_Start_2P',monospace] text-sm md:text-base flex items-center gap-2">
            <Headset className="w-5 h-5 text-red-500 animate-spin" />
            {scrambledTitle}
          </h2>
          <p className="text-[11px] font-mono text-cyan-300 mt-1">
            {scrambledSubtitle}
          </p>
        </div>
        <div className="bg-red-600 text-white font-mono text-xs px-3 py-1.5 border border-black font-bold animate-pulse">
          YOUR QUEUE POSITION: #{queueNumber}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Chat with Karen-9000 */}
        <div className="lg:col-span-2 bg-white border-4 border-black shadow-[4px_4px_0px_#000] flex flex-col h-[480px]">
          <div className="bg-blue-800 text-white p-2.5 border-b-2 border-black flex items-center justify-between font-mono text-xs font-bold">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>AI AGENT: KAREN-9000 (VERY ANNOYED)</span>
            </div>
            <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded-xs">
              Status: Judging You
            </span>
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-pink-50/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'karen' && (
                  <div className="w-7 h-7 bg-red-600 border border-black rounded-full flex items-center justify-center text-white shrink-0 text-xs font-black">
                    K
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-2.5 border-2 border-black text-xs font-bold shadow-[2px_2px_0px_#000] ${
                    m.sender === 'user'
                      ? 'bg-yellow-300 text-black'
                      : 'bg-white text-purple-950'
                  }`}
                >
                  <p className="leading-snug">{m.text}</p>
                  <span className="block text-[9px] text-gray-500 font-mono text-right mt-1">
                    {m.time}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 bg-yellow-400 border border-black rounded-full flex items-center justify-center text-black shrink-0 text-xs font-bold">
                    U
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-2 border-t-2 border-black bg-gray-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Complain here (will be ignored)..."
              className="flex-1 bg-white border-2 border-black p-2 text-xs font-mono focus:bg-yellow-50 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              VENT
            </button>
          </form>
        </div>

        {/* Right Column: Automated Phone Tree from Hell */}
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000]">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase mb-2 border-b pb-1">
              <PhoneCall className="w-4 h-4 text-purple-900" />
              Automated Phone Tree (IVR)
            </div>
            <p className="text-[11px] text-gray-700 mb-3">
              Press any digit on the keypad below to reach our automated rejection maze:
            </p>

            <div className="grid grid-cols-3 gap-2 font-mono text-sm font-black mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePhoneButton(num)}
                  className="bg-gray-100 hover:bg-yellow-300 border-2 border-black py-2 shadow-[2px_2px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
                >
                  {num}
                </button>
              ))}
            </div>

            {phoneTreeResult && (
              <div className="bg-red-100 border border-red-500 p-2 text-[11px] text-red-900 font-mono animate-in fade-in">
                {phoneTreeResult}
              </div>
            )}
          </div>

          {/* Sarcastic FAQ */}
          <div className="bg-amber-100 border-4 border-black p-3 shadow-[4px_4px_0px_#000] text-xs space-y-2">
            <div className="font-black text-purple-900 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Frequently Unanswered Questions
            </div>
            <div className="bg-white p-2 border border-black">
              <strong>Q: Can I speak to a human?</strong>
              <p className="text-gray-600 mt-0.5">A: No. Humans have emotions and might help you.</p>
            </div>
            <div className="bg-white p-2 border border-black">
              <strong>Q: How do I get a refund?</strong>
              <p className="text-gray-600 mt-0.5">A: Send a letter in invisible ink to the North Pole.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
