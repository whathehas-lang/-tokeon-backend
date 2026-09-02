export interface KakaoUserProfile {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
}

export class KakaoAuthService {
  private static isSdkLoaded = false;
  private static readonly SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
  private static readonly DEFAULT_APP_KEY = '5a706da3b0a7ff4b8d76d8b9d09c693a'; // 기본 카카오 JS Key

  public static getAppKey(): string {
    const custom = localStorage.getItem('tokeon_kakao_app_key');
    if (custom && custom.trim()) return custom.trim();
    return import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || this.DEFAULT_APP_KEY;
  }

  public static setCustomAppKey(key: string): void {
    if (key && key.trim()) {
      localStorage.setItem('tokeon_kakao_app_key', key.trim());
    } else {
      localStorage.removeItem('tokeon_kakao_app_key');
    }
  }

  public static async loadSdk(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if ((window as any).Kakao && (window as any).Kakao.isInitialized && (window as any).Kakao.isInitialized()) {
      this.isSdkLoaded = true;
      return true;
    }

    if ((window as any).Kakao) {
      try {
        const key = this.getAppKey();
        if (!(window as any).Kakao.isInitialized()) {
          (window as any).Kakao.init(key);
        }
        this.isSdkLoaded = true;
        return true;
      } catch (e) {
        console.warn('[KakaoAuthService] Init error:', e);
      }
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = this.SDK_URL;
      script.async = true;
      script.onload = () => {
        try {
          const key = this.getAppKey();
          if ((window as any).Kakao && !(window as any).Kakao.isInitialized()) {
            (window as any).Kakao.init(key);
          }
          this.isSdkLoaded = true;
          resolve(true);
        } catch (e) {
          console.error('[KakaoAuthService] Failed to initialize Kakao SDK:', e);
          resolve(false);
        }
      };
      script.onerror = () => {
        console.error('[KakaoAuthService] Failed to load Kakao SDK script');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  public static async login(): Promise<KakaoUserProfile> {
    const loaded = await this.loadSdk();
    const kakao = (window as any).Kakao;

    if (!loaded || !kakao || !kakao.Auth) {
      throw new Error('카카오 SDK를 로드할 수 없습니다. 인터넷 연결을 확인해 주세요.');
    }

    const key = this.getAppKey();
    if (!kakao.isInitialized()) {
      kakao.init(key);
    }

    return new Promise((resolve, reject) => {
      kakao.Auth.login({
        success: (_authObj: any) => {
          kakao.API.request({
            url: '/v2/user/me',
            success: (response: any) => {
              const account = response.kakao_account || {};
              const profile = account.profile || {};
              const id = String(response.id || Date.now());
              const nickname = profile.nickname || account.name || `카카오회원_${id.slice(-4)}`;
              const profileImage = profile.profile_image_url || profile.thumbnail_image_url;
              const email = account.email || `kakao_${id}@kakao.user`;

              resolve({
                id,
                nickname,
                profileImage,
                email
              });
            },
            fail: (err: any) => {
              console.error('[KakaoAuthService] Profile request failed:', err);
              reject(new Error('카카오 프로필 정보를 가져오는 데 실패했습니다: ' + (err.msg || JSON.stringify(err))));
            }
          });
        },
        fail: (err: any) => {
          console.error('[KakaoAuthService] Login failed:', err);
          const errorMsg = err.error_description || err.msg || '카카오 로그인이 취소되었거나 실패했습니다.';
          reject(new Error(errorMsg));
        }
      });
    });
  }

  public static logout(): Promise<void> {
    return new Promise((resolve) => {
      const kakao = (window as any).Kakao;
      if (kakao && kakao.Auth && kakao.Auth.getAccessToken()) {
        kakao.Auth.logout(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
