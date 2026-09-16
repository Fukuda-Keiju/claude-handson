// Todo Item の state に応じて completed_at を自動で埋める Business Rule。
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { setCompletedAt } from '../../server/business-rules/set-completed-at'

// when: 'before' + action: insert/update なので、レコードが保存される直前に走る。
// order は小さいほど先に実行される。ここでは 100（title の検証 order 50 の後）。
BusinessRule({
    $id: Now.ID['br-set-completed-at'],
    name: 'Set completed_at on Todo Item',
    table: 'x_2221398_todo_item',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: setCompletedAt,
})
