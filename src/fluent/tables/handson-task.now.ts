// Created as part of the Fable/Opus orchestration hands-on.
import { Table, StringColumn, ChoiceColumn, DateColumn, DateTimeColumn, MultiLineTextColumn, Record } from '@servicenow/sdk/core'

export const x_2221398_handson_task = Table({
    name: 'x_2221398_handson_task',
    label: 'Handson Task',
    display: 'title',
    audit: true,
    schema: {
        title: StringColumn({
            label: 'Title',
            maxLength: 100,
            mandatory: true,
        }),
        state: ChoiceColumn({
            label: 'State',
            choices: {
                open: 'Open',
                in_progress: 'In Progress',
                done: 'Done',
            },
            default: 'open',
        }),
        due_date: DateColumn({ label: 'Due date' }),
        // set by a business rule, so it is not editable on the form
        completed_at: DateTimeColumn({ label: 'Completed at', readOnly: true }),
        notes: MultiLineTextColumn({ label: 'Notes' }),
    },
})

Record({
    $id: Now.ID['handson-task-demo-1'],
    $meta: { installMethod: 'demo' },
    table: 'x_2221398_handson_task',
    data: {
        title: 'Fluent SDK で Table を定義する',
        state: 'done',
        due_date: '2026-09-10',
    },
})

Record({
    $id: Now.ID['handson-task-demo-2'],
    $meta: { installMethod: 'demo' },
    table: 'x_2221398_handson_task',
    data: {
        title: 'Business Rule を Opus に実装させる',
        state: 'in_progress',
        due_date: '2026-09-20',
    },
})
