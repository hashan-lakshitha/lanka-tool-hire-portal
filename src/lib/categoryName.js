/**
 * Category names are stored in the DB in English. Translate known names via the
 * `categoryNames` map in the locale files and fall back to the stored name for
 * any category an admin creates later. A direct map lookup is used (rather than
 * `t('categoryNames.' + name)`) so names containing "." or ":" don't break i18next.
 */
export function translateCategoryName(t, name) {
  if (!name) return name;
  const names = t('categoryNames', { returnObjects: true });
  return names && typeof names === 'object' && typeof names[name] === 'string' ? names[name] : name;
}
