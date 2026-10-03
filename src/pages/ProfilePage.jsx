import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
import AppLayout from '../layouts/AppLayout'
import {
  User, Mail, Phone, FileText, Calendar, Shield, Edit3, Camera, Sparkles,
} from 'lucide-react'

function InfoRow({ icon: Icon, label, value, color = '#a78bfa' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color + '1a', border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: 'rgba(241,240,255,0.4)', fontWeight: 500, marginBottom: 2, letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: value ? '#f1f0ff' : 'rgba(241,240,255,0.25)', fontWeight: 500 }}>
          {value || '—'}
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()

  useEffect(() => {
    if (!user) fetchMe().catch(() => {})
  }, [])

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || '?'

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <AppLayout>
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Header */}
        <div className="animate-fade-in-up" style={{ opacity: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f0ff', letterSpacing: '-0.5px', marginBottom: 4 }}>
            Hồ sơ của tôi
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.4)' }}>
            Xem và cập nhật thông tin cá nhân của bạn
          </p>
        </div>

        {/* Avatar + basic info */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '32px', opacity: 0, animationDelay: '100ms' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', marginBottom: 28 }}>
            <div style={{ position: 'relative' }}>
              {/* Avatar */}
              <div style={{
                background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
                padding: 3, borderRadius: '50%',
                boxShadow: '0 0 30px rgba(124,58,237,0.4)',
              }} className="animate-pulse-glow">
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: user?.avatarUrl
                    ? 'transparent'
                    : 'linear-gradient(135deg, #4c1d95, #831843)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 800, color: '#f9a8d4',
                  overflow: 'hidden',
                }}>
                  {user?.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials
                  }
                </div>
              </div>
              {/* Camera button */}
              <button style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                border: '2px solid #05010f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <Camera size={12} style={{ color: '#fff' }} />
              </button>
            </div>

            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f0ff', marginBottom: 4 }}>
                {user?.displayName || user?.username}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'rgba(241,240,255,0.5)' }}>@{user?.username}</span>
                <span className="anime-tag anime-tag-purple" style={{ fontSize: 10 }}>
                  <Sparkles size={8} /> Thành viên
                </span>
              </div>
            </div>

            {/* Bio */}
            {user?.bio && (
              <p style={{
                fontSize: 14, color: 'rgba(241,240,255,0.6)',
                maxWidth: 380, lineHeight: 1.6,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12, padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {user.bio}
              </p>
            )}

            <button className="btn-secondary" style={{ width: 'auto', padding: '9px 20px', fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={14} />
                Chỉnh sửa hồ sơ
              </span>
            </button>
          </div>

          {/* Info rows */}
          <div>
            <InfoRow icon={User} label="Họ tên" value={user?.displayName} color="#a78bfa" />
            <InfoRow icon={Mail} label="Email" value={user?.email} color="#f472b6" />
            <InfoRow icon={Phone} label="Số điện thoại" value={user?.phone} color="#34d399" />
            <InfoRow icon={FileText} label="Giới thiệu" value={user?.bio} color="#fbbf24" />
            <InfoRow icon={Calendar} label="Ngày tham gia" value={joinDate} color="#60a5fa" />
            <InfoRow icon={Shield} label="Trạng thái" value="Hoạt động ✓" color="#34d399" />
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '200ms' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f0ff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            🏆 Thành tích
          </h3>
          <div style={{
            textAlign: 'center', padding: '32px 20px',
            color: 'rgba(241,240,255,0.3)', fontSize: 14,
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.08)',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏅</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Chưa có thành tích</div>
            <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.2)' }}>Thành tích sẽ hiện ra khi bạn hoạt động</div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
