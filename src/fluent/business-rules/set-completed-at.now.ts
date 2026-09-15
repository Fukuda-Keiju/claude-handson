// Created as part of the Fable/Opus orchestration hands-on.
import { BusinessRule } from '@servicenow/sdk/core'
import { setCompletedAt } from '../../server/business-rules/set-completed-at'

// before insert/update so completed_at is written as part of the same save
BusinessRule({
    $id: Now.ID['br-set-completed-at'],
    name: 'Set completed_at on Handson Task',
    table: 'x_2221398_handson_task',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: setCompletedAt,
})
