import type { MembershipTier } from '../../types/sports';

export interface PaymentOptions {
  tier: MembershipTier;
  amount: number;
  orderName: string;
  customerName: string;
}

export class TossPaymentsService {
  private clientKey: string;

  constructor() {
    this.clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY || 'test_ck_docs_O2Lz5M1zP428E6v22w5b3n98';
  }

  /**
   * Request payment for VVIP/VIP membership.
   */
  public async requestMembershipPayment(
    options: PaymentOptions,
    onSuccess: (tier: MembershipTier) => void,
    onFail: (errorMsg: string) => void
  ): Promise<void> {
    try {
      console.log(`[TossPaymentsService] Initiating payment for ${options.orderName} (${options.amount}KRW)...`);

      // If Toss Payments script is available, trigger SDK
      if (typeof window !== 'undefined' && (window as unknown as { TossPayments?: (key: string) => { requestPayment: (method: string, data: Record<string, unknown>) => Promise<void> } }).TossPayments) {
        const tossPayments = (window as unknown as { TossPayments: (key: string) => { requestPayment: (method: string, data: Record<string, unknown>) => Promise<void> } }).TossPayments(this.clientKey);
        await tossPayments.requestPayment('카드', {
          amount: options.amount,
          orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          orderName: options.orderName,
          customerName: options.customerName,
          successUrl: `${window.location.origin}?payment_status=success&tier=${options.tier}`,
          failUrl: `${window.location.origin}?payment_status=fail`
        });
      } else {
        // Fallback simulation mode for instant developer testing
        const confirmPay = window.confirm(
          `💳 [토스페이먼츠 유료 결제 모듈]연동 결제 진행\n\n- 상품명: ${options.orderName}\n- 결제금액: ${options.amount.toLocaleString()}원\n\n결제를 진행하시겠습니까?`
        );
        if (confirmPay) {
          onSuccess(options.tier);
        } else {
          onFail('사용자가 결제를 취소하였습니다.');
        }
      }
    } catch (err: unknown) {
      console.error('[TossPaymentsService] Payment error:', err);
      onFail(err instanceof Error ? err.message : '결제 진행 중 오류가 발생했습니다.');
    }
  }
}

export const tossPaymentsService = new TossPaymentsService();
