// ServiceNow がページに注入するグローバル。型チェック用の宣言のみ（実装はプラットフォーム側）。
interface Window {
    /** Table API 呼び出し時に X-UserToken ヘッダーへ入れる CSRF トークン */
    g_ck: string
    CustomEvent: typeof CustomEvent & {
        /** Polaris(Next Experience) の iframe 内から親フレームへイベントを送る */
        fireTop: (name: string, payload: unknown) => void
    }
}
