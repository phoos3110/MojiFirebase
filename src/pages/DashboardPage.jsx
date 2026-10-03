import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
import AppLayout from '../layouts/AppLayout'
import {
  Sparkles, TrendingUp, Clock, Users, Zap, BookOpen, Heart, Star,
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="stat-card glass-card-hover animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color + '22',
          border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color }} />
        </div>
        <span style={{ fontSize: 11, color: 'rgba(241,240,255,0.3)', fontWeight: 500 }}>tuần này</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f0ff', letterSpacing: '-0.5px', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(241,240,255,0.5)', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  )
}


export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()

  useEffect(() => {
    // Re-fetch user nếu chưa có đủ data
    if (!user) fetchMe().catch(() => {})
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng'
    if (h < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  return (
    <AppLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Hero greeting */}
        <div className="animate-fade-in-up" style={{ opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>🌸</span>
            <div>
              <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.5)', letterSpacing: '0.5px', marginBottom: 4 }}>
                {greeting()},
              </p>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                <span className="gradient-text">{user?.displayName || user?.username || 'Otaku'}</span>{' '}
                <span style={{ color: '#f1f0ff' }}>さん! ✨</span>
              </h1>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.45)', marginLeft: 44 }}>
            Hôm nay bạn có muốn xem anime gì không? 🎌
          </p>
        </div>

        {/* Banner */}
        <div className="animate-fade-in-up" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(219,39,119,0.2) 50%, rgba(99,102,241,0.2) 100%)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 20, padding: '28px 32px',
          position: 'relative', overflow: 'hidden',
          animationDelay: '100ms', opacity: 0,
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(219,39,119,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="anime-tag anime-tag-gold" style={{ marginBottom: 12, display: 'inline-flex' }}>
              <Zap size={10} />
              MÙA MỚI
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f0ff', marginBottom: 8 }}>
              Anime mùa Thu 2026 đã ra! 🍂
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.6)', marginBottom: 20 }}>
              Khám phá hơn 40+ series mới nhất vừa được phát hành trong mùa này.
            </p>
            <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px', fontSize: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={15} />
                Khám phá ngay
              </span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(241,240,255,0.8)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={17} style={{ color: '#a78bfa' }} />
            Thống kê của bạn
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            <StatCard icon={BookOpen} label="Anime đã xem" value="—" color="#a78bfa" delay={0} />
            <StatCard icon={Clock} label="Giờ xem" value="—" color="#f472b6" delay={100} />
            <StatCard icon={Heart} label="Yêu thích" value="—" color="#f59e0b" delay={200} />
            <StatCard icon={Users} label="Bạn bè" value="—" color="#34d399" delay={300} />
          </div>
        </div>

        {/* Anime list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(241,240,255,0.8)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star size={17} style={{ color: '#f59e0b' }} />
              Đang thịnh hành
            </h2>
          </div>
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'rgba(241,240,255,0.3)', fontSize: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎌</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Chưa có dữ liệu</div>
            <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.2)' }}>Dữ liệu anime sẽ hiện ra khi kết nối API</div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
