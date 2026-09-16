// タイトルが空のまま保存されるのを防ぐ Business Rule。
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validateTitle } from '../../server/business-rules/validate-title'

// order: 50 にして、completed_at を埋める Business Rule（order: 100）より
// 先に走らせる。不正なデータは早い段階で弾くのが定石。
BusinessRule({
    $id: Now.ID['br-validate-title'],
    name: 'Validate Todo title',
    table: 'x_2221398_todo_item',
    when: 'before',
    action: ['insert', 'update'],
    order: 50,
    active: true,
    script: validateTitle,
})
