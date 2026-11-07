import {
    applyCustomProblemUpsert,
    applyProblemDeletion,
    handleSyncPost,
    type SyncRequestContext,
} from './sync-utils';

/**
 * POST /api/user/custom-problems — upserts or deletes a user-created problem
 * in the stored user data.
 *
 * Body (upsert): { action: 'upsert', problem: { id, name, difficulty, ... } }
 * Body (delete): { action: 'delete', problemId }
 * Returns: { applied: 1, conflicts: [] }
 */
export async function onRequestPost({
    request,
    env,
}: SyncRequestContext): Promise<Response> {
    return handleSyncPost(request, env, (data, body) => {
        const action = body['action'];
        if (action === 'upsert') {
            if (!applyCustomProblemUpsert(data, body['problem'])) {
                throw new Error('Invalid problem');
            }
            return 1;
        }
        if (action === 'delete') {
            if (!applyProblemDeletion(data, body['problemId'])) {
                throw new Error('Invalid problemId');
            }
            return 1;
        }
        throw new Error('Invalid action');
    });
}
