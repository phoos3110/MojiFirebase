import { useState, forwardRef } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Sparkles, User, Lock, Mail, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '../store/authStore'
import SakuraBackground from '../components/SakuraBackground'
import { firebaseConfigured } from '../lib/firebase'
import { getFirebaseErrorMessage } from '../lib/firebaseErrors'

// ─── Zod schemas ─────────────────────────────────────────────────────────────
const signInSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  username: z.string()
    .min(3, 'Tên đăng nhập ít nhất 3 ký tự')
    .max(20, 'Tối đa 20 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, 'Chỉ dùng chữ cái, số và _'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
})

// ─── InputField (forwardRef để RHF register() ref attach đúng vào <input>) ──
const InputField = forwardRef(function InputField(
  { label, icon: Icon, error, type = 'text', rightElement, ...props },
  ref
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(241,240,255,0.7)',
          letterSpacing: '0.3px',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={16}
            style={{
              position: 'absolute',
              left: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: error ? '#f9a8d4' : 'rgba(241,240,255,0.3)',
              zIndex: 1,
            }}
          />
        )}
        <input
          ref={ref}
          type={type}
          className={`anime-input${error ? ' error' : ''}`}
          style={{
            paddingLeft: Icon ? 42 : 16,
            paddingRight: rightElement ? 44 : 16,
          }}
          {...props}
        />
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1,
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="error-msg">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  )
})

// ─── Sign In Form ─────────────────────────────────────────────────────────────
function SignInForm({ onSuccess }) {
  const { signIn } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await signIn(data)
      toast.success('Chào mừng trở lại! 🌸')
      onSuccess()
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err, 'Đăng nhập thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <InputField
        label="Email"
        icon={Mail}
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <InputField
        label="Mật khẩu"
        icon={Lock}
        type={showPw ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(241,240,255,0.4)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register('password')}
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ marginTop: 4 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Đang đăng nhập...
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={16} />
            Đăng nhập
          </span>
        )}
      </button>
    </form>
  )
}

// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({ onSuccess }) {
  const { signUp } = useAuthStore()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await signUp(data)
      toast.success('Tài khoản đã được tạo! Chào mừng bạn 🎉')
      onSuccess()
    } catch (err) {
      toast.error(getFirebaseErrorMessage(err, 'Đăng ký thất bại'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InputField
          label="Họ"
          placeholder="Nguyễn"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <InputField
          label="Tên"
          placeholder="Văn A"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <InputField
        label="Email"
        icon={Mail}
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <InputField
        label="Tên đăng nhập"
        icon={User}
        placeholder="your_username"
        error={errors.username?.message}
        {...register('username')}
      />

      <InputField
        label="Mật khẩu"
        icon={Lock}
        type={showPw ? 'text' : 'password'}
        placeholder="••••••••"
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(241,240,255,0.4)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
        {...register('password')}
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
        style={{ marginTop: 4 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Đang tạo tài khoản...
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Sparkles size={16} />
            Tạo tài khoản
          </span>
        )}
      </button>
    </form>
  )
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [tab, setTab] = useState('signin')
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '24px 16px',
        overflow: 'hidden',
      }}
    >
      <SakuraBackground />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Grid overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(219,39,119,0.08) 0%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      />

      {/* Auth card */}
      <div
        className="glass-card animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 36px',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 0 60px rgba(124,58,237,0.15), 0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            className="animate-float"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              fontSize: 36,
              marginBottom: 16,
              boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
            }}
          >
            ⛩️
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              marginBottom: 6,
            }}
          >
            <span className="gradient-text">Moji</span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'rgba(241,240,255,0.5)',
              letterSpacing: '2px',
              fontFamily: 'var(--font-jp)',
            }}
          >
            もじ — Thế giới Anime của bạn
          </p>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { id: 'signin', label: 'Đăng nhập' },
            { id: 'signup', label: 'Đăng ký' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                background:
                  tab === t.id
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(219,39,119,0.25))'
                    : 'transparent',
                color: tab === t.id ? '#f1f0ff' : 'rgba(241,240,255,0.4)',
                boxShadow: tab === t.id ? '0 2px 12px rgba(124,58,237,0.2)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!firebaseConfigured && (
          <div
            role="alert"
            style={{
              marginBottom: 20,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid rgba(251,191,36,0.3)',
              background: 'rgba(251,191,36,0.08)',
              color: '#fde68a',
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Firebase chưa được cấu hình. Tạo file <code>.env</code> theo hướng dẫn trong README.md trước khi đăng nhập.
          </div>
        )}

        {/* Forms */}
        <div key={tab} className="animate-fade-in-up">
          {tab === 'signin' ? (
            <SignInForm onSuccess={handleSuccess} />
          ) : (
            <SignUpForm onSuccess={handleSuccess} />
          )}
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'rgba(241,240,255,0.25)',
            marginTop: 28,
            letterSpacing: '0.5px',
          }}
        >
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <span style={{ color: 'rgba(167,139,250,0.6)', cursor: 'pointer' }}>
            Điều khoản dịch vụ
          </span>
        </p>
      </div>
    </div>
  )
}
