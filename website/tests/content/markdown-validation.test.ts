import { execFileSync } from 'child_process';
import path from 'path';

describe('markdown content validation', () => {
    test('content files have balanced fences, flashcard markers, and data mappings', () => {
        const script = path.resolve(__dirname, '../../scripts/validate-markdown-content.py');
        expect(() =>
            execFileSync('python3', [script], { stdio: 'pipe', encoding: 'utf-8' })
        ).not.toThrow();
    });
});
