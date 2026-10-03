import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import useAuthStore from '../store/authStore'
import AppLayout from '../layouts/AppLayout'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'
import {
  User, Mail, Phone, FileText, Calendar, Shield, Edit3, Camera, Sparkles, Loader2, X, AlertCircle
} from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập tên'),
  phone: z.string().optional(),
  bio: z.string().max(150, 'Giới thiệu tối đa 150 ký tự').optional(),
})

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

function InputField({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(241,240,255,0.7)' }}>{label}</label>
      <input className={`anime-input${error ? ' error' : ''}`} {...props} />
      {error && <span className="error-msg"><AlertCircle size={12} /> {error}</span>}
    </div>
  )
}

function TextareaField({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'rgba(241,240,255,0.7)' }}>{label}</label>
      <textarea className={`anime-input${error ? ' error' : ''}`} style={{ minHeight: 80, resize: 'vertical' }} {...props} />
      {error && <span className="error-msg"><AlertCircle size={12} /> {error}</span>}
    </div>
  )
}

export default function ProfilePage() {
  const { user, fetchMe, updateAvatar, updateProfileData } = useAuthStore()
  const [isUploading, setIsUploading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema)
  })

  useEffect(() => {
    if (!user) fetchMe().catch(() => {})
  }, [])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Quick validation
    if (!file.type.startsWith('image/')) {
      return toast.error('Vui lòng chọn file hình ảnh hợp lệ.')
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Kích thước ảnh tối đa là 5MB.')
    }

    setIsUploading(true)
    try {
      await updateAvatar(file)
      toast.success('Đã cập nhật ảnh đại diện! 📸')
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Cập nhật ảnh thất bại'))
    } finally {
      setIsUploading(false)
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const openEditModal = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    })
    setIsEditing(true)
  }

  const onSubmitEdit = async (data) => {
    try {
      await updateProfileData(data)
      toast.success('Hồ sơ đã được lưu thành công! ✨')
      setIsEditing(false)
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error, 'Lưu hồ sơ thất bại'))
    }
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || '?'

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <AppLayout>
      <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
        
        {/* Hidden file input for Avatar */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

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
                cursor: 'pointer',
                opacity: isUploading ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }} className="animate-pulse-glow" onClick={handleAvatarClick}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: user?.avatarUrl
                    ? 'transparent'
                    : 'linear-gradient(135deg, #4c1d95, #831843)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36, fontWeight: 800, color: '#f9a8d4',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {user?.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials
                  }
                  {isUploading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Loader2 size={24} style={{ color: '#fff', animation: 'spin 1s linear infinite' }} />
                    </div>
                  )}
                </div>
              </div>
              {/* Camera button */}
              <button onClick={handleAvatarClick} disabled={isUploading} style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                border: '2px solid #05010f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isUploading ? 'wait' : 'pointer',
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

            <button onClick={openEditModal} className="btn-secondary" style={{ width: 'auto', padding: '9px 20px', fontSize: 13 }}>
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

      {/* Edit Profile Modal Overlay */}
      {isEditing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-card animate-fade-in-up" style={{
            width: '100%', maxWidth: 440, padding: 32,
            background: 'rgba(10,5,32,0.95)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Chỉnh sửa hồ sơ</h2>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitEdit)} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InputField label="Họ" placeholder="Nguyễn" error={errors.firstName?.message} {...register('firstName')} />
                <InputField label="Tên" placeholder="Văn A" error={errors.lastName?.message} {...register('lastName')} />
              </div>
              <InputField label="Số điện thoại" placeholder="0987654321" error={errors.phone?.message} {...register('phone')} />
              <TextareaField label="Giới thiệu ngắn" placeholder="Vài nét về bạn..." error={errors.bio?.message} {...register('bio')} />
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  {isSubmitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} /> : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
