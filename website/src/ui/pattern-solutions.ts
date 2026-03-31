// --- PATTERN TO MARKDOWN FILE MAPPING SYSTEM ---
// Handles naming inconsistencies between pattern names and solution filenames

import { getBaseUrl } from '../utils';

/**
 * Convert pattern name to filename
 * Handles special characters and common suffixes
 */
const convertPatternNameToFilename = (patternName: string): string => {
    let cleaned = patternName
        .toLowerCase()
        .replace(/[\s/()&`'+-]+/g, '-') // Replace spaces and special chars with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end

    // Remove common suffix patterns that don't add value
    cleaned = cleaned
        .replace(/-pattern$/, '')
        .replace(/-algorithm$/, '')
        .replace(/-approach$/, '')
        .replace(/-method$/, '')
        .replace(/-technique$/, '')
        .replace(/-style$/, '');

    return cleaned;
};

/**
 * Pattern solutions lookup for algorithms
 */
export const patterns = {
    /**
     * Get the correct filename for a pattern
     */
    getPatternFilename(patternName: string): string {
        return convertPatternNameToFilename(patternName);
    },

    /**
     * Check if a pattern solution file exists
     */
    async checkPatternSolutionExists(patternName: string): Promise<boolean> {
        const filename = this.getPatternFilename(patternName);
        const solutionFile = `${getBaseUrl()}patterns/${filename}.md`;

        try {
            const response = await fetch(solutionFile, { method: 'HEAD' });
            return response.ok;
        } catch (_error) {
            return false;
        }
    },
};

/**
 * Pattern solutions lookup for SQL
 */
export const sqlSolutions = {
    /**
     * Get the correct filename for a SQL pattern
     */
    getSQLFilename(patternName: string): string {
        return this._convertPatternNameToFilename(patternName);
    },

    /**
     * Internal function for automatic pattern name to filename conversion
     */
    _convertPatternNameToFilename(patternName: string): string {
        let cleaned = patternName
            .toLowerCase()
            .replace(/[\s/()&`'+-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        // SQL-specific suffixes
        cleaned = cleaned
            .replace(/-pattern$/, '')
            .replace(/-sql$/, '')
            .replace(/-solution$/, '');

        return cleaned;
    },

    /**
     * Check if a SQL solution file exists
     */
    async checkSQLSolutionExists(patternName: string): Promise<boolean> {
        const filename = this.getSQLFilename(patternName);
        const solutionFile = `${getBaseUrl()}sql/patterns/${filename}.md`;

        try {
            const response = await fetch(solutionFile, { method: 'HEAD' });
            return response.ok;
        } catch (_error) {
            return false;
        }
    },
};
