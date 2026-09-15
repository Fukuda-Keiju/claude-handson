import React, { useCallback, useEffect, useState } from 'react'
import { useRecord, type ServiceNowEvent } from '@servicenow/react-components'
import { RecordProvider } from '@servicenow/react-components/RecordContext'
import { FormActionBar } from '@servicenow/react-components/FormActionBar'
import { FormColumnLayout } from '@servicenow/react-components/FormColumnLayout'
import { Alert } from '@servicenow/react-components/Alert'
import { Button } from '@servicenow/react-components/Button'
import type { FormSubmitCompletedPayload } from '@servicenow/react-components/FormDataConnected'
import UnsavedChangesModal from './UnsavedChangesModal.tsx'
import './TaskForm.css'

const TABLE = 'x_2221398_handson_task'

export interface TaskFormProps {
    /** 既存レコードの sys_id。新規作成は '-1'（null / undefined は不可） */
    sysId: string
    /** 保存成功後に呼ばれる。引数は保存されたレコードの sys_id */
    onSaved: (sysId: string) => void
    /** 「一覧へ戻る」が確定したときに呼ばれる */
    onBack: () => void
}

// RecordProvider の「内側」に置く本体。useRecord は Provider の内側でしか使えないため、
// 戻るボタンや未保存判定はこの子コンポーネントに書く。
function TaskFormBody(props: { onBack: () => void }): JSX.Element {
    const { form } = useRecord()
    const [confirming, setConfirming] = useState(false)
    // 未保存判定は自前の差分比較ではなく RecordProvider が持つ isDirty だけを使う。
    const isDirty = form.isDirty === true

    // ブラウザの再読み込み・タブを閉じる操作にもブラウザ標準の警告を出す。
    useEffect(() => {
        if (!isDirty) return
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [isDirty])

    const handleBackClicked = useCallback(() => {
        // 未保存なら確認モーダル、そうでなければそのまま一覧へ。
        if (isDirty) setConfirming(true)
        else props.onBack()
    }, [isDirty, props])

    const handleDiscard = useCallback(() => {
        setConfirming(false)
        props.onBack()
    }, [props])

    return (
        <div className="task-form">
            <div className="task-form__toolbar">
                <Button label="← 一覧へ戻る" variant="secondary" onClicked={handleBackClicked} />
            </div>
            {isDirty && (
                <div className="task-form__alert">
                    <Alert status="warning" content="未保存の変更があります" />
                </div>
            )}
            {/* 保存ボタンや入力欄の中身は RecordProvider から受け取るので props 不要。 */}
            <FormActionBar />
            <FormColumnLayout />
            <UnsavedChangesModal
                opened={confirming}
                onDiscard={handleDiscard}
                onCancel={() => setConfirming(false)}
            />
        </div>
    )
}

// RecordProvider がレコードの取得・保存・ACL（項目の読み取り専用など）を全部面倒見てくれる。
// 自分で Table API を呼ぶ必要はない。
export default function TaskForm(props: TaskFormProps): JSX.Element {
    const { onSaved } = props

    // 保存完了は FormActionBar ではなく RecordProvider の onFormSubmitCompleted で受け取る。
    const handleSubmitCompleted = useCallback(
        (e: ServiceNowEvent<FormSubmitCompletedPayload>) => {
            const payload = e.detail?.payload
            if (payload?.status === 'success') onSaved(payload.sysId)
        },
        [onSaved]
    )

    return (
        <RecordProvider
            table={TABLE}
            sysId={props.sysId}
            isReadOnly={false}
            onFormSubmitCompleted={handleSubmitCompleted}
        >
            <TaskFormBody onBack={props.onBack} />
        </RecordProvider>
    )
}
