import React, { useCallback } from 'react'
import {
    Modal,
    type ModalFooterActionClicked,
    type ModalOpenedSet
} from '@servicenow/react-components/Modal'

export interface UnsavedChangesModalProps {
    /** true のときモーダルを表示する */
    opened: boolean
    /** 「破棄して戻る」が押されたとき */
    onDiscard: () => void
    /** 「キャンセル」・閉じるボタン・Esc キーのとき */
    onCancel: () => void
}

// 未保存の変更があるまま画面を離れようとしたときの確認ダイアログ。
// window.confirm は使わず、プラットフォームのテーマに合う Modal を使う。
export default function UnsavedChangesModal(props: UnsavedChangesModalProps): JSX.Element {
    const { onDiscard, onCancel } = props

    // 閉じるボタンや Esc で閉じられた場合はキャンセル扱い（＝画面に留まる）。
    const handleOpenedSet = useCallback<ModalOpenedSet>(() => {
        onCancel()
    }, [onCancel])

    // footerActions で押されたボタンは label で見分ける（専用の onClick は無い）。
    const handleFooterAction = useCallback<ModalFooterActionClicked>(
        (e) => {
            if (e.detail.payload.action.label === '破棄して戻る') {
                onDiscard()
            } else {
                onCancel()
            }
        },
        [onDiscard, onCancel]
    )

    return (
        <Modal
            opened={props.opened}
            size="sm"
            headerLabel="未保存の変更があります"
            content="保存していない変更は失われます。一覧へ戻りますか？"
            footerActions={[
                { label: 'キャンセル', variant: 'secondary' },
                { label: '破棄して戻る', variant: 'primary-negative' }
            ]}
            onOpenedSet={handleOpenedSet}
            onFooterActionClicked={handleFooterAction}
        />
    )
}
