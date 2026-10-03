import { Navigate, useNavigate } from 'react-router'
import { Sparkles } from 'lucide-react'
import useAuthStore from '../store/authStore'
import SakuraBackground from '../components/SakuraBackground'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 24, position: 'relative',
    }}>
      <SakuraBackground />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="glass-card animate-fade-in-up" style={{ padding: '48px 40px', maxWidth: 440, position: 'relative', zIndex: 10 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }} className="animate-float">⛩️</div>
        <h1 style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-2px', marginBottom: 8 }}>
          <span className="gradient-text">404</span>
        </h1>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f0ff', marginBottom: 12 }}>
          Trang không tồn tại
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.5)', marginBottom: 28, lineHeight: 1.6 }}>
          Bạn đã lạc vào chiều không gian khác rồi! 🌌<br />
          Hãy quay về thế giới Moji nào.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth')}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={16} />
            Về trang chính
          </span>
        </button>
      </div>
    </div>
  )
}
