/**
 * Custom Jest transformer to replace import.meta.env.VITE_API_BASE with hardcoded value
 * This is needed because Jest doesn't support import.meta syntax in CommonJS mode
 */

export default {
  process(sourceText, sourcePath, options) {
    // Replace import.meta.env.VITE_API_BASE with the hardcoded value
    const transformed = sourceText.replace(
      /import\.meta\.env\.VITE_API_BASE/g,
      "'/smartgrind/api'"
    );
    return {
      code: transformed,
    };
  },
};
