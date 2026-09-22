/**
 * Computes an overall rating for a tool from its approved reviews.
 *
 * Design decision: every individual category rating (performance, customer
 * service, support, after-sales) across every approved review is pooled
 * into one average, rather than averaging the four category averages.
 * This means a tool with many reviews strongly agreeing on one category
 * isn't diluted the same way a simple average-of-averages would - it
 * weights by number of ratings given, not just number of categories.
 */
function computeOverallRating(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return { averageRating: null, reviewCount: 0 };
  }

  const allRatings = [];
  for (const review of reviews) {
    allRatings.push(
      review.performanceRating,
      review.customerServiceRating,
      review.supportRating,
      review.afterSalesRating
    );
  }

  const sum = allRatings.reduce((acc, r) => acc + r, 0);
  const averageRating = sum / allRatings.length;

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  };
}

module.exports = { computeOverallRating };