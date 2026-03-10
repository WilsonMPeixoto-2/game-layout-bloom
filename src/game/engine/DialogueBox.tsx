import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAudioEngine } from '../audio/AudioEngine';

interface Props {
  speaker: string;
  text: string;
  onAdvance: () => void;
  isComplete: boolean;
}

const CHAR_DELAY = 22;

export default function DialogueBox({ speaker, text, onAdvance, isComplete }: Props) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const prevTextRef = useRef(text);
  const charCountRef = useRef(0);

  // Reset typewriter when text changes
  useEffect(() => {
    if (text !== prevTextRef.current) {
      setDisplayedChars(0);
      setIsTyping(true);
      prevTextRef.current = text;
      charCountRef.current = 0;
    }
  }, [text]);

  // Typewriter timer with subtle sound
  useEffect(() => {
    if (!isTyping || displayedChars >= text.length) {
      if (displayedChars >= text.length && isTyping) {
        setIsTyping(false);
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedChars(prev => prev + 1);
      charCountRef.current += 1;
      // Play subtle tick every 4 chars
      if (charCountRef.current % 4 === 0) {
        try { getAudioEngine().playSfx('select'); } catch {}
      }
    }, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [displayedChars, text.length, isTyping]);

  const handleClick = useCallback(() => {
    if (isTyping) {
      setDisplayedChars(text.length);
      setIsTyping(false);
    } else if (!isComplete) {
      onAdvance();
    }
  }, [isTyping, text.length, isComplete, onAdvance]);

  const displayedText = text.slice(0, displayedChars);

  return (
    <div className="vn-dialogue-container" onClick={handleClick}>
      <AnimatePresence mode="wait">
        <motion.div
          key={speaker}
          className="vn-speaker-badge"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {speaker}
        </motion.div>
      </AnimatePresence>

      <div className="vn-dialogue-box">
        <p className="vn-dialogue-text">
          {displayedText}
          {isTyping && <span className="vn-cursor">▍</span>}
        </p>

        {!isTyping && !isComplete && (
          <motion.div
            className="vn-advance-indicator"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ▼
          </motion.div>
        )}
      </div>
    </div>
  );
}