"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VaultKeypad from "@/components/VaultKeypad";
import UnlockedView from "@/components/UnlockedView";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Subtle movement: divider 45 keeps it elegant
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) / 45,
        y: (e.clientY - window.innerHeight / 2) / 45,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isUnlocked && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch((e) => console.error("Audio auto-play prevented:", e));
    }
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      setShowContent(true);
    }, 1200);
  };

  const handleLock = () => {
    setShowContent(false);
    setIsUnlocked(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <motion.main
      className="relative min-h-screen overflow-x-hidden selection:bg-[#f472b6]/40 selection:text-slate-900"
      style={{
        background: isUnlocked
          ? "linear-gradient(135deg, #eff6ff 0%, #fae8ff 30%, #fbcfe8 65%, #dbeafe 100%)"
          : "#1a233a",
      }}
    >
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/music/Download.mp3" loop preload="auto" />

      {/* Background ambient glow - blue-pink gradient orbs (only visible when unlocked) */}
      {showContent && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 60, damping: 22 }}
        >
          {/* Animated blue/purple orb */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{
              background: "radial-gradient(circle, rgba(147,197,253,0.55) 0%, rgba(196,181,253,0.25) 50%, transparent 70%)",
              top: "-20%",
              left: "-10%",
            }}
            animate={{
              x: [0, 120, -60, 0],
              y: [0, 80, 120, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated pink/peach orb */}
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full blur-[100px]"
            style={{
              background: "radial-gradient(circle, rgba(244,114,182,0.5) 0%, rgba(253,186,116,0.2) 50%, transparent 70%)",
              bottom: "-20%",
              right: "-10%",
            }}
            animate={{
              x: [0, -100, 60, 0],
              y: [0, -80, -120, 0],
              scale: [1.1, 0.9, 1.15, 1.1],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Vibrant center-left rose glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-[110px]"
            style={{
              background: "radial-gradient(circle, rgba(251,113,133,0.4) 0%, rgba(244,114,182,0.15) 60%, transparent 80%)",
              top: "20%",
              left: "15%",
            }}
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -60, 40, 0],
              scale: [0.9, 1.1, 1, 0.9],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Soft warm gold/peach glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-[90px]"
            style={{
              background: "radial-gradient(circle, rgba(253,186,116,0.3) 0%, transparent 70%)",
              bottom: "15%",
              left: "40%",
            }}
            animate={{
              x: [0, -40, 80, 0],
              y: [0, 60, -40, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating sparkles */}
          {mounted &&
            Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1 + "px",
                  height: Math.random() * 4 + 1 + "px",
                  backgroundColor:
                    i % 3 === 0
                      ? "rgba(147, 197, 253, 0.5)"
                      : i % 3 === 1
                      ? "rgba(244, 114, 182, 0.4)"
                      : "rgba(196, 181, 253, 0.4)",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.9, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
        </motion.div>
      )}

      {/* Vault Keypad (Landing) - NO grayscale, original colors preserved */}
      <AnimatePresence>
        {!isUnlocked && <VaultKeypad onUnlock={handleUnlock} />}
      </AnimatePresence>

      {/* Main Content - fade in with color reveal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.95, filter: "grayscale(100%)" }}
            animate={{ opacity: 1, scale: 1, filter: "grayscale(0%)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
          >
            <UnlockedView onClose={handleLock} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
