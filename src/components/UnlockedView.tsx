"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";

const initialPhotos = [
  { id: 1, src: "/photos/1.jpg", caption: "Love youu 💕" },
  { id: 2, src: "/photos/3.jpg", caption: "Rawrrr 🐾" },
  { id: 3, src: "/photos/2.jpg", caption: "Sayangg!! 💗" },
];

const positions = [
  { x: 40, y: 10, rotation: 7, zIndex: 10 },
  { x: -50, y: 15, rotation: -8, zIndex: 20 },
  { x: -10, y: 30, rotation: -1, zIndex: 30 },
];

interface PolaroidCardProps {
  photo: { id: number; src: string; caption: string };
  index: number;
  position: { x: number; y: number; rotation: number; zIndex: number };
  isTop: boolean;
  onSwipeToBack: () => void;
  onClick: () => void;
  onZoom: () => void;
}

function PolaroidCard({
  photo,
  index,
  position,
  isTop,
  onSwipeToBack,
  onClick,
  onZoom,
}: PolaroidCardProps) {
  const dragX = useMotionValue(position.x);
  const dragY = useMotionValue(position.y);
  const rotateVal = useMotionValue(position.rotation);

  useEffect(() => {
    animate(dragX, position.x, {
      type: "spring",
      stiffness: 200,
      damping: 25,
    });
    animate(dragY, position.y, {
      type: "spring",
      stiffness: 200,
      damping: 25,
    });
    animate(rotateVal, position.rotation, {
      type: "spring",
      stiffness: 200,
      damping: 25,
    });
  }, [position.x, position.y, position.rotation, dragX, dragY, rotateVal]);

  const dragRotate = useTransform(dragX, [-200, 200], [-15, 15]);
  const rotateX = useTransform(dragY, [-200, 200], [10, -10]);
  const rotateY = useTransform(dragX, [-200, 200], [-10, 10]);

  const handleDragEnd = (_event: unknown, info: { offset: { x: number; y: number } }) => {
    if (!isTop) return;
    const threshold = 100;
    const isSwiped =
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.offset.y) > threshold;

    if (isSwiped) {
      onSwipeToBack();
    } else {
      animate(dragX, position.x, {
        type: "spring",
        stiffness: 200,
        damping: 25,
      });
      animate(dragY, position.y, {
        type: "spring",
        stiffness: 200,
        damping: 25,
      });
      animate(rotateVal, position.rotation, {
        type: "spring",
        stiffness: 200,
        damping: 25,
      });
    }
  };

  return (
    <motion.div
      style={{
        x: dragX,
        y: dragY,
        rotate: isTop ? dragRotate : rotateVal,
        rotateX: isTop ? rotateX : 0,
        rotateY: isTop ? rotateY : 0,
        zIndex: position.zIndex,
        perspective: 1000,
      }}
      className={`absolute shadow-2xl transition-[filter] select-none ${
        isTop
          ? "cursor-grab active:cursor-grabbing hover:brightness-105"
          : "cursor-pointer hover:scale-102 transition-transform"
      }`}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (!isTop) {
          onClick();
        }
      }}
      initial={{ opacity: 0, scale: 0.5, y: 200 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 25,
        opacity: { delay: 0.3 + index * 0.15, duration: 1.2 },
        scale: { delay: 0.3 + index * 0.15, duration: 1.2 },
      }}
    >
      <motion.div
        animate={isTop ? {} : { y: [0, -6, 0] }}
        transition={{
          duration: 4 + index,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white p-3 pb-14 w-[200px] sm:w-[230px] md:w-[260px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] rounded-sm relative group border border-gray-100/80">
          {/* Tape */}
          <div className="absolute -top-2.5 left-[calc(50%-20px)] w-10 h-5 sm:w-12 sm:h-6 sm:-top-3 sm:left-[calc(50%-24px)] bg-pink-200/30 backdrop-blur-[1px] rotate-[-2deg] border-l border-r border-dashed border-pink-300/40 shadow-sm pointer-events-none z-10" />

          {/* Zoom trigger icon on top right corner */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="absolute top-2 right-2 z-20 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Perbesar Foto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </button>

          {/* Photo */}
          <div
            className="w-full aspect-square bg-gray-50 relative overflow-hidden rounded-[2px] border border-gray-100 cursor-pointer"
            onClick={(e) => {
              if (isTop) {
                e.stopPropagation();
                onZoom();
              }
            }}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(max-width: 768px) 230px, 260px"
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Caption - fixed positioning */}
          <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center">
            <p className="font-dancing text-xl sm:text-2xl text-slate-600 select-none text-center leading-none">
              {photo.caption}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RomanticParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      size: number;
      type: "heart-fill" | "heart-outline" | "petal" | "sparkle";
      direction: "up" | "down";
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 20;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: isMobile ? Math.random() * 10 + 6 : Math.random() * 18 + 8,
      type: ["heart-fill", "heart-outline", "petal", "sparkle"][Math.floor(Math.random() * 4)] as
        | "heart-fill"
        | "heart-outline"
        | "petal"
        | "sparkle",
      direction: Math.random() > 0.45 ? "up" : "down" as "up" | "down",
      duration: Math.random() * 8 + 12,
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            ...(p.direction === "up" ? { bottom: "-10%" } : { top: "-10%" }),
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: p.direction === "up" ? ["0vh", "-120vh"] : ["0vh", "120vh"],
            x: [0, Math.sin(p.id) * 50, -Math.sin(p.id) * 25, 0],
            rotate: [0, p.id % 2 === 0 ? 360 : -360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.type === "heart-fill" && (
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-pink-400/40 fill-current"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === "heart-outline" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(244,114,182,0.35)"
              strokeWidth="1.5"
              className="w-full h-full"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === "petal" && (
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-pink-300/35 fill-current"
            >
              <path d="M12,2 C17.5,6 19,13 15,17 C11,21 5,19 3,13 C1,7 6.5,2 12,2 Z" />
            </svg>
          )}
          {p.type === "sparkle" && (
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full text-amber-200/45 fill-current"
            >
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

interface UnlockedViewProps {
  onClose?: () => void;
  isPlaying?: boolean;
  isMuted?: boolean;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
}

export default function UnlockedView({
  onClose,
  isPlaying = false,
  isMuted = false,
  onTogglePlay,
  onToggleMute,
}: UnlockedViewProps) {
  const [cards, setCards] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: number;
    src: string;
    caption: string;
  } | null>(null);

  const handleCardClick = (id: number) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === prev.length - 1) return prev;
      const newCards = [...prev];
      const [clickedCard] = newCards.splice(index, 1);
      newCards.push(clickedCard);
      return newCards;
    });
  };

  const sendToBack = (id: number) => {
    setCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const newCards = [...prev];
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  // 3D Tilt Effect for Card
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotateX = useTransform(cardY, [-300, 300], [5, -5]);
  const rotateY = useTransform(cardX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 1.0, delayChildren: 0.8 },
    },
  };

  const smoothFadeUp = {
    hidden: { opacity: 0, y: 25, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Particles */}
      <RomanticParticles />

      {/* Floating Music Control Bar */}
      <motion.div
        className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Equalizer Bars */}
        <div className="flex items-end gap-0.5 h-4 w-5">
          {[0.6, 1, 0.4, 0.8].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-[#f472b6] rounded-full"
              animate={isPlaying ? { height: ["20%", "100%", "30%", "80%"] } : { height: "20%" }}
              transition={{ duration: 0.6 + i * 0.15, repeat: Infinity, repeatType: "reverse" }}
            />
          ))}
        </div>
        <span className="text-xs font-mono font-medium text-slate-700 hidden sm:inline">
          {isPlaying ? "BGM Playing" : "BGM Paused"}
        </span>

        {/* Play/Pause Button */}
        {onTogglePlay && (
          <button
            onClick={onTogglePlay}
            className="p-1.5 hover:bg-pink-100/80 rounded-full transition-colors text-slate-700"
            title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Mute Button */}
        {onToggleMute && (
          <button
            onClick={onToggleMute}
            className="p-1.5 hover:bg-pink-100/80 rounded-full transition-colors text-slate-700"
            title={isMuted ? "Bunyikan Musik" : "Bisu Musik"}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        )}
      </motion.div>

      {/* Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="bg-white p-4 sm:p-6 pb-12 rounded-md max-w-[90vw] max-h-[85vh] relative shadow-2xl flex flex-col items-center"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-3 -right-3 bg-white text-slate-700 rounded-full w-9 h-9 flex items-center justify-center shadow-lg font-bold hover:bg-pink-100 transition-colors z-20 border border-slate-200"
              >
                ✕
              </button>
              <div className="relative w-[280px] sm:w-[420px] md:w-[480px] aspect-square rounded-sm overflow-hidden border border-slate-100">
                <Image
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <p className="font-dancing text-2xl sm:text-3xl text-slate-700 mt-5 text-center">
                {selectedPhoto.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main centered container - stacked vertically on mobile, side by side on lg */}
      <div className="max-w-[800px] w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 relative z-10">
        {/* Left Side: Photos */}
        <motion.div
          className="relative w-[300px] sm:w-[350px] md:w-[380px] h-[350px] sm:h-[400px] md:h-[420px] flex items-center justify-center flex-shrink-0"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {cards.map((photo, i) => {
            const pos = positions[i];
            const isTop = i === cards.length - 1;

            return (
              <PolaroidCard
                key={photo.id}
                photo={photo}
                index={i}
                position={pos}
                isTop={isTop}
                onSwipeToBack={() => sendToBack(photo.id)}
                onClick={() => handleCardClick(photo.id)}
                onZoom={() => setSelectedPhoto(photo)}
              />
            );
          })}
        </motion.div>

        {/* Right Side: Love Letter Card */}
        <motion.div
          className="w-[calc(100%-24px)] max-w-[340px] sm:w-full sm:max-w-[380px] perspective-1000 flex-shrink-0"
          initial={{ opacity: 0, x: 60, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        >
          <motion.div
            className="relative rounded-2xl p-5 sm:p-6"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.85) 50%, rgba(249,245,255,0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
            animate={{
              boxShadow: [
                "0 20px 60px rgba(147, 197, 253, 0.2), 0 8px 24px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.8)",
                "0 20px 60px rgba(244, 114, 182, 0.25), 0 8px 24px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.8)",
                "0 20px 60px rgba(147, 197, 253, 0.2), 0 8px 24px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.8)",
              ],
            }}
            transition={{
              boxShadow: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Decorative gradient corners */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#f472b6]/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-[#93c5fd]/15 to-transparent rounded-tr-full pointer-events-none" />

            {/* Stamp */}
            <motion.div
              className="absolute -top-5 -right-2 sm:-right-4 px-3 py-1 rotate-12 bg-white/95 backdrop-blur-sm z-30 rounded-md shadow-lg border border-pink-100/80"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 12 }}
              transition={{ delay: 2.0, duration: 1.5, type: "spring" }}
            >
              <span className="font-dancing font-bold text-[#f472b6] text-base sm:text-lg whitespace-nowrap">
                Only for You ♥
              </span>
            </motion.div>

            {/* Header */}
            <motion.h2
              className="font-rajdhani text-xl sm:text-2xl font-bold text-slate-800 mb-5 pb-3 border-b border-slate-200/80 relative z-10 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Happy Anniversary Sayang! 💝
            </motion.h2>

            {/* Content Text */}
            <motion.div
              className="space-y-3.5 text-slate-600 font-rajdhani text-sm sm:text-[15px] leading-relaxed relative z-10"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p variants={smoothFadeUp}>
                Kalo kamu baca ini, selamat! Kamu udah berhasil buka hatiku
                (apasii hehe). Ini bukan sekadar halaman biasa kok, tapi isinya
                jauh lebih penting.
              </motion.p>
              <motion.p variants={smoothFadeUp}>
                Isinya bukti valid no debat kalo kita tuh pasangan paling lucu
                sedunia. Maacii yaww sayangg udah nemenin aku sejauh ini, jadi
                support system terbaik, dan tempat pulang paling ter-nyaman aku.
              </motion.p>
              <motion.p
                variants={smoothFadeUp}
                className="font-dancing text-lg sm:text-xl text-[#3b82f6] leading-relaxed mt-3 pt-3 text-center select-text border-t border-dashed border-blue-100/60"
              >
                &ldquo;Waktu berjalan dengan sangat cepat yaww sayang, tapi
                bahagia, sayang dan cintanya aku tetep sama. I love you to the
                moon and back!&rdquo;
              </motion.p>
            </motion.div>

            {/* Footer */}
            <motion.div
              className="mt-5 pt-4 border-t border-slate-200/80 flex justify-center relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 1.5 }}
            >
              <motion.button
                onClick={onClose}
                className="px-5 py-2 bg-gradient-to-r from-[#93c5fd] to-[#f472b6] text-white rounded-full font-rajdhani font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300"
                whileHover={{
                  y: -2,
                  boxShadow:
                    "0 8px 25px rgba(244,114,182,0.4), 0 4px 12px rgba(147,197,253,0.3)",
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  boxShadow:
                    "0 4px 15px rgba(244,114,182,0.25), 0 2px 8px rgba(147,197,253,0.2)",
                }}
              >
                Tutup Surat 💌
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
