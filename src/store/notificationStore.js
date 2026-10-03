import { create } from 'zustand'
import { collection, query, orderBy, onSnapshot, writeBatch, doc, updateDoc, limit } from 'firebase/firestore'
import { requireFirebase } from '../lib/firebase'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  unsubscribe: null,

  listenToNotifications: (uid) => {
    if (!uid) return
    const { db } = requireFirebase()
    
    // Stop any existing listener
    const currentUnsubscribe = get().unsubscribe
    if (currentUnsubscribe) currentUnsubscribe()

    const q = query(
      collection(db, 'users', uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(30)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = []
      let unread = 0
      snapshot.forEach(docSnap => {
        const data = docSnap.data()
        if (!data.read) unread++
        notifs.push({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date()
        })
      })
      set({ notifications: notifs, unreadCount: unread })
    }, (error) => {
      console.error("Error listening to notifications:", error)
    })

    set({ unsubscribe })
  },

  stopListening: () => {
    const { unsubscribe } = get()
    if (unsubscribe) {
      unsubscribe()
      set({ unsubscribe: null, notifications: [], unreadCount: 0 })
    }
  },

  markAsRead: async (uid, notifId) => {
    const { db } = requireFirebase()
    const ref = doc(db, 'users', uid, 'notifications', notifId)
    await updateDoc(ref, { read: true })
  },

  markAllAsRead: async (uid) => {
    const { db, auth } = requireFirebase()
    if (!uid) uid = auth.currentUser?.uid
    if (!uid) return

    const { notifications } = get()
    const unreadNotifs = notifications.filter(n => !n.read)
    if (unreadNotifs.length === 0) return

    const batch = writeBatch(db)
    unreadNotifs.forEach(n => {
      const ref = doc(db, 'users', uid, 'notifications', n.id)
      batch.update(ref, { read: true })
    })
    await batch.commit()
  }
}))

export default useNotificationStore
