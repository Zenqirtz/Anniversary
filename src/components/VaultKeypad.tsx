"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VaultKeypadProps {
  onUnlock: () => void;
}

const CORRECT_CODE = "0625";
const MAX_LENGTH = 4;

export default function VaultKeypad({ onUnlock }: VaultKeypadProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"locked" | "error" | "success">("locked");
  const [shaking, setShaking] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (status === "success") return;

      if (key === "HAPUS") {
        setCode((prev) => prev.slice(0, -1));
        setStatus("locked");
        return;
      }

      if (key === "OK") {
        if (code === CORRECT_CODE) {
          setStatus("success");
          setGlitching(true);
          setTimeout(() => onUnlock(), 1500);
        } else {
          setStatus("error");
          setShaking(true);
          setTimeout(() => {
            setShaking(false);
            setCode("");
            setStatus("locked");
          }, 800);
        }
        return;
      }

      if (code.length < MAX_LENGTH) {
        setCode((prev) => prev + key);
        setStatus("locked");
      }
    },
    [code, status, onUnlock]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "Enter") {
        handleKeyPress("OK");
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleKeyPress("HAPUS");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1c1c1c 0%, #2a2a2a 50%, #1f1f1f 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle ambient glow */}
      <motion.div
        className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft floating particles */}
      {mounted && Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.15 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.05, 0.25, 0.05],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Background glitch artifacts on success */}
      <AnimatePresence>
        {glitching && (
          <>
            <motion.div
              className="absolute inset-0 bg-white/5 mix-blend-overlay z-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0.1, 0.8, 0],
                x: [0, -10, 10, -5, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
            />
            <motion.div
              className="absolute inset-0 bg-white/3 mix-blend-screen z-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.3, 0, 0.5, 0],
                y: [0, 3, -3, 2, 0]
              }}
              transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Keypad Card */}
      <motion.div
        className={`relative w-[340px] rounded-[24px] p-8 overflow-hidden backdrop-blur-xl border z-10 ${
          shaking ? "animate-shake border-[#ff2d75]/80" : "border-white/10"
        }`}
        style={{
          background: "linear-gradient(180deg, rgba(50,50,50,0.7) 0%, rgba(35,35,35,0.8) 100%)",
          boxShadow: status === "error"
            ? "0 0 30px rgba(255, 45, 117, 0.3), inset 0 0 20px rgba(255, 45, 117, 0.1)"
            : status === "success"
              ? "0 0 50px rgba(57, 255, 20, 0.4), inset 0 0 30px rgba(57, 255, 20, 0.2)"
              : "0 25px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={
          glitching ? {
            x: [0, -5, 5, -2, 2, 0],
            y: [0, 2, -2, 1, -1, 0],
            filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
          } : {
            y: 0,
            opacity: 1,
            scale: 1,
          }
        }
        transition={glitching ? { duration: 0.2, repeat: Infinity } : { type: "spring", stiffness: 200, damping: 25, delay: 0.2 }}
      >
        {/* Subtle top shimmer */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        <div className="flex flex-col items-center relative z-10">
          {/* Lock icon */}
          <motion.div
            className="mb-2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-orbitron text-xl font-bold text-white/90 tracking-widest uppercase mb-1"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            BRANKAS RAHASIA
          </motion.h1>

          {/* Status */}
          <div className="flex items-center gap-1.5 mb-6 text-[10px] font-mono tracking-widest uppercase">
            <motion.span
              className={`w-2 h-2 rounded-full ${status === "success" ? "bg-[#39ff14]" : status === "error" ? "bg-[#ff2d75]" : "bg-[#ff2d75]"
                }`}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: status === "locked" ? 2 : 0.2, repeat: Infinity }}
              style={{
                boxShadow: `0 0 8px ${status === "success" ? "#39ff14" : "#ff2d75"}`
              }}
            />
            <span className={status === "success" ? "text-[#39ff14]" : status === "error" ? "text-[#ff2d75]" : "text-gray-400"}>
              STATUS : {status === "success" ? "TERBUKA" : status === "error" ? "DITOLAK" : "TERKUNCI"}
            </span>
          </div>

          {/* Display */}
          <div className={`w-full h-14 rounded-lg mb-3 flex items-center justify-center gap-4 border transition-colors duration-300 ${
            status === "error"
              ? "bg-[#2a1015]/80 border-[#ff2d75]/20"
              : status === "success"
              ? "bg-[#102a15]/80 border-[#39ff14]/20"
              : "bg-black/40 border-white/5"
          }`}
            style={{ boxShadow: "inset 0 2px 10px rgba(0,0,0,0.4)" }}
          >
            {Array.from({ length: MAX_LENGTH }).map((_, i) => (
              <motion.span
                key={i}
                className="text-white text-2xl"
                initial={{ scale: 0 }}
                animate={{ scale: code.length > i ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                ●
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-white/40 text-[9px] font-mono tracking-widest uppercase mb-4 flex items-center gap-2"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-4 h-px bg-white/20" />
            MASUKAN KODE AKSES
            <span className="w-4 h-px bg-white/20" />
          </motion.p>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num, idx) => (
              <motion.button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="h-12 rounded-lg bg-gradient-to-b from-[#555] to-[#3a3a3a] hover:from-[#666] hover:to-[#4a4a4a] text-white font-orbitron text-lg font-bold shadow-[0_3px_0_#2a2a2a] hover:shadow-[0_3px_0_#333,0_0_12px_rgba(255,255,255,0.08)] active:translate-y-1 active:shadow-[0_0_0_#2a2a2a] transition-all border border-white/[0.06]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                whileTap={{ scale: 0.93 }}
              >
                {num}
              </motion.button>
            ))}

            {/* Bottom row */}
            <motion.button
              onClick={() => handleKeyPress("HAPUS")}
              className="h-12 flex items-center justify-center text-[#ff2d75] font-orbitron text-xs font-bold hover:text-white transition-colors group relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-[#ff2d75] scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform opacity-20" />
              <span className="relative z-10">HAPUS</span>
            </motion.button>
            <motion.button
              onClick={() => handleKeyPress("0")}
              className="h-12 rounded-lg bg-gradient-to-b from-[#555] to-[#3a3a3a] hover:from-[#666] hover:to-[#4a4a4a] text-white font-orbitron text-lg font-bold shadow-[0_3px_0_#2a2a2a] hover:shadow-[0_3px_0_#333,0_0_12px_rgba(255,255,255,0.08)] active:translate-y-1 active:shadow-[0_0_0_#2a2a2a] transition-all flex items-center justify-center border border-white/[0.06]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.74, type: "spring", stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.93 }}
            >
              <div className="w-4 h-4 border-2 border-white rounded-[4px] opacity-80" />
            </motion.button>
            <motion.button
              onClick={() => handleKeyPress("OK")}
              className="h-12 flex items-center justify-center text-white/70 font-orbitron text-xs font-bold hover:text-white transition-colors group relative overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, type: "spring", stiffness: 300, damping: 25 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform opacity-10" />
              <span className="relative z-10">OK</span>
            </motion.button>
          </div>
        </div>

        {/* Success Screen Overlay */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#39ff14]/40 to-[#152a1a]/90 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-[24px]"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-[#39ff14] rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_#39ff14]"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-8 h-8 bg-[#39ff14] rounded-full animate-ping" />
              </motion.div>
              <span className="font-orbitron text-[#39ff14] font-bold text-xl tracking-widest text-center"
                style={{ textShadow: "0 0 10px #39ff14" }}>
                ACCESS<br />GRANTED
              </span>
              <motion.div
                className="mt-6 text-white/50 font-mono text-xs"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                Decrypting payload...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
