import { Op, fn, col, where as sqlWhere } from 'sequelize';
import { Category } from '@/models';

export const CATEGORY_NAME_MAX = 255;

/**
 * Case-insensitive lookup of a category by name, optionally excluding one id
 * (used when renaming so a category doesn't clash with itself).
 */
export async function findCategoryByName(name, excludeId) {
  const conditions = [sqlWhere(fn('LOWER', col('name')), name.trim().toLowerCase())];
  if (excludeId !== undefined && excludeId !== null) {
    conditions.push({ id: { [Op.ne]: excludeId } });
  }
  return Category.findOne({ where: { [Op.and]: conditions } });
}
