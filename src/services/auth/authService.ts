import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import type { MembershipTier } from '../../types/sports';
import { getFirebaseAuth } from '../firebase/firebaseService';
import { KakaoAuthService } from './kakaoAuthService';

export interface UserSessionData {
  uid: string;
  name: string;
  email: string;
  tier: MembershipTier;
  photoURL?: string;
  provider: 'google' | 'kakao' | 'email' | 'custom';
  createdAt: string;
}

export type AuthStateChangeCallback = (user: UserSessionData | null) => void;

export class AuthService {
  private currentUser: UserSessionData | null = null;
  private storageKey = 'sports_v2_user_session';
  private listeners: Set<AuthStateChangeCallback> = new Set();
  private isListeningFirebase = false;

  constructor() {
    this.loadSession();
    this.initFirebaseListener();
  }

  private loadSession() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.currentUser = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('[AuthService] Failed to load user session:', e);
    }
  }

  private getSavedTier(): MembershipTier {
    const saved = localStorage.getItem('tokeon_membership_tier');
    return (saved as MembershipTier) || 'VVIP';
  }

  private saveSession(user: UserSessionData | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      localStorage.setItem('tokeon_is_logged_in', 'true');
      localStorage.setItem('tokeon_membership_tier', user.tier);
    } else {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem('tokeon_is_logged_in');
    }
    this.notifyListeners();
  }

  private initFirebaseListener() {
    if (this.isListeningFirebase) return;
    const auth = getFirebaseAuth();
    if (!auth) return;

    this.isListeningFirebase = true;
    onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // 이미 카카오 등으로 로그인된 경우 덮어쓰지 않음
        if (this.currentUser && this.currentUser.provider === 'kakao') {
          return;
        }

        const sessionUser: UserSessionData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '구글 VVIP 회원',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          provider: 'google',
          tier: this.getSavedTier(),
          createdAt: new Date().toISOString()
        };
        this.saveSession(sessionUser);
      } else {
        if (this.currentUser && this.currentUser.provider !== 'kakao') {
          // Firebase 로그아웃 시 로컬 세션 동기화
        }
      }
    });
  }

  public getCurrentUser(): UserSessionData | null {
    return this.currentUser;
  }

  public onAuthChange(callback: AuthStateChangeCallback): () => void {
    this.listeners.add(callback);
    callback(this.currentUser);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.currentUser);
      } catch (err) {
        console.error('[AuthService] Listener callback error:', err);
      }
    });
  }

  /**
   * 🌐 실제 Google 계정 로그인 (Firebase Auth Popup)
   */
  public async loginWithGoogle(): Promise<UserSessionData> {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase 인증 서비스가 준비되지 않았습니다. 네트워크 연결을 확인해 주세요.');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const user: UserSessionData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '구글 VVIP 회원',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        provider: 'google',
        tier: this.getSavedTier(),
        createdAt: new Date().toISOString()
      };

      this.saveSession(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] Google login failed:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google 로그인 창이 닫혔습니다. 다시 시도해 주세요.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('인증되지 않은 도메인입니다. Firebase Console에서 도메인을 승인해 주세요.');
      }
      throw new Error(error.message || 'Google 로그인 중 오류가 발생했습니다.');
    }
  }

  /**
   * 🟡 실제 카카오(Kakao) 계정 로그인 (Kakao SDK)
   */
  public async loginWithKakao(): Promise<UserSessionData> {
    try {
      const kakaoProfile = await KakaoAuthService.login();

      const user: UserSessionData = {
        uid: `kakao_${kakaoProfile.id}`,
        name: kakaoProfile.nickname,
        email: kakaoProfile.email || '',
        photoURL: kakaoProfile.profileImage,
        provider: 'kakao',
        tier: this.getSavedTier(),
        createdAt: new Date().toISOString()
      };

      this.saveSession(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] Kakao login failed:', error);
      throw new Error(error.message || '카카오 로그인 중 오류가 발생했습니다.');
    }
  }

  /**
   * ✉️ 실제 이메일/비밀번호 로그인 (Firebase Auth)
   */
  public async loginWithEmail(email: string, password?: string): Promise<UserSessionData> {
    const auth = getFirebaseAuth();
    if (!auth || !password) {
      // Fallback
      const user: UserSessionData = {
        uid: `usr_${Date.now()}`,
        name: email.split('@')[0] || 'VVIP 팩트회원',
        email,
        provider: 'email',
        tier: this.getSavedTier(),
        createdAt: new Date().toISOString()
      };
      this.saveSession(user);
      return user;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      const user: UserSessionData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'VVIP 팩트회원',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        provider: 'email',
        tier: this.getSavedTier(),
        createdAt: new Date().toISOString()
      };

      this.saveSession(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] Email login failed:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('가입되지 않은 이메일입니다. 회원가입을 진행해 주세요.');
      }
      throw new Error(error.message || '이메일 로그인에 실패했습니다.');
    }
  }

  /**
   * 📝 실제 이메일/비밀번호 회원가입 (Firebase Auth)
   */
  public async signUpWithEmail(email: string, password: string, nickname: string): Promise<UserSessionData> {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error('Firebase 인증 서비스가 준비되지 않았습니다.');
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = res.user;

      if (nickname.trim()) {
        try {
          await updateProfile(firebaseUser, { displayName: nickname.trim() });
        } catch (e) {
          console.warn('[AuthService] updateProfile failed:', e);
        }
      }

      const user: UserSessionData = {
        uid: firebaseUser.uid,
        name: nickname.trim() || firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email || email,
        provider: 'email',
        tier: this.getSavedTier(),
        createdAt: new Date().toISOString()
      };

      this.saveSession(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] Email signup failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('이미 사용 중인 이메일 계정입니다. 로그인해 주세요.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('비밀번호가 너무 취약합니다. 6자리 이상 입력해 주세요.');
      }
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  }

  /**
   * 🚪 로그아웃 (Firebase & Kakao 동시 해제)
   */
  public async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('[AuthService] Firebase signOut error:', e);
      }
    }

    try {
      await KakaoAuthService.logout();
    } catch (e) {
      console.warn('[AuthService] Kakao logout error:', e);
    }

    this.saveSession(null);
  }
}

export const authService = new AuthService();
