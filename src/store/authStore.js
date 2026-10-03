import { create } from 'zustand'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firebaseConfigured, requireFirebase } from '../lib/firebase'

function toUser(firebaseUser, profile = {}) {
  const username = profile.username || firebaseUser.displayName || ''

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || profile.email || '',
    username,
    displayName: profile.displayName || firebaseUser.displayName || username,
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || firebaseUser.photoURL || '',
    createdAt: profile.createdAt?.toDate?.().toISOString()
      || firebaseUser.metadata.creationTime
      || null,
  }
}

async function loadUserProfile(firebaseUser, db) {
  const profileSnapshot = await getDoc(doc(db, 'users', firebaseUser.uid))

  if (!profileSnapshot.exists()) {
    throw new Error('Không tìm thấy hồ sơ Firestore của tài khoản này.')
  }

  return toUser(firebaseUser, profileSnapshot.data())
}

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  profileError: null,

  signUp: async ({ username, password, email, firstName, lastName }) => {
    const { auth, db } = requireFirebase()
    set({ isLoading: true })

    let credential
    try {
      credential = await createUserWithEmailAndPassword(auth, email, password)
      const displayName = `${firstName} ${lastName}`.trim()
      const usernameKey = username.toLowerCase()
      const usernameRef = doc(db, 'usernames', usernameKey)
      const userRef = doc(db, 'users', credential.user.uid)
      const profile = {
        uid: credential.user.uid,
        username,
        email,
        firstName,
        lastName,
        displayName,
        phone: '',
        bio: '',
        avatarUrl: '',
        createdAt: serverTimestamp(),
      }

      try {
        await updateProfile(credential.user, { displayName })
        await runTransaction(db, async (transaction) => {
          const usernameSnapshot = await transaction.get(usernameRef)
          if (usernameSnapshot.exists()) {
            const error = new Error('Tên đăng nhập này đã được sử dụng.')
            error.code = 'username-already-in-use'
            throw error
          }

          transaction.set(usernameRef, { uid: credential.user.uid })
          transaction.set(userRef, profile)
        })
      } catch (error) {
        try {
          await deleteUser(credential.user)
        } catch (cleanupError) {
          console.error('Không thể xóa tài khoản Firebase sau khi tạo hồ sơ thất bại:', cleanupError)
          throw new Error(`${error.message} Tài khoản Firebase chưa được xóa thành công.`)
        }
        throw error
      }

      set({
        user: toUser(credential.user, { ...profile, createdAt: new Date() }),
        isAuthenticated: true,
        isLoading: false,
        profileError: null,
      })
      return credential
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signIn: async ({ email, password }) => {
    const { auth, db } = requireFirebase()
    set({ isLoading: true })

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const user = await loadUserProfile(credential.user, db)
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        profileError: null,
      })
      return credential
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  fetchMe: async () => {
    const { auth, db } = requireFirebase()
    if (!auth.currentUser) {
      throw new Error('Bạn chưa đăng nhập.')
    }

    const user = await loadUserProfile(auth.currentUser, db)
    set({ user, isAuthenticated: true, profileError: null })
    return user
  },

  signOut: async () => {
    const { auth } = requireFirebase()
    await firebaseSignOut(auth)
    set({ user: null, isAuthenticated: false, profileError: null })
  },
  
  updateProfileData: async (data) => {
    const { auth, db } = requireFirebase()
    if (!auth.currentUser) throw new Error('Bạn chưa đăng nhập')

    const userRef = doc(db, 'users', auth.currentUser.uid)
    const displayName = `${data.firstName} ${data.lastName}`.trim()
    
    // Update Auth Profile if displayName changes
    if (displayName !== get().user?.displayName) {
      await updateProfile(auth.currentUser, { displayName })
    }

    const updates = {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName,
      phone: data.phone || '',
      bio: data.bio || '',
    }

    await updateDoc(userRef, updates)
    
    set(state => ({
      user: { ...state.user, ...updates }
    }))
  },

  updateAvatar: async (file) => {
    const { auth, db, storage } = requireFirebase()
    if (!auth.currentUser) throw new Error('Bạn chưa đăng nhập')

    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}_${Date.now()}`)
    await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(storageRef)

    await updateProfile(auth.currentUser, { photoURL: downloadURL })

    const userRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userRef, { avatarUrl: downloadURL })

    set(state => ({
      user: { ...state.user, avatarUrl: downloadURL }
    }))
  },

  initialize: () => {
    if (!firebaseConfigured) {
      set({ isInitialized: true })
      return () => {}
    }

    const { auth, db } = requireFirebase()
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          profileError: null,
        })
        return
      }

      try {
        const user = await loadUserProfile(firebaseUser, db)
        if (auth.currentUser?.uid !== firebaseUser.uid) return
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
          profileError: null,
        })
      } catch (error) {
        if (auth.currentUser?.uid !== firebaseUser.uid) return
        if (get().user?.uid === firebaseUser.uid && get().user?.username) return
        set({
          user: toUser(firebaseUser),
          isAuthenticated: true,
          isInitialized: true,
          profileError: error,
        })
      }
    }, (error) => {
      set({ isInitialized: true, profileError: error })
    })
  },
}))

export default useAuthStore
