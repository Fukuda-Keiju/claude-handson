// 画面いちばん上の固定ヘッダー。アプリ名・サブタイトルと、右側にグローバル操作（再読み込み / 新規）を置く。
// ここに置く Heading（level=1）が、このアプリで唯一の「Handson Task ボード」見出し。
// ATF が findByRole('heading', { name: 'Handson Task ボード', exact: true }) で 1 件だけ見つける前提なので、
// 他の場所でこの文字列を見出しとして描かないこと。
import React, { useCallback } from 'react'
import { Heading } from '@servicenow/react-components/Heading'
import { Button, type ButtonClicked } from '@servicenow/react-components/Button'
import { ButtonIconic, type ButtonIconicClicked } from '@servicenow/react-components/ButtonIconic'
import './AppHeader.css'

export interface AppHeaderProps {
    /** アプリ名。h1 として描かれる */
    title: string
    /** タイトル下の小さな説明文 */
    subtitle: string
    /** 「＋ 新規タスク」が押されたとき */
    onNewTask: () => void
    /** 再読み込みアイコンが押されたとき */
    onRefresh: () => void
    /** 読み込み中は再読み込みボタンを無効化して二重取得を防ぐ */
    refreshing: boolean
}

export default function AppHeader(props: AppHeaderProps): JSX.Element {
    const { onNewTask, onRefresh } = props

    // now-* のイベントは ServiceNowEvent が渡ってくるので、引数を捨てて親の関数を呼ぶだけにする。
    const handleRefresh = useCallback<ButtonIconicClicked>(() => {
        onRefresh()
    }, [onRefresh])

    const handleNew = useCallback<ButtonClicked>(() => {
        onNewTask()
    }, [onNewTask])

    return (
        <header className="app-header">
            <div className="app-header__inner">
                <div className="app-header__identity">
                    {/* アプリアイコン風の飾り。装飾なので aria-hidden にしてスクリーンリーダーからは隠す */}
                    <div className="app-header__mark" aria-hidden="true" />
                    <div className="app-header__titles">
                        <Heading label={props.title} level={1} variant="header-primary" hasNoMargin />
                        <p className="app-header__subtitle">{props.subtitle}</p>
                    </div>
                </div>
                <div className="app-header__actions">
                    {/* 時計回り矢印が「再読み込み」アイコン（refresh という名前のアイコンは無い） */}
                    <ButtonIconic
                        icon="arrow-clockwise-outline"
                        variant="tertiary"
                        bare
                        tooltipContent="再読み込み"
                        configAria={{ 'aria-label': '再読み込み' }}
                        disabled={props.refreshing}
                        onClicked={handleRefresh}
                    />
                    {/* ラベルは「New」にしない。一覧(NowRecordListConnected)の New ボタンと
                        ATF の findByRole('button', { name: 'New', exact: true }) が衝突するため。 */}
                    <Button label="＋ 新規タスク" variant="primary" onClicked={handleNew} />
                </div>
            </div>
        </header>
    )
}
