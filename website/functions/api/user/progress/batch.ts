import { applyProgressOperation, handleSyncPost, type SyncRequestContext } from '../sync-utils';

/**
 * POST /api/user/progress/batch — applies a batch of progress operations to
 * the stored user data (last write wins, operations applied in order).
 *
 * Body: { operations: [{ problemId, operation: {...}, timestamp, deviceId }],
 *         clientVersion }
 * Returns: { applied: <n>, conflicts: [] }
 */
export async function onRequestPost({
    request,
    env,
}: SyncRequestContext): Promise<Response> {
    return handleSyncPost(request, env, (data, body) => {
        const operations = body['operations'];
        if (!Array.isArray(operations)) {
            throw new Error('Invalid operations');
        }

        let applied = 0;
        for (const op of operations) {
            if (op && typeof op === 'object' && applyProgressOperation(data, op as Record<string, unknown>)) {
                applied++;
            }
        }
        return applied;
    });
}
