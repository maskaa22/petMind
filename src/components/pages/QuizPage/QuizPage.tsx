import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, QUIZ_TOTAL_STEPS } from '@/lib/constants'
import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import type { IconName } from '@/components/Icon'
import { useAuth } from '@/lib/auth'
import { createPet } from '@/lib/db'
import type { QuizAnswers, PetType, PetAge, PetMood, PetActivity, StrangerReaction } from '@/types'
import styles from './QuizPage.module.scss'

const PERSONALITY_IMAGES: { icon: IconName; label: string }[] = [
  { icon: 'activity', label: 'Flowing' },
  { icon: 'zap', label: 'Fiery' },
  { icon: 'heart', label: 'Gentle' },
  { icon: 'star', label: 'Bright' },
  { icon: 'moon', label: 'Dreamy' },
  { icon: 'sparkles', label: 'Playful' },
]

const PET_MOOD_FOLDER: Partial<Record<string, string>> = {
  cat:     'cat',
  dog:     'dog',
  rabbit:  'rabbit',
  bird:    'chicken',
  hamster: 'ho',
  other:   'cub', // "Cow"
}

// Map quiz age buckets to a representative number (years).
const AGE_YEARS: Record<string, number> = { under1: 0.5, '1-3': 2, '4-7': 5, '8+': 9 }

export function QuizPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({})

  const progress = (step / QUIZ_TOTAL_STEPS) * 100

  async function next() {
    if (step < QUIZ_TOTAL_STEPS) { setStep(s => s + 1); return }

    // Final step → save locally (for the report) and create a pet row in the DB.
    localStorage.setItem('petmind_quiz', JSON.stringify(answers))
    if (user) {
      const pet = await createPet(user.id, {
        name: answers.petName?.trim() || 'My pet',
        age: answers.petAge ? AGE_YEARS[answers.petAge] ?? null : null,
        quiz: answers,
      })
      if (pet) localStorage.setItem('petmind_active_pet', pet.id)
    }
    navigate(ROUTES.ANALYSIS)
  }

  function back() {
    if (step > 1) setStep(s => s - 1)
    else navigate(-1) // return to wherever the user came from (dashboard, landing…)
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
                { value: 'cat',     label: 'Cat',     img: '/cat.png' },
                { value: 'dog',     label: 'Dog',     img: '/dog1.png' },
                { value: 'rabbit',  label: 'Rabbit',  img: '/rabbit.png' },
                { value: 'bird',    label: 'Bird',    img: '/chiken.png' },
                { value: 'hamster', label: 'Hamster', img: '/ho.png' },
                { value: 'other',   label: 'Cow',     img: '/cub.png' },
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
                { value: 'under1', label: 'Under 1 year', img: '/tree/1.png' },
                { value: '1-3',    label: '1–3 years',    img: '/tree/2.png' },
                { value: '4-7',    label: '4–7 years',    img: '/tree/3.png' },
                { value: '8+',     label: '8+ years',     img: '/tree/4.png' },
              ]}
              selected={answers.petAge}
              onSelect={v => patch({ petAge: v as PetAge })}
            />
          </Question>
        )}

        {step === 4 && (
          <Question title={`How would you describe ${answers.petName || 'your pet'} today?`}>
            {(() => {
              const folder = PET_MOOD_FOLDER[answers.petType ?? '']
              const isOther = !folder
              return (
                <OptionGrid
                  options={isOther ? [
                    { value: 'playful',  label: 'Playful',  icon: '🎾' },
                    { value: 'calm',     label: 'Calm',     icon: '😌' },
                    { value: 'excited',  label: 'Excited',  icon: '⚡' },
                    { value: 'sleepy',   label: 'Sleepy',   icon: '😴' },
                    { value: 'anxious',  label: 'Anxious',  icon: '😟' },
                    { value: 'curious',  label: 'Curious',  icon: '🤔' },
                  ] : [
                    { value: 'playful',  label: 'Playful',  img: `/test/${folder}/Playful.png` },
                    { value: 'calm',     label: 'Calm',     img: `/test/${folder}/Calm.png` },
                    { value: 'excited',  label: 'Excited',  img: `/test/${folder}/Excited.png` },
                    { value: 'sleepy',   label: 'Sleepy',   img: `/test/${folder}/Sleepy.png` },
                    { value: 'anxious',  label: 'Anxious',  img: `/test/${folder}/Anxious.png` },
                    { value: 'curious',  label: 'Curious',  img: `/test/${folder}/curious.png` },
                  ]}
                  selected={answers.petMood}
                  onSelect={v => patch({ petMood: v as PetMood })}
                />
              )
            })()}
          </Question>
        )}

        {step === 5 && (
          <Question title={`What is ${answers.petName || 'your pet'} doing right now?`}>
            <OptionGrid
              options={[
                { value: 'sleeping', label: 'Sleeping', svg: 'moon' },
                { value: 'playing', label: 'Playing', svg: 'play' },
                { value: 'eating', label: 'Eating', svg: 'bowl' },
                { value: 'exploring', label: 'Exploring', svg: 'compass' },
                { value: 'watchingMe', label: 'Watching Me', svg: 'eye' },
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
                { value: 'friendly', label: 'Friendly', svg: 'heart' },
                { value: 'curious', label: 'Curious', svg: 'eye' },
                { value: 'shy', label: 'Shy', svg: 'eye-off' },
                { value: 'defensive', label: 'Defensive', svg: 'shield' },
              ]}
              selected={answers.strangerReaction}
              onSelect={v => patch({ strangerReaction: v as StrangerReaction })}
            />
          </Question>
        )}

        {step === 8 && (
          <Question title={`Which best matches ${answers.petName || 'your pet'}'s personality?`}>
            <div className={styles.imageGrid}>
              {PERSONALITY_IMAGES.map(({ icon, label }, i) => (
                <button
                  key={i}
                  className={[styles.imageCard, answers.personalityImage === i ? styles.selectedImage : ''].join(' ')}
                  onClick={() => patch({ personalityImage: i })}
                >
                  <span className={styles.imageIcon}><Icon name={icon} size={36} /></span>
                  <span className={styles.optionLabel}>{label}</span>
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
  options: { value: string; label: string; icon?: string; img?: string; svg?: IconName }[]
  selected?: string
  onSelect: (v: string) => void
}

function OptionGrid({ options, selected, onSelect }: OptionGridProps) {
  return (
    <div className={styles.optionGrid}>
      {options.map(({ value, label, icon, img, svg }) => (
        <button
          key={value}
          className={[styles.option, selected === value ? styles.selectedOption : ''].join(' ')}
          onClick={() => onSelect(value)}
        >
          {img
            ? <img src={img} alt={label} className={styles.optionImg} />
            : svg
              ? <span className={styles.optionSvg}><Icon name={svg} size={32} /></span>
              : <span className={styles.optionIcon}>{icon}</span>
          }
          <span className={styles.optionLabel}>{label}</span>
        </button>
      ))}
    </div>
  )
}
