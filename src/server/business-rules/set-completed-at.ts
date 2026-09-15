// Created as part of the Fable/Opus orchestration hands-on.
import { gs, GlideDateTime, type GlideRecord } from '@servicenow/glide'

// Keeps completed_at in sync with state. Runs before insert/update, so the
// values set here are persisted with the record itself (no extra update).
export function setCompletedAt(current: GlideRecord, previous: GlideRecord) {
    const state = current.getValue('state')
    const completedAt = current.getValue('completed_at')

    if (state === 'done' && !completedAt) {
        // gs.nowDateTime() is not allowed in scoped apps, so build the timestamp
        // with GlideDateTime and store its internal (database) value.
        const now = new GlideDateTime()
        current.setValue('completed_at', now.getValue())
        gs.info(`[handson] completed_at set to ${now.getValue()} for "${current.getValue('title')}"`)
    } else if (state !== 'done' && completedAt) {
        current.setValue('completed_at', '')
    }
}
