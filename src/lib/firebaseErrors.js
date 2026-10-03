const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Email này đã được sử dụng.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/too-many-requests': 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.',
  'auth/weak-password': 'Mật khẩu cần có ít nhất 6 ký tự.',
  'firestore/permission-denied': 'Firebase từ chối truy cập. Hãy kiểm tra Firestore Rules.',
  'username-already-in-use': 'Tên đăng nhập này đã được sử dụng.',
}

export function getFirebaseErrorMessage(error, fallback) {
  return AUTH_ERROR_MESSAGES[error?.code] || error?.message || fallback
}
