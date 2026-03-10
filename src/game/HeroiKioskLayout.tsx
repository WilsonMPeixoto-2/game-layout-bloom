import { AnimatePresence, motion } from 'framer-motion';
import { SCREEN_ORDER } from './types';
import { getScene } from './sceneData';
import { useGameState } from './hooks/useGameState';
import ParticleLayer from './effects/ParticleLayer';
import AttractScene from './scenes/AttractScene';
import IntroScene from './scenes/IntroScene';
import AvatarScene from './scenes/AvatarScene';
import ToolkitScene from './scenes/ToolkitScene';
import RepairScene from './scenes/RepairScene';
import ResultScene from './scenes/ResultScene';
import '../styles/heroi-kiosk.css';

const sceneTransition = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: 'easeIn' as const } },
};

export default function HeroiKioskLayout() {
  const {
    state, scene, completedCores,
    goNext, goPrev, setScreen, setAvatar,
    toggleTool, setArmedTool, applyToolToSlot,
    restart, unlockAudio,
  } = useGameState();

  const { screen } = state;
  const repairIntensity = completedCores / 4;

  const handleStart = async () => {
    await unlockAudio();
    goNext();
  };

  return (
    <div className="heroi-root">
      {/* Dev switcher */}
      <div className="theme-switcher">
        {SCREEN_ORDER.map((s) => (
          <button key={s} className={screen === s ? 'active' : ''} onClick={() => setScreen(s)}>
            {getScene(s).label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={screen} {...sceneTransition} style={{ position: 'absolute', inset: 0 }}>
          <div className="scene">
            <div className="scene-bg" style={{ backgroundImage: `url(${scene.bg})` }} />
            <ParticleLayer preset={scene.particles} intensity={repairIntensity} />

            {screen === 'ATTRACT' && scene.narrative && (
              <AttractScene narrative={scene.narrative} onStart={handleStart} />
            )}
            {screen === 'INTRO' && scene.narrative && (
              <IntroScene narrative={scene.narrative} onNext={goNext} />
            )}
            {screen === 'AVATAR' && (
              <AvatarScene avatar={state.avatar} setAvatar={setAvatar} onNext={goNext} onBack={goPrev} />
            )}
            {screen === 'TOOLKIT' && (
              <ToolkitScene selected={state.selectedTools} toggleTool={toggleTool} onNext={goNext} onBack={goPrev} />
            )}
            {screen === 'REPAIR' && (
              <RepairScene
                tools={state.selectedTools}
                armed={state.armedTool}
                setArmed={setArmedTool}
                progress={state.slotProgress}
                applyToolToSlot={applyToolToSlot}
                combo={state.combo}
                maxCombo={state.maxCombo}
                energy={state.energy}
                timeRemaining={state.timeRemaining}
                onNext={goNext}
                onBack={goPrev}
              />
            )}
            {screen === 'RESULT' && (
              <ResultScene
                tools={state.selectedTools}
                progress={state.slotProgress}
                energy={state.energy}
                maxCombo={state.maxCombo}
                onRestart={restart}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="progress-dots">
        {SCREEN_ORDER.map((s, i) => (
          <button
            key={s}
            className={`progress-dot ${screen === s ? 'active' : SCREEN_ORDER.indexOf(screen) > i ? 'completed' : ''}`}
            onClick={() => setScreen(s)}
            aria-label={getScene(s).label}
          />
        ))}
      </div>
    </div>
  );
}
