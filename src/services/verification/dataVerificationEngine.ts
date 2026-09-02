import { CommonSportsVerificationEngine } from './commonSportsVerificationEngine';

export class DataVerificationEngine extends CommonSportsVerificationEngine {
  public static verifyAndSanitizeSingleMatch(raw: any) {
    return CommonSportsVerificationEngine.verifySingleMatch(raw);
  }
}
