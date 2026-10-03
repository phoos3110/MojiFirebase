import AppLayout from '../layouts/AppLayout'
import { Bell, Shield, Moon, Globe, Trash2, ChevronRight } from 'lucide-react'

function SettingRow({ icon: Icon, label, desc, action, color = '#a78bfa' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      cursor: 'pointer',
    }}
      className="glass-card-hover"
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

function Toggle({ defaultChecked = false }) {
  return (
    <div style={{
      width: 44, height: 24, borderRadius: 12,
      background: defaultChecked
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
        left: defaultChecked ? 22 : 2,
        transition: 'left 0.3s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <AppLayout>
      <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 24 }}>

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
            action={<Toggle defaultChecked />}
          />
          <SettingRow
            icon={Bell} label="Email thông báo"
            desc="Nhận email tổng hợp hàng tuần"
            color="#f472b6"
            action={<Toggle />}
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
            action={<Toggle defaultChecked />}
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
            icon={Shield} label="Đổi mật khẩu"
            desc="Cập nhật mật khẩu của bạn"
            color="#34d399"
          />
          <SettingRow
            icon={Shield} label="Phiên đăng nhập"
            desc="Quản lý các thiết bị đang đăng nhập"
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
            icon={Trash2} label="Xóa tài khoản"
            desc="Hành động này không thể hoàn tác"
            color="#f472b6"
          />
        </div>

      </div>
    </AppLayout>
  )
}
