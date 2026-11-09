(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SmartGrindRatings = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function parseProblems(text) {
    const lines = text.split('\n');
    const problems = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length >= 7) {
        const rating = parseFloat(parts[0]);
        const id = parts[1];
        const title = parts[2];
        const slug = parts[3];
        const contest = parts[4];
        const tagsStr = parts[6];
        const problemTags = tagsStr ? tagsStr.split(',').map((t) => t.trim()) : [];
        problems.push({ rating, id, title, slug, contest, tags: problemTags });
      }
    }
    return problems;
  }

  function buildRatingBySlug(problems) {
    const bySlug = new Map();
    for (const problem of problems) {
      bySlug.set(problem.slug, problem.rating);
    }
    return bySlug;
  }

  function calculateCurrentRating(problems, solvedProblems) {
    if (!solvedProblems || solvedProblems.length === 0) return '--';
    if (!problems || problems.length === 0) return '--';

    const sortedSolved = [...solvedProblems].sort((a, b) => b.solvedAt - a.solvedAt);
    const ratingBySlug = buildRatingBySlug(problems);

    const alpha = 0.2;
    let ema = ratingBySlug.get(sortedSolved[0].slug) || 0;
    for (let i = 1; i < sortedSolved.length; i++) {
      const rating = ratingBySlug.get(sortedSolved[i].slug) || 0;
      ema = alpha * rating + (1 - alpha) * ema;
    }

    const globalAvg = problems.reduce((sum, p) => sum + p.rating, 0) / problems.length;
    const confidence = Math.min(solvedProblems.length / 100, 1);
    const bayesianRating = confidence * ema + (1 - confidence) * globalAvg;
    return Math.round(bayesianRating);
  }

  function getFilteredProblems(problems, minRating, maxRating, selectedTag) {
    let filtered = problems.filter((p) => p.rating >= minRating && p.rating <= maxRating);
    if (selectedTag) {
      filtered = filtered.filter((p) => p.tags.includes(selectedTag));
    }
    return filtered;
  }

  return { parseProblems, calculateCurrentRating, getFilteredProblems, buildRatingBySlug };
});
