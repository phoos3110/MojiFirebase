import { useState, useRef, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router'
import {
  LayoutDashboard, User, Settings, LogOut, Menu, X, Bell, Sparkles, ChevronRight,
  BellRing
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import useNotificationStore from '../store/notificationStore'
import { toast } from 'sonner'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'

function formatRelativeTime(date) {
  if (!date) return ''
  const rtf = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' })
  const diffInSeconds = Math.round((date - new Date()) / 1000)
  
  if (Math.abs(diffInSeconds) < 60) return 'Vừa xong'
  
  const diffInMinutes = Math.round(diffInSeconds / 60)
  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, 'minute')
  
  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, 'hour')
  
  const diffInDays = Math.round(diffInHours / 24)
  if (Math.abs(diffInDays) < 30) return rtf.format(diffInDays, 'day')
  
  const diffInMonths = Math.round(diffInDays / 30)
  if (Math.abs(diffInMonths) < 12) return rtf.format(diffInMonths, 'month')
  
  return rtf.format(Math.round(diffInDays / 365), 'year')
}

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
  const { notifications, unreadCount, listenToNotifications, stopListening, markAsRead, markAllAsRead } = useNotificationStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNotifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.uid) {
      listenToNotifications(user.uid)
    }
    return () => stopListening()
  }, [user?.uid, listenToNotifications, stopListening])

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleMarkAllRead = async (e) => {
    e.stopPropagation()
    if (!user?.uid) return
    await markAllAsRead(user.uid)
    toast.success('Đã đánh dấu đọc tất cả')
  }

  const handleNotifClick = async (notif) => {
    if (!notif.read && user?.uid) {
      await markAsRead(user.uid, notif.id)
    }
    setNotifOpen(false)
  }

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
            
            {/* Notification Dropdown */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setNotifOpen(!isNotifOpen)}
                style={{
                  background: isNotifOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, width: 38, height: 38,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(241,240,255,0.6)', transition: 'all 0.2s',
                  position: 'relative',
                }}>
                <Bell size={17} />
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                    background: '#db2777', borderRadius: '50%',
                    border: '1.5px solid #05010f',
                  }} />
                )}
              </button>

              {isNotifOpen && (
                <div className="animate-fade-in-up" style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 320,
                  background: 'rgba(10,5,32,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(20px)', zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#f1f0ff' }}>Thông báo {unreadCount > 0 && `(${unreadCount})`}</h3>
                    {unreadCount > 0 && (
                      <span onClick={handleMarkAllRead} style={{ fontSize: 12, color: '#a78bfa', cursor: 'pointer', fontWeight: 500 }}>
                        Đánh dấu đã đọc
                      </span>
                    )}
                  </div>
                  <div style={{ maxHeight: 340, overflowY: 'auto', padding: '8px' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px 12px', textAlign: 'center', color: 'rgba(241,240,255,0.4)', fontSize: 13 }}>
                        <BellRing size={32} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
                        Bạn chưa có thông báo nào.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '12px', borderRadius: 8, marginBottom: 4,
                          background: !n.read ? 'rgba(219,39,119,0.08)' : 'transparent',
                          display: 'flex', gap: 12, cursor: 'pointer',
                          transition: 'background 0.2s',
                        }} className="glass-card-hover" onClick={() => handleNotifClick(n)}>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: !n.read ? '#db2777' : 'transparent', marginTop: 6, flexShrink: 0 }} />
                           <div>
                             <div style={{ fontSize: 13, fontWeight: 600, color: !n.read ? '#f1f0ff' : 'rgba(241,240,255,0.7)' }}>{n.title}</div>
                             <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.5)', marginTop: 4, lineHeight: 1.4 }}>{n.desc}</div>
                             <div style={{ fontSize: 11, color: 'rgba(241,240,255,0.3)', marginTop: 6 }}>{formatRelativeTime(n.createdAt)}</div>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
