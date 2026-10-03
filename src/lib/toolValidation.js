import { Category } from '@/models';

// Limits mirror the DB schema: STRING => VARCHAR(255), DECIMAL(10,2) => max 99,999,999.99
export const TOOL_NAME_MAX = 255;
export const TOOL_IMAGE_URL_MAX = 255;
const RATE_MAX = 99999999.99;
const QUANTITY_MAX = 100000;
const RATE_FIELDS = [
  ['hourlyRate', 'Hourly rate'],
  ['dailyRate', 'Daily rate'],
  ['weeklyRate', 'Weekly rate'],
];
const STATUSES = ['active', 'inactive'];

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

/**
 * Validates tool input for create (partial=false) or update (partial=true).
 * Returns { errors, data } where `errors` maps field -> message and `data`
 * holds the sanitised values ready to pass to Sequelize.
 */
export async function validateToolInput(body, { partial = false } = {}) {
  const errors = {};
  const data = {};
  const input = body && typeof body === 'object' ? body : {};
  const shouldCheck = (field) => !partial || input[field] !== undefined;

  if (shouldCheck('name')) {
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (!name) errors.name = 'Name is required';
    else if (name.length > TOOL_NAME_MAX) errors.name = `Name must be ${TOOL_NAME_MAX} characters or fewer`;
    else data.name = name;
  }

  if (shouldCheck('description')) {
    const description = typeof input.description === 'string' ? input.description.trim() : '';
    if (!description) errors.description = 'Description is required';
    else data.description = description;
  }

  if (input.imageUrl !== undefined) {
    if (isBlank(input.imageUrl)) {
      data.imageUrl = null;
    } else if (typeof input.imageUrl !== 'string') {
      errors.imageUrl = 'Image URL must be text';
    } else if (input.imageUrl.trim().length > TOOL_IMAGE_URL_MAX) {
      errors.imageUrl = `Image URL must be ${TOOL_IMAGE_URL_MAX} characters or fewer`;
    } else {
      data.imageUrl = input.imageUrl.trim();
    }
  }

  for (const [field, label] of RATE_FIELDS) {
    if (!shouldCheck(field)) continue;
    if (isBlank(input[field])) {
      errors[field] = `${label} is required`;
      continue;
    }
    const value = Number(input[field]);
    if (!Number.isFinite(value)) errors[field] = `${label} must be a number`;
    else if (value <= 0) errors[field] = `${label} must be greater than 0`;
    else if (value > RATE_MAX) errors[field] = `${label} is too large`;
    else data[field] = Math.round(value * 100) / 100;
  }

  if (input.totalQuantity !== undefined && !isBlank(input.totalQuantity)) {
    const qty = Number(input.totalQuantity);
    if (!Number.isInteger(qty)) errors.totalQuantity = 'Stock quantity must be a whole number';
    else if (qty < 0) errors.totalQuantity = 'Stock quantity cannot be negative';
    else if (qty > QUANTITY_MAX) errors.totalQuantity = 'Stock quantity is too large';
    else data.totalQuantity = qty;
  } else if (!partial) {
    data.totalQuantity = 5;
  } else if (input.totalQuantity !== undefined) {
    errors.totalQuantity = 'Stock quantity is required';
  }

  if (shouldCheck('categoryId')) {
    const categoryId = Number(input.categoryId);
    if (isBlank(input.categoryId)) {
      errors.categoryId = 'Category is required';
    } else if (!Number.isInteger(categoryId) || categoryId <= 0) {
      errors.categoryId = 'Category is invalid';
    } else if (!(await Category.findByPk(categoryId))) {
      errors.categoryId = 'Selected category does not exist';
    } else {
      data.categoryId = categoryId;
    }
  }

  if (input.status !== undefined) {
    if (!STATUSES.includes(input.status)) errors.status = `Status must be one of: ${STATUSES.join(', ')}`;
    else data.status = input.status;
  }

  return { errors, data };
}

/** Builds a 400 payload: first message as `error`, plus every field message. */
export function validationErrorBody(errors) {
  return { error: Object.values(errors)[0], fields: errors };
}
