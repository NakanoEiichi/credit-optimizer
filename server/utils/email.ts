/**
 * メール送信ユーティリティ
 */

// 本番環境では実際のメール送信サービス（SendGridなど）を使用
// 開発環境では、コンソールにメール内容を表示
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    console.log(`
      ===============================================
      TO: ${email}
      SUBJECT: [Kudos] 認証コード
      
      以下の認証コードを入力してください：
      ${code}
      
      このコードは15分間有効です。
      Kudosをご利用いただきありがとうございます。
      ===============================================
    `);
    
    // 本番環境ではSendGridなどを使用してメール送信
    // if (process.env.NODE_ENV === 'production') {
    //   await sendEmailWithSendGrid(email, code);
    // }
    
    return true;
  } catch (error) {
    console.error('メール送信エラー:', error);
    return false;
  }
}

// 認証コード生成
export function generateVerificationCode(): string {
  // ランダムな6桁の数字を生成
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// メール検証コードの保存用のインメモリストア（実際の実装ではデータベースを使う）
interface VerificationData {
  code: string;
  expires: Date;
}

const verificationCodes = new Map<string, VerificationData>();

// 検証コードを保存
export function storeVerificationCode(email: string, code: string): void {
  // 15分後に期限切れになるよう設定
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15);
  
  verificationCodes.set(email, { code, expires });
}

// 検証コードの検証
export function verifyCode(email: string, code: string): boolean {
  const data = verificationCodes.get(email);
  
  if (!data) {
    return false;
  }
  
  if (new Date() > data.expires) {
    // 期限切れ
    verificationCodes.delete(email);
    return false;
  }
  
  if (data.code !== code) {
    return false;
  }
  
  // 検証成功したらMap上のデータを削除
  verificationCodes.delete(email);
  return true;
}