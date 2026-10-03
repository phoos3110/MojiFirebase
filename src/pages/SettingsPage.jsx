import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import AppLayout from '../layouts/AppLayout'
import useAuthStore from '../store/authStore'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'
import { Bell, Shield, Moon, Globe, Trash2, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
})

function InputField({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(241,240,255,0.7)' }}>{label}</label>
      <input className={`anime-input${error ? ' error' : ''}`} {...props} />
      {error && <span className="error-msg"><AlertCircle size={12} /> {error}</span>}
    </div>
  )
}

function SettingRow({ icon: Icon, label, desc, action, onClick, color = '#a78bfa' }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px',
        margin: '4px -16px',
        borderRadius: 12,
        cursor: onClick || action ? 'pointer' : 'default',
      }}
      className={onClick || action ? "glass-card-hover" : ""}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: color + '1a', border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: '#f1f0ff', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.4)' }}>{desc}</div>}
      </div>
      {action || <ChevronRight size={16} style={{ color: 'rgba(241,240,255,0.2)' }} />}
    </div>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked
          ? 'linear-gradient(135deg, #7c3aed, #db2777)'
          : 'rgba(255,255,255,0.1)',
        cursor: 'pointer', position: 'relative',
        transition: 'background 0.3s ease',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        position: 'absolute', top: 2,
        left: checked ? 22 : 2,
        transition: 'left 0.3s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

export default function SettingsPage() {
  const { changePassword } = useAuthStore()
  
  // Toggle states
  const [pushNotif, setPushNotif] = useState(true)
  const [emailNotif, setEmailNotif] = useState(false)
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)

  // Load from local storage
  useEffect(() => {
    const savedPush = localStorage.getItem('moji_push_notif')
    const savedEmail = localStorage.getItem('moji_email_notif')
    if (savedPush !== null) setPushNotif(savedPush === 'true')
    if (savedEmail !== null) setEmailNotif(savedEmail === 'true')
  }, [])

  // Handlers for toggles
  const handlePushToggle = (val) => {
    setPushNotif(val)
    localStorage.setItem('moji_push_notif', val)
    if (val) toast.success('Đã bật thông báo đẩy')
  }

  const handleEmailToggle = (val) => {
    setEmailNotif(val)
    localStorage.setItem('moji_email_notif', val)
    if (val) toast.success('Đã bật email thông báo')
  }

  // Password Form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const onSubmitPassword = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword)
      toast.success('Đổi mật khẩu thành công! 🔐')
      setPasswordModalOpen(false)
      reset()
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        toast.error('Mật khẩu cũ không chính xác.')
      } else {
        toast.error(getFirebaseErrorMessage(error, 'Đổi mật khẩu thất bại'))
      }
    }
  }

  const openPasswordModal = () => {
    reset()
    setPasswordModalOpen(true)
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>

        <div className="animate-fade-in-up" style={{ opacity: 0 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#f1f0ff', letterSpacing: '-0.5px', marginBottom: 4 }}>
            Cài đặt
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.4)' }}>
            Tùy chỉnh trải nghiệm Moji của bạn
          </p>
        </div>

        {/* Notifications */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '100ms' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(241,240,255,0.4)', letterSpacing: '1.5px', marginBottom: 4 }}>
            THÔNG BÁO
          </h3>
          <SettingRow
            icon={Bell} label="Thông báo đẩy"
            desc="Nhận thông báo khi có anime mới"
            color="#f472b6"
            action={<Toggle checked={pushNotif} onChange={handlePushToggle} />}
          />
          <SettingRow
            icon={Bell} label="Email thông báo"
            desc="Nhận email tổng hợp hàng tuần"
            color="#f472b6"
            action={<Toggle checked={emailNotif} onChange={handleEmailToggle} />}
          />
        </div>

        {/* Appearance */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '150ms' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(241,240,255,0.4)', letterSpacing: '1.5px', marginBottom: 4 }}>
            GIAO DIỆN
          </h3>
          <SettingRow
            icon={Moon} label="Chế độ tối"
            desc="Luôn bật (khuyến nghị cho anime lovers)"
            color="#a78bfa"
            action={<Toggle checked={true} onChange={() => toast('Dark mode là chân ái, không được tắt! 🌙')} />}
          />
          <SettingRow
            icon={Globe} label="Ngôn ngữ"
            desc="Tiếng Việt"
            color="#60a5fa"
          />
        </div>

        {/* Privacy & Security */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '24px', opacity: 0, animationDelay: '200ms' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(241,240,255,0.4)', letterSpacing: '1.5px', marginBottom: 4 }}>
            BẢO MẬT
          </h3>
          <SettingRow
            onClick={openPasswordModal}
            icon={Shield} label="Đổi mật khẩu"
            desc="Cập nhật mật khẩu của bạn"
            color="#34d399"
          />
          <SettingRow
            icon={Shield} label="Phiên đăng nhập"
            desc="Quản lý các thiết bị đang đăng nhập"
            color="#34d399"
            onClick={() => toast('Tính năng này sẽ sớm ra mắt! 🚀')}
          />
        </div>

        {/* Danger zone */}
        <div className="glass-card animate-fade-in-up" style={{
          padding: '24px',
          opacity: 0, animationDelay: '250ms',
          border: '1px solid rgba(244, 114, 182, 0.15)',
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(244, 114, 182, 0.6)', letterSpacing: '1.5px', marginBottom: 4 }}>
            VÙNG NGUY HIỂM
          </h3>
          <SettingRow
            icon={Trash2} label="Xóa tài khoản"
            desc="Hành động này không thể hoàn tác"
            color="#f472b6"
            onClick={() => toast('Vui lòng liên hệ Admin để xóa tài khoản.')}
          />
        </div>

      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-card animate-fade-in-up" style={{
            width: '100%', maxWidth: 400, padding: 32,
            background: 'rgba(10,5,32,0.95)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Đổi mật khẩu</h2>
              <button onClick={() => setPasswordModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitPassword)} style={{ display: 'flex', flexDirection: 'column' }}>
              <InputField 
                label="Mật khẩu hiện tại" 
                type="password" 
                placeholder="••••••••" 
                error={errors.currentPassword?.message} 
                {...register('currentPassword')} 
              />
              <InputField 
                label="Mật khẩu mới" 
                type="password" 
                placeholder="••••••••" 
                error={errors.newPassword?.message} 
                {...register('newPassword')} 
              />
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  {isSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
