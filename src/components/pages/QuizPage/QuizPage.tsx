import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, QUIZ_TOTAL_STEPS } from '@/lib/constants'
import { Button } from '@/components/Button'
import type { QuizAnswers, PetType, PetAge, PetMood, PetActivity, StrangerReaction } from '@/types'
import styles from './QuizPage.module.scss'

const PERSONALITY_IMAGES = ['🌊', '🔥', '🌿', '⭐', '🌙', '🌈']

export function QuizPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const progress = (step / QUIZ_TOTAL_STEPS) * 100

  function next() {
    if (step < QUIZ_TOTAL_STEPS) setStep(s => s + 1)
    else {
      localStorage.setItem('petmind_quiz', JSON.stringify(answers))
      navigate(ROUTES.ANALYSIS)
    }
  }

  function back() {
    if (step > 1) setStep(s => s - 1)
    else navigate(ROUTES.HOME)
  }

  function patch(partial: Partial<QuizAnswers>) {
    setAnswers(prev => ({ ...prev, ...partial }))
  }

  const canNext = () => {
    switch (step) {
      case 1: return !!answers.petType
      case 2: return !!answers.petName?.trim()
      case 3: return !!answers.petAge
      case 4: return !!answers.petMood
      case 5: return !!answers.petActivity
      case 6: return answers.attentionLevel !== undefined
      case 7: return !!answers.strangerReaction
      case 8: return answers.personalityImage !== undefined
      default: return true
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={back}>← Back</button>
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.stepLabel}>{step} / {QUIZ_TOTAL_STEPS}</span>
        </div>
      </div>

      <div className={styles.body}>
        {step === 1 && (
          <Question title="What type of pet do you have?">
            <OptionGrid
              options={[
                { value: 'cat', label: 'Cat', icon: '🐱' },
                { value: 'dog', label: 'Dog', icon: '🐶' },
                { value: 'rabbit', label: 'Rabbit', icon: '🐰' },
                { value: 'bird', label: 'Bird', icon: '🐦' },
                { value: 'hamster', label: 'Hamster', icon: '🐹' },
                { value: 'other', label: 'Other', icon: '🐾' },
              ]}
              selected={answers.petType}
              onSelect={v => patch({ petType: v as PetType })}
            />
          </Question>
        )}

        {step === 2 && (
          <Question title="What is your pet's name?">
            <input
              className={styles.textInput}
              type="text"
              placeholder="Enter name..."
              value={answers.petName ?? ''}
              onChange={e => patch({ petName: e.target.value })}
              autoFocus
            />
          </Question>
        )}

        {step === 3 && (
          <Question title="How old is your pet?">
            <OptionGrid
              options={[
                { value: 'under1', label: 'Under 1 year', icon: '🌱' },
                { value: '1-3', label: '1–3 years', icon: '🌿' },
                { value: '4-7', label: '4–7 years', icon: '🌳' },
                { value: '8+', label: '8+ years', icon: '🎖️' },
              ]}
              selected={answers.petAge}
              onSelect={v => patch({ petAge: v as PetAge })}
            />
          </Question>
        )}

        {step === 4 && (
          <Question title={`How would you describe ${answers.petName || 'your pet'} today?`}>
            <OptionGrid
              options={[
                { value: 'playful', label: 'Playful', icon: '🎾' },
                { value: 'calm', label: 'Calm', icon: '😌' },
                { value: 'excited', label: 'Excited', icon: '⚡' },
                { value: 'sleepy', label: 'Sleepy', icon: '😴' },
                { value: 'anxious', label: 'Anxious', icon: '😟' },
              ]}
              selected={answers.petMood}
              onSelect={v => patch({ petMood: v as PetMood })}
            />
          </Question>
        )}

        {step === 5 && (
          <Question title={`What is ${answers.petName || 'your pet'} doing right now?`}>
            <OptionGrid
              options={[
                { value: 'sleeping', label: 'Sleeping', icon: '💤' },
                { value: 'playing', label: 'Playing', icon: '🎮' },
                { value: 'eating', label: 'Eating', icon: '🍽️' },
                { value: 'exploring', label: 'Exploring', icon: '🔍' },
                { value: 'watchingMe', label: 'Watching Me', icon: '👀' },
              ]}
              selected={answers.petActivity}
              onSelect={v => patch({ petActivity: v as PetActivity })}
            />
          </Question>
        )}

        {step === 6 && (
          <Question title={`How often does ${answers.petName || 'your pet'} seek attention?`}>
            <div className={styles.sliderWrap}>
              <div className={styles.sliderLabels}>
                <span>Never</span>
                <span>Always</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={answers.attentionLevel ?? 50}
                onChange={e => patch({ attentionLevel: Number(e.target.value) })}
                className={styles.slider}
              />
              <div className={styles.sliderValue}>{answers.attentionLevel ?? 50}%</div>
            </div>
          </Question>
        )}

        {step === 7 && (
          <Question title={`How does ${answers.petName || 'your pet'} react to strangers?`}>
            <OptionGrid
              options={[
                { value: 'friendly', label: 'Friendly', icon: '🤝' },
                { value: 'curious', label: 'Curious', icon: '🤔' },
                { value: 'shy', label: 'Shy', icon: '🙈' },
                { value: 'defensive', label: 'Defensive', icon: '🛡️' },
              ]}
              selected={answers.strangerReaction}
              onSelect={v => patch({ strangerReaction: v as StrangerReaction })}
            />
          </Question>
        )}

        {step === 8 && (
          <Question title={`Which best matches ${answers.petName || 'your pet'}'s personality?`}>
            <div className={styles.imageGrid}>
              {PERSONALITY_IMAGES.map((emoji, i) => (
                <button
                  key={i}
                  className={[styles.imageCard, answers.personalityImage === i ? styles.selectedImage : ''].join(' ')}
                  onClick={() => patch({ personalityImage: i })}
                >
                  <span>{emoji}</span>
                </button>
              ))}
            </div>
          </Question>
        )}

        <div className={styles.footer}>
          <Button size="lg" fullWidth onClick={next} disabled={!canNext()}>
            {step === QUIZ_TOTAL_STEPS ? 'See My Results' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.question}>
      <h2 className={styles.questionTitle}>{title}</h2>
      {children}
    </div>
  )
}

interface OptionGridProps {
  options: { value: string; label: string; icon: string }[]
  selected?: string
  onSelect: (v: string) => void
}

function OptionGrid({ options, selected, onSelect }: OptionGridProps) {
  return (
    <div className={styles.optionGrid}>
      {options.map(({ value, label, icon }) => (
        <button
          key={value}
          className={[styles.option, selected === value ? styles.selectedOption : ''].join(' ')}
          onClick={() => onSelect(value)}
        >
          <span className={styles.optionIcon}>{icon}</span>
          <span className={styles.optionLabel}>{label}</span>
        </button>
      ))}
    </div>
  )
}
