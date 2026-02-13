import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Sparkles, Music, Send, Star, ArrowDown, ExternalLink, Video } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Video Imports
import video1 from './assets/videos/WhatsApp Video 2026-02-11 at 14.13.42.mp4';
import video2 from './assets/videos/WhatsApp Video 2026-02-11 at 14.13.43.mp4';
import video3 from './assets/videos/WhatsApp Video 2026-02-11 at 14.13.43 (1).mp4';
import bgMusic from './assets/videos/Billie Eilish - THE GREATEST (Official Lyric Video) (mp3cut.net) (1) (1) (1).mp3';

const FloatingSparkle = ({ delay, x, y }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0],
      rotate: [0, 180]
    }}
    transition={{ 
      duration: 3, 
      delay, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute pointer-events-none text-rose-300"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Sparkles size={16} />
  </motion.div>
);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const HeartCursorTrail = () => {
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newHeart = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 10 + 10,
        rotation: Math.random() * 360
      };
      setTrail((prev) => [...prev.slice(-15), newHeart]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <AnimatePresence>
        {trail.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, y: heart.y, x: heart.x }}
            animate={{ opacity: 0, scale: 1.5, y: heart.y - 100, x: heart.x + (Math.random() * 40 - 20) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
            style={{ left: 0, top: 0 }}
          >
            <Heart size={heart.size} fill="#fb7185" color="#fb7185" className="opacity-30" style={{ rotate: heart.rotation }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Magnetic = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) * 0.3;
    const y = (clientY - centerY) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const FloatingHeart = ({ delay, x, size }) => (
  <motion.div
    initial={{ y: '110vh', opacity: 0 }}
    animate={{ 
      y: '-10vh', 
      opacity: [0, 0.6, 0.6, 0],
      x: [x + 'vw', (x + 5) + 'vw', (x - 5) + 'vw', x + 'vw']
    }}
    transition={{ 
      duration: 15, 
      delay, 
      repeat: Infinity, 
      ease: "linear" 
    }}
    className="heart-particle"
    style={{ left: `${x}vw` }}
  >
    <Heart 
      size={size} 
      fill="#fb7185" 
      color="#fb7185" 
      strokeWidth={1}
      className="opacity-40" 
    />
  </motion.div>
);

const App = () => {
  const [started, setStarted] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [blushing, setBlushing] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Changed to false initially
  const audioRef = React.useRef(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Start music when "Open with Love" is clicking
  const handleStart = () => {
    setStarted(true);
    setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(e => console.log("Audio play failed:", e));
        }
    }, 500);
  }


  const triggerBlush = () => {
    setBlushing(true);
    setTimeout(() => setBlushing(false), 2000);
  };

  const celebrate = () => {
    setShowHearts(true);
    alert("This just made my day! ❤️");
  };

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 15,
      x: Math.random() * 100,
      size: Math.random() * 20 + 10
    }));
    setHearts(newHearts);
  }, []);

  if (!started) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
        <div className="cinematic-bg" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10"
        >
          <motion.h2 
            className="script-font text-5xl md:text-7xl mb-8 text-pink-300"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            A Message for Love
          </motion.h2>
          <Magnetic>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251, 113, 133, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              style={{padding: '10px', marginTop: '20px'}}
              className="px-12 py-4 rounded-full bg-rose-600 text-white font-semibold tracking-widest uppercase text-sm border border-rose-400/50 backdrop-blur-sm shadow-xl"
            >
              Open with Love
            </motion.button>
          </Magnetic>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="snap-container">
      <audio ref={audioRef} src={bgMusic} loop />
      <HeartCursorTrail />
      <AnimatePresence>
        {blushing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-rose-400 z-[100] pointer-events-none"
          />
        )}
      </AnimatePresence>
      <motion.div 
        animate={{ scale: [1, 1.02, 1] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="cinematic-bg" 
      />
      
      {/* Background Hearts */}
      {hearts.map(heart => (
        <FloatingHeart key={heart.id} {...heart} />
      ))}
      <AnimatePresence>
        {showHearts && Array.from({ length: 50 }).map((_, i) => (
          <FloatingHeart key={`celebrate-${i}`} delay={Math.random() * 2} x={Math.random() * 100} size={Math.random() * 30 + 20} />
        ))}
      </AnimatePresence>

      {/* Music Visualizer / Toggle */}
      <div 
        onClick={toggleMusic}
        className="fixed top-8 right-8 z-50 flex items-center gap-2 bg-black/20 backdrop-blur-md p-3 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
      >
        <Music size={18} className={isPlaying ? "text-rose-400" : "text-gray-400"} />
        <div className="flex gap-1 h-4 items-end">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [4, 16, 8, 12, 4] } : { height: 4 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className={cn("w-1 rounded-full", isPlaying ? "bg-rose-500" : "bg-gray-500")}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="snap-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 inline-block"
          >
            <Heart size={80} fill="#e11d48" color="#e11d48" className="animate-heartbeat" />
          </motion.div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl mb-6 font-bold tracking-tighter leading-tight px-4">
            Happy <span className="gradient-text">Valentine's</span>
          </h1>
          <p style={{marginTop: '10px'}} className="script-font text-3xl sm:text-4xl md:text-6xl text-rose-300 mt-8 md:mt-12 opacity-0 animate-[fadeIn_2s_ease-out_forwards_1s] tracking-wide px-4">
            Amazing Love
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-10 animate-bounce"
        >
          <ArrowDown className="text-rose-400" />
        </motion.div>
      </section>

      {/* Moments & Videos Section */}
      <section className="snap-section !p-6 !py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-6xl w-full text-center mb-24 px-4 child-h2-mb" 
          style={{marginBottom: '16px'}}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl mb-8 script-font text-rose-200">Just Some Moments</h2>
          <p className="text-rose-100/40 text-[10px] sm:text-xs md:text-base tracking-[0.2em] uppercase">Just a glimpse into the joy you bring</p>
        </motion.div>
        <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4 sm:px-8">
          {[
            { src: video1, title: 'That Smile', text: 'One of the best things I have seen lately.' },
            { src: video2, title: 'Your Vibe', text: 'You have this energy that honestly just makes everything better.' },
            { src: video3, title: 'Just Love', text: 'No words needed, just really glad I know you.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="glass-card !p-0 overflow-hidden group relative border-none shadow-2xl rounded-[32px]"
              style={{padding: '15px', borderRadius: '20px'}}
            >
              <div className="relative aspect-[4/5] sm:aspect-[9/16] bg-black">
                <video 
                  src={item.src} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent" style={{padding: '10px'}}>
                  <h3 className="text-xl sm:text-2xl font-semibold text-rose-100 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-rose-100/60 leading-relaxed font-light">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW CONTENT: Why You're Special Section */}
      <section className="snap-section py-20 sm:py-32 bg-rose-500/5">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 px-6 sm:px-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6 sm:space-y-8 text-center md:text-left"
          >
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-bold leading-tight">
              Why I think <br className="hidden md:block" />
              <span className="gradient-text script-font">You're Special</span>
            </h2>
            <p className="text-rose-100/60 text-base sm:text-lg leading-relaxed font-light">
              It’s not just one thing. It’s the way you carry yourself, the small gestures, and the way you make effortless conversation. I find myself looking forward to our next chat more than I probably should.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {[
              { icon: <Sparkles className="text-rose-400" size={20} />, title: 'Genuine Character', desc: 'You stay true to yourself, and that’s rare.' },
              { icon: <Heart className="text-rose-400" size={20} />, title: 'Effortless Kindness', desc: 'The way you care about the small details.' },
              { icon: <Star className="text-rose-400" size={20} />, title: 'Unique Perspective', desc: 'You see the world in a way that fascinates me.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 sm:p-8 flex gap-4 sm:gap-6 items-start"
              >
                <div className="p-2 sm:p-3 bg-rose-500/10 rounded-xl sm:rounded-2xl shrink-0">{feature.icon}</div>
                <div>
                  <h4 className="text-lg sm:text-xl text-rose-100 mb-1 sm:mb-2 font-semibold tracking-tight">{feature.title}</h4>
                  <p className="text-xs sm:text-sm text-rose-100/50 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Letter Section */}
      <section className="snap-section py-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-center mb-24 px-8"
        >
          <h2 className="text-3xl md:text-5xl mb-6 script-font text-rose-200">A Personal Note</h2>
          <p className="text-rose-100/30 text-xs tracking-[0.2em] uppercase" style={{marginBottom: '20px'}}>For your eyes only</p>
        </motion.div>
        <LoveLetter />
      </section>

      {/* Gallery/Blush Section */}
      <section className="snap-section py-32 bg-black/40">
        <motion.div 
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0, y: 20 }}
          className="text-center px-6 max-w-4xl w-full"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl mb-16 font-playfair tracking-tight">What makes you <span className="italic text-rose-500 underline underline-offset-8 decoration-rose-500/30 font-light">Stand Out</span></h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 px-2" style={{marginTop: '22px'}}>
            {['Intelligence', 'How you listen', 'Your energy', 'Your ambition', 'Kindness'].map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(244, 63, 94, 0.4)', borderColor: 'rgba(244, 63, 94, 0.6)', y: -5 }}
                onClick={triggerBlush}
                style={{padding: '10px', paddingLeft: '18px', paddingRight: '18px'}}
                className="px-5 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-rose-500/20 bg-white/5 text-rose-100 text-xs sm:text-sm md:text-base font-medium cursor-pointer transition-all shadow-xl whitespace-nowrap"
              >
                {item}
              </motion.span>
            ))}
          </div>
          <p className="mt-16 text-rose-400/40 text-[10px] sm:text-xs tracking-widest uppercase px-4" style={{marginTop: '12px'}}>Tap anything to see my heart skip a beat</p>
        </motion.div>
      </section>

      {/* Final Dedication Section */}
      <section className="snap-section last-section py-32 relative overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingSparkle key={i} delay={Math.random() * 5} x={Math.random() * 100} y={Math.random() * 100} />
        ))}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div 
            className="mb-12 inline-block"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
             <Heart size={64} className="mx-auto text-rose-500" fill="currentColor" />
          </motion.div>
          
          <h2 className="text-5xl md:text-8xl font-bold mb-10 tracking-tighter">
            To <span className="script-font text-rose-400">Us</span>
          </h2>
          
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent mx-auto mb-12 opacity-50" />

          <p className="text-lg md:text-2xl text-rose-100/80 font-light leading-loose max-w-3xl mx-auto mb-16 italic">
            "I'm so incredibly glad our paths crossed. Thank you for being such a bright light in my world. Here's to more laughter, more stories, and more amazing moments together."
          </p>

          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="inline-block p-[2px] rounded-full bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"
          >
             <div className="bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/5">
                <p className="text-sm md:text-base text-rose-300 font-medium tracking-[0.2em] uppercase">
                  Happy Valentine's Day, Love
                </p>
             </div>
          </motion.div>
        </motion.div>

        <footer className="absolute bottom-8 text-rose-200/40 text-sm flex items-center gap-2">
          Made by Samba<Heart size={14} fill="currentColor" /> for You
        </footer>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const LoveLetter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <motion.div
        animate={isOpen ? { rotateX: 180, y: 100, scale: 0.95 } : { rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-[280px] sm:w-[350px] h-[180px] bg-rose-100 rounded-lg shadow-2xl relative cursor-pointer z-20 flex items-center justify-center p-4"
        onClick={() => setIsOpen(!isOpen)}
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center border-2 border-rose-200 rounded-lg m-2 mt-100" style={{paddingTop: '100px'}}>
          <Heart size={40} fill="#f43f5e" color="#f43f5e" className={isOpen ? 'opacity-0' : 'opacity-100'} />
        </div>
        <p className={cn("script-font text-rose-800 text-lg sm:text-xl text-center transition-opacity duration-500", isOpen ? 'opacity-0' : 'opacity-100')}>
          To Love... <br /><span className="text-xs uppercase tracking-widest font-sans font-bold opacity-40">(Click to Open)</span>
        </p>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 0, opacity: 0, scale: 0.8 }}
            animate={{ y: -160, opacity: 1, scale: 1 }}
            exit={{ y: 0, opacity: 0, scale: 0.8 }}
            style={{maxWidth: '500px', padding: '14px'}}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[420px] bg-white p-8 sm:p-14 rounded-lg shadow-2xl text-gray-800 z-10 border-t-8 border-rose-500 overflow-y-auto max-h-[70vh]"
          >
            <h4 className="script-font text-3xl sm:text-5xl text-rose-600 mb-6 sm:mb-8 text-center border-b border-rose-100 pb-6 sm:pb-8 tracking-wider">Dearest Love</h4>
            <div className="space-y-6 sm:space-y-8 text-sm sm:text-lg leading-relaxed sm:leading-loose text-gray-700 font-light italic">
              <p>I wanted to take a moment to tell you how much I enjoy every second we spend together.</p>
              <p>There's something so special about you—the way you speak, your ambition, and that spark you have. I've realized that I really, really like who you are.</p>
              <p>I’m looking forward to every conversation we have next. Happy Valentine's Day, Love.</p>
            </div>
            <p className="mt-8 sm:mt-12 text-right font-semibold text-rose-600 script-font text-2xl sm:text-4xl">— Specifically Yours</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NoButton = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [moveCount, setMoveCount] = useState(0);

  const moveButton = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setPosition({ x, y });
    setMoveCount(prev => prev + 1);
  };

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      onMouseEnter={moveCount < 10 ? moveButton : undefined}
      onClick={moveButton}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{paddingLeft: '28px', paddingRight: '28px', paddingTop: '8px', paddingBottom: '8px'}}
      className="px-10 py-4 rounded-full border border-rose-400/30 text-rose-300 hover:bg-rose-500/10 cursor-pointer text-sm font-semibold tracking-wider transition-colors duration-300"
    >
      {moveCount > 5 ? "Wait, what?" : "No"}
    </motion.div>
  );
};

export default App;
