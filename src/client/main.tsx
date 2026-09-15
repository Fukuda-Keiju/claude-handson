// React アプリの起動点。index.html の <div id="root"> に App をマウントする。
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

const container = document.getElementById('root')

if (container) {
    ReactDOM.createRoot(container).render(<App />)
}
