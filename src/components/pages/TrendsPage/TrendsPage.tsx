import { useState } from 'react'
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { useAuth } from '@/lib/auth'
import type { DashboardContext } from '@/lib/moods'
import { ROUTES } from '@/lib/constants'
import { Button } from '@/components/Button'
import styles from './TrendsPage.module.scss'

const METRICS = [
  { key: 'energy' as const, label: 'Energy', color: '#e8622a' },
  { key: 'appetite' as const, label: 'Appetite', color: '#4e8fa8' },
  { key: 'sleep' as const, label: 'Sleep', color: '#7eba5a' },
]

const PIE_COLORS = ['#e8622a', '#4e8fa8', '#7eba5a', '#f0a830', '#9b6dd6', '#e26d8a']

const RANGES = [
  { key: 'week' as const, label: 'Week', days: 7 },
  { key: 'month' as const, label: 'Month', days: 31 },
  { key: 'all' as const, label: 'All', days: Infinity },
]

function avg(nums: number[]): number {
  if (!nums.length) return 0
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
}

function shortDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function PawDot(props: { cx?: number; cy?: number }) {
  const { cx, cy } = props
  if (cx == null || cy == null) return null
  return <text x={cx} y={cy} dy={4} textAnchor="middle" fontSize={13} aria-hidden>🐾</text>
}

export function TrendsPage() {
  const navigate = useNavigate()
  const { premium } = useAuth()
  const { journal, activePet } = useOutletContext<DashboardContext>()
  const [range, setRange] = useState<'week' | 'month' | 'all'>('month')

  if (!premium) return <Navigate to={ROUTES.PAYWALL} replace />

  // Only this pet, within the selected time range.
  const rangeDays = RANGES.find(r => r.key === range)!.days
  const now = Date.now()
  const filtered = journal.filter(e =>
    e.pet_id === activePet?.id &&
    (now - new Date(e.created_at).getTime()) / 86_400_000 <= rangeDays,
  )

  // Aggregate multiple entries per day into one averaged point.
  const byDay = new Map<string, { energy: number[]; appetite: number[]; sleep: number[]; weight: number[]; ts: number }>()
  for (const e of filtered) {
    const d = new Date(e.created_at)
    const key = d.toISOString().slice(0, 10)
    const g = byDay.get(key) ?? { energy: [], appetite: [], sleep: [], weight: [], ts: d.getTime() }
    g.energy.push(e.energy)
    g.appetite.push(e.appetite)
    g.sleep.push(e.sleep)
    if (e.weight != null) g.weight.push(e.weight)
    byDay.set(key, g)
  }
  const days = [...byDay.entries()].sort((a, b) => a[1].ts - b[1].ts)
  const data = days.map(([key, g]) => ({
    name: shortDate(new Date(key)),
    energy: avg(g.energy),
    appetite: avg(g.appetite),
    sleep: avg(g.sleep),
    weight: g.weight.length ? avg(g.weight) : null,
  }))
  const weightData = data.filter(d => d.weight != null)
  const n = data.length

  // Mood distribution (for this pet, this range).
  const moodCounts = new Map<string, number>()
  for (const e of filtered) moodCounts.set(e.mood, (moodCounts.get(e.mood) ?? 0) + 1)
  const moodData = [...moodCounts.entries()].map(([name, value]) => ({ name, value }))
  const topMood = [...moodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const tooltipStyle = {
    borderRadius: 16, border: '2px dashed #f5a07a',
    fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(26,58,74,0.15)',
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{activePet ? `${activePet.name}'s Trends 🐾` : 'Trends 🐾'}</h1>
          <p className={styles.sub}>Insights from your journal entries</p>
        </div>
        {/* Range filter */}
        <div className={styles.rangeTabs}>
          {RANGES.map(r => (
            <button
              key={r.key}
              className={`${styles.rangeTab} ${range === r.key ? styles.rangeTabActive : ''}`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {n === 0 ? (
        <div className={styles.empty}>
          <img src="/graf.png" alt="" className={styles.emptyImg} />
          <p>No data yet — add a few journal entries to see {activePet ? `${activePet.name}'s` : 'the'} trends.</p>
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
                  {avg(filtered.map(e => e[m.key]))}<small>/10</small>
                </span>
              </div>
            ))}
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Entries</span>
              <span className={styles.statValue}>{filtered.length}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Top mood</span>
              <span className={styles.statValueSm}>{topMood}</span>
            </div>
          </div>

          {/* Area chart — daily averages */}
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
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip contentStyle={tooltipStyle} />
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
                    />
                  ))}
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight chart */}
          {weightData.length > 0 && (
            <div className={styles.chartCard}>
              <h2 className={styles.chartTitle}>Weight (kg)</h2>
              <div className={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad-weight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9b6dd6" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#9b6dd6" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#a3a3a3' }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="weight" name="Weight" stroke="#9b6dd6" strokeWidth={3} fill="url(#grad-weight)" dot={<PawDot />} activeDot={{ r: 5, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Mood distribution donut */}
          <div className={styles.chartCard}>
            <h2 className={styles.chartTitle}>Mood distribution</h2>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
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
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {moodData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
