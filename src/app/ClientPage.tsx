"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useMotionValue, useSpring, AnimatePresence, motion } from "framer-motion";
import VaultKeypad from "@/components/VaultKeypad";
import UnlockedView from "@/components/UnlockedView";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 20, damping: 25 });
  const parallaxY = useSpring(mouseY, { stiffness: 20, damping: 25 });

  useEffect(() => {
    setMounted(true);
    if (isMobile || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 80);
      mouseY.set((e.clientY - window.innerHeight / 2) / 80);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isMobile, reducedMotion]);

  const sparkles = useMemo(
    () =>
      Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => ({
        id: i,
        width: Math.random() * 4 + 1,
        height: Math.random() * 4 + 1,
        color:
          i % 3 === 0
            ? "rgba(147, 197, 253, 0.4)"
            : i % 3 === 1
            ? "rgba(244, 114, 182, 0.35)"
            : "rgba(196, 181, 253, 0.35)",
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 2,
      })),
    [isMobile]
  );

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

  const orbCount = isMobile ? 2 : 4;
  const orbs = useMemo(() => [
    { bg: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)", top: "-5%", left: "-5%", w: "70vw", h: "70vw", dur: 30, scale: [1, 1.08, 0.95, 1] as number[] },
    { bg: "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)", bottom: "-5%", right: "-5%", w: "60vw", h: "60vw", dur: 27, scale: [1.05, 0.95, 1.08, 1.05] as number[] },
    { bg: "radial-gradient(circle, rgba(251,113,133,0.2) 0%, transparent 70%)", top: "20%", left: "10%", w: "50vw", h: "50vw", dur: 24, scale: [0.95, 1.05, 1, 0.95] as number[] },
    { bg: "radial-gradient(circle, rgba(253,186,116,0.18) 0%, transparent 70%)", bottom: "15%", left: "35%", w: "40vw", h: "40vw", dur: 21, scale: [1, 1.1, 0.95, 1] as number[] },
  ], []);

  return (
    <motion.main
      className="relative min-h-screen overflow-x-hidden selection:bg-[#f472b6]/40 selection:text-slate-900"
      style={{
        background: isUnlocked
          ? "linear-gradient(135deg, #eff6ff 0%, #fae8ff 30%, #fbcfe8 65%, #dbeafe 100%)"
          : "#1a233a",
        contain: "layout style",
      }}
    >
      <audio ref={audioRef} src="/music/Download.mp3" loop preload="none" />

      {showContent && !reducedMotion && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
          style={{ x: isMobile ? 0 : parallaxX, y: isMobile ? 0 : parallaxY, contain: "strict" }}
        >
          {orbs.slice(0, orbCount).map((orb, i) => (
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
                contain: "strict",
              }}
              animate={{ x: [0, 30, -20, 0], y: [0, 20, 30, 0], scale: orb.scale }}
              transition={{ duration: orb.dur, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {mounted &&
            sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                className="absolute rounded-full"
                style={{
                  width: sparkle.width,
                  height: sparkle.height,
                  backgroundColor: sparkle.color,
                  left: `${sparkle.left}%`,
                  top: `${sparkle.top}%`,
                }}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: sparkle.duration, repeat: Infinity, ease: "easeInOut", delay: sparkle.delay }}
              />
            ))}
        </motion.div>
      )}

      <AnimatePresence>
        {!isUnlocked && <VaultKeypad onUnlock={handleUnlock} onUnlockStart={handleUnlockStart} reducedMotion={reducedMotion} />}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: reducedMotion ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <UnlockedView
              onClose={handleLock}
              isPlaying={isPlaying}
              isMuted={isMuted}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              reducedMotion={reducedMotion}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
