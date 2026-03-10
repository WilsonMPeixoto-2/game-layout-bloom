import { motion } from 'framer-motion';
import type { StoryChoice } from '../types';

interface Props {
  choices: StoryChoice[];
  selectedTools: string[];
  onSelect: (choice: StoryChoice) => void;
}

export default function ChoicePanel({ choices, selectedTools, onSelect }: Props) {
  return (
    <motion.div
      className="vn-choices"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {choices.map((choice, idx) => {
        const hasRequiredTool = !choice.requiredTool || selectedTools.includes(choice.requiredTool);

        return (
          <motion.button
            key={idx}
            className={`vn-choice-btn ${choice.emotion || 'neutral'} ${hasRequiredTool ? 'available' : ''}`}
            onClick={() => onSelect(choice)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="vn-choice-text">{choice.label}</span>
            {choice.requiredTool && hasRequiredTool && (
              <span className="vn-choice-badge">✦ Ferramenta Ativa</span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
