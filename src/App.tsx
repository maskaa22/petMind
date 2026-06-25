import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { DashboardLayout } from '@/components/DashboardLayout'
import { LandingPage } from '@/components/pages/LandingPage'
import { AuthPage } from '@/components/pages/AuthPage'
import { QuizPage } from '@/components/pages/QuizPage'
import { AnalysisPage } from '@/components/pages/AnalysisPage'
import { PaywallPage } from '@/components/pages/PaywallPage'
import { CheckoutPage } from '@/components/pages/CheckoutPage'
import { DashboardPage } from '@/components/pages/DashboardPage'
import { ReportsPage } from '@/components/pages/ReportsPage'
import { AIChatPage } from '@/components/pages/AIChatPage'
import { JournalPage } from '@/components/pages/JournalPage'
import { TrendsPage } from '@/components/pages/TrendsPage'
import { SettingsPage } from '@/components/pages/SettingsPage'
import { ROUTES } from '@/lib/constants'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
        <Route path={ROUTES.QUIZ} element={<QuizPage />} />
        <Route path={ROUTES.ANALYSIS} element={<AnalysisPage />} />
        <Route path={ROUTES.PAYWALL} element={<PaywallPage />} />
        <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="chat" element={<AIChatPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="trends" element={<TrendsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
