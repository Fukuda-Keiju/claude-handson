// このプロジェクト（x_2221398_atf09）は ATF のテスト定義だけを置く「講師用テストアプリ」です。
// サーバーサイドのスクリプト（Business Rule の中身など）は持たないため、このファイルは空です。
// ただし now.config.json の tsconfigPath が src/server/tsconfig.json を指しており、
// そこの include（./**/*.ts）が 1 件もヒットしないと TypeScript がエラーになるため、
// 「型チェックの対象となる空のモジュール」としてこのファイルだけを残しています。
export {}
