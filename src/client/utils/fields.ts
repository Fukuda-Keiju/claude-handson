// Table API を sysparm_display_value=all で呼ぶと、参照・選択肢フィールドは
// { display_value, value } のオブジェクトになる。React はオブジェクトを直接描画できないので
// 画面表示は display()、sys_id などの操作には value() を使って文字列に落とす。
type FieldValue = string | { display_value?: string; value?: string } | null | undefined

export const display = (field: FieldValue): string => {
    if (typeof field === 'string') return field
    return field?.display_value ?? ''
}

export const value = (field: FieldValue): string => {
    if (typeof field === 'string') return field
    return field?.value ?? ''
}
