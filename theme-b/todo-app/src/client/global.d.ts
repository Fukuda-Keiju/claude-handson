// 型チェック用のグローバル宣言。ここに書いたものは import 無しで使える。

// handles importing scss as modules
declare module '*.scss' {
    const content: string
    export default content
}

// CSS も TSX から import する（バンドラーが読み込んでページに差し込む）。
// TypeScript は .css の中身を知らないので、ここで「文字列を default export するモジュール」と教える。
declare module '*.css' {
    const content: string
    export default content
}

// ServiceNow が UI Page に注入するグローバル変数。実体はプラットフォーム側にあるので宣言だけ書く。
interface Window {
    /** Table API を呼ぶときに X-UserToken ヘッダーへ入れる CSRF トークン */
    g_ck: string
}
