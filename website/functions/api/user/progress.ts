import { applyProgressOperation, handleSyncPost, type SyncRequestContext } from './sync-utils';

/**
 * POST /api/user/progress — applies a single progress operation
 * (status/nextReviewDate/reviewInterval/note) to the stored user data.
 *
 * Body: { problemId, operation: { problemId, status?, nextReviewDate?,
 *         reviewInterval?, note?, timestamp }, timestamp, deviceId }
 * Returns: { applied: 1, conflicts: [] }
 */
export async function onRequestPost({
    request,
    env,
}: SyncRequestContext): Promise<Response> {
    return handleSyncPost(request, env, (data, body) => {
        if (!applyProgressOperation(data, body)) {
            throw new Error('Invalid operation');
        }
        return 1;
    });
}
