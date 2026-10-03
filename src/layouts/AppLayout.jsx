import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router'
import {
  LayoutDashboard, User, Settings, LogOut, Menu, X, Bell, Sparkles, ChevronRight,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { toast } from 'sonner'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: User, label: 'Hồ sơ', to: '/profile' },
  { icon: Settings, label: 'Cài đặt', to: '/settings' },
]

function Avatar({ user, size = 40 }) {
  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || '?'

  if (user?.avatarUrl) {
    return (
      <div className="avatar-ring" style={{ width: size + 4, height: size + 4 }}>
        <div className="avatar-inner" style={{ width: size, height: size }}>
          <img src={user.avatarUrl} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="avatar-ring" style={{ width: size + 4, height: size + 4 }}>
      <div className="avatar-inner" style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #4c1d95, #831843)',
        fontSize: size * 0.36, fontWeight: 700, color: '#f9a8d4',
      }}>
        {initials}
      </div>
    </div>
  )
}

export default function AppLayout({ children }) {
  const { user, signOut } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Đã đăng xuất 👋')
      navigate('/auth')
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Đăng xuất thất bại.'))
    }
  }

  const SidebarContent = () => (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '24px 16px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, paddingLeft: 4 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'linear-gradient(135deg, #7c3aed, #db2777)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 4px 15px rgba(124,58,237,0.3)',
        }}>⛩️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>
            <span className="gradient-text">Moji</span>
          </div>
          <div style={{ fontSize: 10, color: 'rgba(241,240,255,0.4)', letterSpacing: '2px', fontFamily: 'var(--font-jp)' }}>
            もじ
          </div>
        </div>
      </div>

      {/* User card */}
      <div className="glass-card" style={{ padding: '14px 14px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar user={user} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#f1f0ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.displayName || user?.username}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              @{user?.username}
            </div>
          </div>
          <span className="anime-tag anime-tag-purple" style={{ fontSize: 10, padding: '2px 8px' }}>
            <Sparkles size={8} />
            Pro
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(241,240,255,0.3)', letterSpacing: '1.5px', marginBottom: 8, paddingLeft: 4 }}>
          MENU
        </div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon size={18} />
            {item.label}
            <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="nav-link"
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', marginTop: 8 }}
      >
        <LogOut size={18} style={{ color: '#f9a8d4' }} />
        <span style={{ color: '#f9a8d4' }}>Đăng xuất</span>
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', position: 'relative' }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(124,58,237,0.06) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(219,39,119,0.06) 0%, transparent 50%)
        `,
      }} />

      {/* Desktop sidebar */}
      <aside style={{
        width: 260, flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,5,32,0.8)',
        backdropFilter: 'blur(20px)',
        position: 'fixed', top: 0, left: 0, height: '100dvh',
        zIndex: 100,
        display: 'none',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar panel */}
      <aside style={{
        width: 260, position: 'fixed', top: 0, left: 0, height: '100dvh',
        background: 'rgba(10,5,32,0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 64,
          background: 'rgba(5,1,15,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, width: 38, height: 38,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(241,240,255,0.7)', transition: 'all 0.2s',
              }}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Logo for mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>⛩️</span>
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>
                <span className="gradient-text">Moji</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(241,240,255,0.6)', transition: 'all 0.2s',
              position: 'relative',
            }}>
              <Bell size={17} />
              <div style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                background: '#db2777', borderRadius: '50%',
                border: '1.5px solid #05010f',
              }} />
            </button>
            <Avatar user={user} size={34} />
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
