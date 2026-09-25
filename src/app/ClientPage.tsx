"use client";

import { useState, useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import VaultKeypad from "@/components/VaultKeypad";
import UnlockedView from "@/components/UnlockedView";

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // GPU-only parallax (no React re-render on mousemove)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 20, damping: 25 });
  const parallaxY = useSpring(mouseY, { stiffness: 20, damping: 25 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 80);
      mouseY.set((e.clientY - window.innerHeight / 2) / 80);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (isUnlocked && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isUnlocked]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleUnlockStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleUnlock = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setIsUnlocked(true);
    setTimeout(() => setShowContent(true), 1200);
  };

  const handleLock = () => {
    setShowContent(false);
    setIsUnlocked(false);
    setIsPlaying(false);
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
      <audio ref={audioRef} src="/music/Download.mp3" loop preload="none" />

      {/* Background ambient glow (no blur filter — GPU-friendly) */}
      {showContent && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          style={{ x: parallaxX, y: parallaxY }}
          transition={{ type: "spring", stiffness: 20, damping: 25 }}
        >
          {/* 4 softer soft glows (replaces blur-90 orbs) */}
          {[
            { bg: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)", top: "-5%", left: "-5%", w: "70vw", h: "70vw", dur: 30, scale: [1, 1.08, 0.95, 1] },
            { bg: "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)", bottom: "-5%", right: "-5%", w: "60vw", h: "60vw", dur: 27, scale: [1.05, 0.95, 1.08, 1.05] },
            { bg: "radial-gradient(circle, rgba(251,113,133,0.2) 0%, transparent 70%)", top: "20%", left: "10%", w: "50vw", h: "50vw", dur: 24, scale: [0.95, 1.05, 1, 0.95] },
            { bg: "radial-gradient(circle, rgba(253,186,116,0.18) 0%, transparent 70%)", bottom: "15%", left: "35%", w: "40vw", h: "40vw", dur: 21, scale: [1, 1.1, 0.95, 1] },
          ].map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                background: orb.bg,
                width: orb.w,
                height: orb.h,
                top: orb.top,
                left: orb.left,
                willChange: "transform",
              }}
              animate={{ x: [0, 30, -20, 0], y: [0, 20, 30, 0], scale: orb.scale }}
              transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Sparkles — reduced to 4, transform+opacity only */}
          {mounted &&
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  backgroundColor:
                    i % 3 === 0
                      ? "rgba(147, 197, 253, 0.4)"
                      : i % 3 === 1
                      ? "rgba(244, 114, 182, 0.35)"
                      : "rgba(196, 181, 253, 0.35)",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  willChange: "transform, opacity",
                }}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: Math.random() * 4 + 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
              />
            ))}
        </motion.div>
      )}

      <AnimatePresence>
        {!isUnlocked && <VaultKeypad onUnlock={handleUnlock} onUnlockStart={handleUnlockStart} />}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <UnlockedView
              onClose={handleLock}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
