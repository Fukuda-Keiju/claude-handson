// React アプリの入口。index.html の <script src="./main.tsx"> から実行される。
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
// CSS は「先に読み込んだものが土台」になるので、変数を定義する tokens.css を先に import する。
// （CSS ファイル内の @import はビルドが対応していないため、TSX 側で読み込む）
import './tokens.css'
import './app.css'

const rootElement = document.getElementById('root')
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
