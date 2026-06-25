import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAuth } from '@/lib/auth'
import { getJournalEntries } from '@/lib/db'
import type { JournalEntry } from '@/lib/db'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import styles from './TrendsPage.module.scss'

interface Entry {
  date: string
  mood: string
  energy: number
  appetite: number
  sleep: number
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const METRICS = [
  { key: 'energy' as const, label: 'Energy', color: '#e8622a' },
  { key: 'appetite' as const, label: 'Appetite', color: '#4e8fa8' },
  { key: 'sleep' as const, label: 'Sleep', color: '#7eba5a' },
]

const PIE_COLORS = ['#e8622a', '#4e8fa8', '#7eba5a', '#f0a830', '#9b6dd6', '#e26d8a']

function avg(nums: number[]): number {
  if (!nums.length) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

// A paw-shaped dot for the area chart points.
function PawDot(props: { cx?: number; cy?: number; fill?: string }) {
  const { cx, cy, fill } = props
  if (cx == null || cy == null) return null
  return (
    <text x={cx} y={cy} dy={4} textAnchor="middle" fontSize={13} aria-hidden>🐾</text>
  )
}

export function TrendsPage() {
  const navigate = useNavigate()
  const { user, premium } = useAuth()
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    if (!user) return
    getJournalEntries(user.id).then((rows: JournalEntry[]) =>
      setEntries(rows.map(r => ({
        date: fmtDate(r.created_at),
        mood: r.mood,
        energy: r.energy,
        appetite: r.appetite,
        sleep: r.sleep,
      }))),
    )
  }, [user])

  if (!premium) return <Navigate to={ROUTES.PAYWALL} replace />

  const chrono = [...entries].reverse()
  const n = chrono.length
  const data = chrono.map((e, i) => ({
    name: n > 6 ? `#${i + 1}` : e.date.replace(/,.*/, ''),
    energy: e.energy,
    appetite: e.appetite,
    sleep: e.sleep,
  }))

  const moodCounts = new Map<string, number>()
  for (const e of entries) moodCounts.set(e.mood, (moodCounts.get(e.mood) ?? 0) + 1)
  const moodData = [...moodCounts.entries()].map(([name, value]) => ({ name, value }))
  const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trends 🐾</h1>
        <p className={styles.sub}>Insights from your journal entries</p>
      </div>

      {n === 0 ? (
        <div className={styles.empty}>
          <img src="/graf.png" alt="" className={styles.emptyImg} />
          <p>No data yet — add a few journal entries to see trends.</p>
          <Button onClick={() => navigate(ROUTES.JOURNAL)}>Go to Journal</Button>
        </div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className={styles.stats}>
            {METRICS.map(m => (
              <div key={m.key} className={styles.statCard}>
                <span className={styles.statLabel}>Avg {m.label}</span>
                <span className={styles.statValue} style={{ color: m.color }}>
                  {avg(chrono.map(e => e[m.key]))}<small>/10</small>
                </span>
              </div>
            ))}
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Entries</span>
              <span className={styles.statValue}>{n}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Top mood</span>
              <span className={styles.statValueSm}>{topMood}</span>
            </div>
          </div>

          {/* Area chart — metrics over time */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Wellbeing over time</h2>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                  <defs>
                    {METRICS.map(m => (
                      <linearGradient key={m.key} id={`grad-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={m.color} stopOpacity={0.55} />
                        <stop offset="100%" stopColor={m.color} stopOpacity={0.04} />
                      </linearGradient>
                    ))}
                    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1a3a4a" floodOpacity="0.18" />
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16, border: '2px dashed #f5a07a',
                      fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(26,58,74,0.15)',
                    }}
                  />
                  {METRICS.map(m => (
                    <Area
                      key={m.key}
                      type="monotone"
                      dataKey={m.key}
                      name={m.label}
                      stroke={m.color}
                      strokeWidth={3}
                      fill={`url(#grad-${m.key})`}
                      dot={<PawDot />}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                      style={{ filter: 'url(#softShadow)' }}
                    />
                  ))}
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood distribution donut */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Mood distribution</h2>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1a3a4a" floodOpacity="0.22" />
                    </filter>
                  </defs>
                  <Pie
                    data={moodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    cornerRadius={8}
                    style={{ filter: 'url(#pieShadow)' }}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {moodData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16, border: '2px dashed #f5a07a',
                      fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(26,58,74,0.15)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
