import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import AppLayout from '../layouts/AppLayout'
import useAuthStore from '../store/authStore'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'
import { Bell, Shield, Moon, Globe, Trash2, ChevronRight, X, Loader2, AlertCircle, Info } from 'lucide-react'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
})

const deleteSchema = z.object({
  password: z.string().min(1, 'Vui lòng nhập mật khẩu để xác nhận'),
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

function SettingRow({ icon: Icon, label, desc, action, onClick, color = '#a78bfa', danger = false }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 16px',
        margin: '4px -16px',
        borderRadius: 12,
        cursor: onClick || action ? 'pointer' : 'default',
        color: danger ? '#f87171' : 'inherit',
      }}
      className={onClick || action ? (danger ? "glass-card-hover-danger" : "glass-card-hover") : ""}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: color + '1a', border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: danger ? '#f87171' : '#f1f0ff', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: danger ? 'rgba(248,113,113,0.6)' : 'rgba(241,240,255,0.4)' }}>{desc}</div>}
      </div>
      {action || <ChevronRight size={16} style={{ color: danger ? 'rgba(248,113,113,0.4)' : 'rgba(241,240,255,0.2)' }} />}
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
  const { user, changePassword, updateSettings, deleteUserAccount } = useAuthStore()
  
  // Modals
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false)
  const [isSessionModalOpen, setSessionModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)

  // Handlers for toggles
  const handlePushToggle = async (val) => {
    try {
      await updateSettings({ pushNotif: val })
      toast.success(val ? 'Đã bật thông báo đẩy' : 'Đã tắt thông báo đẩy')
    } catch (e) {
      toast.error('Lỗi khi lưu cài đặt')
    }
  }

  const handleEmailToggle = async (val) => {
    try {
      await updateSettings({ emailNotif: val })
      toast.success(val ? 'Đã bật email thông báo' : 'Đã tắt email thông báo')
    } catch (e) {
      toast.error('Lỗi khi lưu cài đặt')
    }
  }

  // Password Form
  const { register: registerPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { errors: passErrors, isSubmitting: isPassSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  // Delete Form
  const { register: registerDelete, handleSubmit: handleDeleteSubmit, reset: resetDelete, formState: { errors: deleteErrors, isSubmitting: isDeleteSubmitting } } = useForm({
    resolver: zodResolver(deleteSchema)
  })

  const onSubmitPassword = async (data) => {
    try {
      await changePassword(data.currentPassword, data.newPassword)
      toast.success('Đổi mật khẩu thành công! 🔐')
      setPasswordModalOpen(false)
      resetPass()
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        toast.error('Mật khẩu cũ không chính xác.')
      } else {
        toast.error(getFirebaseErrorMessage(error, 'Đổi mật khẩu thất bại'))
      }
    }
  }

  const onSubmitDelete = async (data) => {
    try {
      await deleteUserAccount(data.password)
      toast.success('Đã xóa tài khoản vĩnh viễn.')
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        toast.error('Mật khẩu không chính xác.')
      } else {
        toast.error(getFirebaseErrorMessage(error, 'Xóa tài khoản thất bại'))
      }
    }
  }

  const openPasswordModal = () => { resetPass(); setPasswordModalOpen(true) }
  const openDeleteModal = () => { resetDelete(); setDeleteModalOpen(true) }

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
            THÔNG BÁO (ĐỒNG BỘ CLOUD)
          </h3>
          <SettingRow
            icon={Bell} label="Thông báo đẩy"
            desc="Nhận thông báo khi có anime mới"
            color="#f472b6"
            action={<Toggle checked={user?.settings?.pushNotif ?? true} onChange={handlePushToggle} />}
          />
          <SettingRow
            icon={Bell} label="Email thông báo"
            desc="Nhận email tổng hợp hàng tuần"
            color="#f472b6"
            action={<Toggle checked={user?.settings?.emailNotif ?? false} onChange={handleEmailToggle} />}
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
            onClick={() => setSessionModalOpen(true)}
            icon={Info} label="Thông tin phiên đăng nhập"
            desc="Xem chi tiết phiên hoạt động hiện tại"
            color="#34d399"
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
            onClick={openDeleteModal}
            icon={Trash2} label="Xóa tài khoản"
            desc="Hành động này không thể hoàn tác, mọi dữ liệu sẽ bị xóa sạch."
            color="#f472b6"
            danger={true}
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

            <form onSubmit={handlePassSubmit(onSubmitPassword)} style={{ display: 'flex', flexDirection: 'column' }}>
              <InputField 
                label="Mật khẩu hiện tại" 
                type="password" 
                placeholder="••••••••" 
                error={passErrors.currentPassword?.message} 
                {...registerPass('currentPassword')} 
              />
              <InputField 
                label="Mật khẩu mới" 
                type="password" 
                placeholder="••••••••" 
                error={passErrors.newPassword?.message} 
                {...registerPass('newPassword')} 
              />
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setPasswordModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isPassSubmitting} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  {isPassSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Info Modal */}
      {isSessionModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-card animate-fade-in-up" style={{
            width: '100%', maxWidth: 400, padding: 32,
            background: 'rgba(10,5,32,0.95)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(52,211,153,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Thông tin phiên</h2>
              <button onClick={() => setSessionModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'rgba(241,240,255,0.8)' }}>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.4)', marginBottom: 4 }}>Tài khoản đang đăng nhập:</div>
                <div style={{ fontWeight: 600 }}>{user?.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.4)', marginBottom: 4 }}>Đăng nhập lần cuối lúc:</div>
                <div style={{ fontWeight: 600 }}>{user?.lastSignInTime ? new Date(user.lastSignInTime).toLocaleString('vi-VN') : 'Không rõ'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(241,240,255,0.4)', marginBottom: 4 }}>Ngày tạo tài khoản:</div>
                <div style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'Không rõ'}</div>
              </div>
            </div>

            <button onClick={() => setSessionModalOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: 24, padding: '10px' }}>
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-card animate-fade-in-up" style={{
            width: '100%', maxWidth: 400, padding: 32,
            background: 'rgba(30,10,20,0.95)',
            border: '1px solid rgba(244,114,182,0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 60px rgba(225,29,72,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f87171' }}>Xóa tài khoản vĩnh viễn</h2>
              <button onClick={() => setDeleteModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 14, color: 'rgba(241,240,255,0.7)', lineHeight: 1.5, marginBottom: 20 }}>
              Hành động này <strong style={{ color: '#f87171' }}>KHÔNG THỂ HOÀN TÁC</strong>. Toàn bộ dữ liệu hồ sơ, ảnh đại diện, và tên đăng nhập của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống Moji.
            </p>

            <form onSubmit={handleDeleteSubmit(onSubmitDelete)} style={{ display: 'flex', flexDirection: 'column' }}>
              <InputField 
                label="Nhập mật khẩu để xác nhận" 
                type="password" 
                placeholder="••••••••" 
                error={deleteErrors.password?.message} 
                {...registerDelete('password')} 
              />
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setDeleteModalOpen(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isDeleteSubmitting} style={{ 
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: '#e11d48', color: '#fff', border: 'none',
                  fontWeight: 600, cursor: 'pointer'
                }}>
                  {isDeleteSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : 'Xóa vĩnh viễn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppLayout>
  )
}
