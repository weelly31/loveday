"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// Confetti particle component
function ConfettiParticle({ index, windowWidth, windowHeight }: { index: number; windowWidth: number; windowHeight: number }) {
  const colors = ['#ff69b4', '#ff1493', '#c71585', '#ffc0cb', '#ff85a2', '#e8a0bf', '#d4af37', '#f5e6cc'];
  const color = colors[index % colors.length];
  const startX = Math.random() * windowWidth;
  const endX = startX + (Math.random() - 0.5) * 400;
  const size = Math.random() * 10 + 4;
  const duration = Math.random() * 3 + 3;
  const delay = Math.random() * 1.5;
  const rotate = Math.random() * 720 - 360;
  const shapes = ['rounded-full', 'rounded-sm', 'rounded-none'];
  const shape = shapes[index % shapes.length];

  return (
    <motion.div
      className={`absolute ${shape}`}
      style={{
        width: size,
        height: index % 3 === 0 ? size : size * 0.5,
        backgroundColor: color,
        left: startX,
        top: -20,
        zIndex: 50,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: windowHeight + 50,
        x: endX - startX,
        opacity: [1, 1, 0.8, 0],
        rotate: rotate,
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: 'easeIn',
      }}
    />
  );
}

// Sparkle burst component
function SparkleBurst({ x, y }: { x: number; y: number }) {
  return (
    <>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
            style={{ left: x, top: y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
          />
        );
      })}
    </>
  );
}

// Single CSS Flower
function Flower({ color, centerColor, delay, position, scale = 1 }: { color: string; centerColor: string; delay: number; position: number; scale?: number }) {
  return (
    <motion.div
      className="absolute bottom-0"
      style={{ 
        left: `${position}%`,
        transform: 'translateX(-50%)'
      }}
      initial={{ y: 100, opacity: 0, scale: 0 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, type: 'spring', stiffness: 80 }}
    >
      <div className="flex flex-col items-center">
        {/* Flower head */}
        <motion.div
          className="relative"
          style={{ 
            width: `min(${80 * scale}px, ${16 * scale}vw)`, 
            height: `min(${80 * scale}px, ${16 * scale}vw)`,
            marginBottom: `min(${-10 * scale}px, ${-2 * scale}vw)`,
            zIndex: 10
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.5, type: 'spring' }}
        >
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((rotation) => (
            <div
              key={rotation}
              className="absolute"
              style={{
                width: `min(${32 * scale}px, ${6.4 * scale}vw)`,
                height: `min(${48 * scale}px, ${9.6 * scale}vw)`,
                backgroundColor: color,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                top: '50%',
                left: '50%',
                transformOrigin: 'center bottom',
                transform: `translate(-50%, -${24 * scale}px) rotate(${rotation}deg)`,
                opacity: 0.95
              }}
            />
          ))}
        </motion.div>

        {/* Stem */}
        <motion.div
          className="relative bg-linear-to-b from-green-500 to-green-700 rounded-full"
          style={{ 
            width: `min(${4 * scale}px, ${0.8 * scale}vw)`, 
            height: `min(${100 * scale}px, ${20 * scale}vw)`,
            transformOrigin: 'top'
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
        >
          {/* Left leaf */}
          <motion.div
            className="absolute bg-green-500 rounded-full"
            style={{
              width: `min(${24 * scale}px, ${4.8 * scale}vw)`,
              height: `min(${14 * scale}px, ${2.8 * scale}vw)`,
              left: `min(${-22 * scale}px, ${-4.4 * scale}vw)`,
              top: `min(${40 * scale}px, ${8 * scale}vw)`,
              borderRadius: '50% 0 50% 50%',
              transform: 'rotate(-30deg)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.6, duration: 0.5 }}
          />
          {/* Right leaf */}
          <motion.div
            className="absolute bg-green-600 rounded-full"
            style={{
              width: `min(${24 * scale}px, ${4.8 * scale}vw)`,
              height: `min(${14 * scale}px, ${2.8 * scale}vw)`,
              right: `min(${-22 * scale}px, ${-4.4 * scale}vw)`,
              top: `min(${60 * scale}px, ${12 * scale}vw)`,
              borderRadius: '0 50% 50% 50%',
              transform: 'rotate(30deg)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.8, duration: 0.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [showFlowers, setShowFlowers] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [floatingHearts, setFloatingHearts] = useState<
    { id: number; x: string; size: number; duration: number; delay: number; opacity: number }[]
  >([]);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hearts = [...Array(10)].map((_, i) => ({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      size: 14 + Math.random() * 18,
      duration: 12 + Math.random() * 8,
      delay: i * 0.8,
      opacity: 0.15 + Math.random() * 0.2,
    }));
    setFloatingHearts(hearts);
  }, []);

  const handleBloom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setSparkles([{ id: Date.now(), x, y }]);
    setShowFlowers(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
  }, []);

  const flowers = [
    { color: '#f8b4c8', centerColor: '#f7dc6f', position: 15, delay: 0.2, scale: 0.9 },
    { color: '#d7a0e0', centerColor: '#f0e68c', position: 32, delay: 0.4, scale: 1.05 },
    { color: '#f4978e', centerColor: '#ffd700', position: 50, delay: 0.1, scale: 1.15 },
    { color: '#fbc4ab', centerColor: '#f5deb3', position: 68, delay: 0.5, scale: 1 },
    { color: '#a8d8ea', centerColor: '#fffacd', position: 85, delay: 0.3, scale: 0.95 },
  ];

  return (
    <div className="min-h-screen overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fff1f2 50%, #fef2f2 75%, #fdf2f8 100%)' }}>
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(251,113,133,0.08) 0%, transparent 70%)' }} />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(80)].map((_, i) => (
              <ConfettiParticle key={i} index={i} windowWidth={windowSize.width} windowHeight={windowSize.height} />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Sparkle bursts */}
      {sparkles.map((s) => (
        <SparkleBurst key={s.id} x={s.x} y={s.y} />
      ))}

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            className="absolute text-rose-300"
            style={{ left: h.x, fontSize: h.size, opacity: 0 }}
            animate={{
              y: [windowSize.height + 40, -60],
              opacity: [0, h.opacity, h.opacity, 0],
              rotate: [0, 15, -15, 0],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: h.duration,
              repeat: Infinity,
              delay: h.delay,
              ease: 'linear',
            }}
          >
            <Heart fill="currentColor" size={h.size} strokeWidth={0} />
          </motion.div>
        ))}
      </div>

      {/* Decorative top border shimmer */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, #f472b6, #fb923c, #f472b6, transparent)' }}
        animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 py-16 md:py-20">

        {/* Decorative sparkle icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 text-rose-300" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-4"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-serif tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 30%, #f43f5e 60%, #fb7185 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            Happy Love Day
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-rose-400/80 italic font-light tracking-widest uppercase mb-10"
        >
          Celebrating the beauty of love
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-24 h-px bg-linear-to-r from-transparent via-rose-300 to-transparent mb-12"
        />

        {/* Button or Content */}
        <AnimatePresence mode="wait">
          {!showFlowers ? (
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center gap-8 flex-1 justify-center"
            >
              {/* Glowing button */}
              <div className="relative">
                {/* Glow ring */}
                <motion.div
                  className="absolute -inset-3 rounded-full opacity-40 blur-xl"
                  style={{ background: 'linear-gradient(135deg, #f472b6, #fb7185, #fda4af)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.button
                  onClick={handleBloom}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative px-10 py-4 sm:px-14 sm:py-5 rounded-full text-white font-medium text-lg sm:text-xl tracking-wide shadow-2xl cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
                    boxShadow: '0 20px 60px -15px rgba(225,29,72,0.4), 0 8px 20px -8px rgba(225,29,72,0.3)',
                  }}
                >
                  <span className="flex items-center gap-3">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      🌸
                    </motion.span>
                    Let Love Bloom
                    <motion.span
                      animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                    >
                      🌸
                    </motion.span>
                  </span>
                </motion.button>
              </div>

              {/* Subtle hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-rose-300/60 text-sm tracking-wider"
              >
                tap to reveal something special
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-stretch mt-4"
            >
              {/* Love Letter */}
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-0"
              >
                <div
                  className="relative w-full max-w-lg rounded-2xl p-px overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #fda4af, #f9a8d4, #c4b5fd, #fda4af)',
                  }}
                >
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 sm:p-10">
                    {/* Decorative corner */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Heart fill="currentColor" className="w-16 h-16 text-rose-400" />
                    </div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-rose-400/60 text-xs font-medium tracking-[0.3em] uppercase mb-4">
                        A message for you
                      </p>
                      <div className="w-12 h-px bg-rose-200 mb-8" />
                    </motion.div>

                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-gray-600 text-lg sm:text-xl leading-relaxed font-serif"
                    >
                      Happy Love Day — may this moment remind you that you are 
                      <span className="text-rose-500 font-medium"> valued</span>, 
                      <span className="text-rose-500 font-medium"> cherished</span>, and 
                      <span className="text-rose-500 font-medium"> deeply worthy of love</span>, 
                      not just today but in every season of your life.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-8 flex items-center gap-3"
                    >
                      <div className="w-8 h-px bg-rose-200" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart fill="#f43f5e" className="w-5 h-5 text-rose-500" strokeWidth={0} />
                      </motion.div>
                      <div className="w-8 h-px bg-rose-200" />
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-6 text-rose-300 text-sm italic font-light"
                    >
                      With all the love in the world
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* Flowers Section */}
              <motion.div
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="w-full lg:w-1/2 flex flex-col items-center justify-end"
              >
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-rose-400/60 text-xs font-medium tracking-[0.3em] uppercase mb-6"
                >
                  These flowers are for you 🌸
                </motion.p>

                {/* Flowers garden */}
                <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center">
                  <div className="relative w-full max-w-[90%] sm:max-w-md h-full">
                  {/* Ground/grass */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-4 sm:h-6 rounded-full"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.2) 0%, transparent 70%)',
                    }}
                  />

                  {flowers.map((f, i) => (
                    <Flower
                      key={i}
                      color={f.color}
                      centerColor={f.centerColor}
                      position={f.position}
                      delay={f.delay}
                      scale={f.scale}
                    />
                  ))}

                  {/* Butterflies */}
                  {[0, 1].map((i) => (
                    <motion.div
                      key={`butterfly-${i}`}
                      className="absolute text-base sm:text-lg md:text-xl"
                      style={{ top: 10 + i * 30, left: i === 0 ? '20%' : '70%' }}
                      animate={{
                        x: [0, 30, -20, 40, 0],
                        y: [0, -20, 10, -30, 0],
                      }}
                      transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        delay: 1 + i * 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      🦋
                    </motion.div>
                  ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-auto pt-12 text-rose-300/40 text-xs tracking-[0.2em] uppercase"
        >
          FROM WELL | Made with love
        </motion.p>
      </div>
    </div>
  );
}