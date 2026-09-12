import { Rental, Tool } from '@/models';
import { Op } from 'sequelize';

export async function getToolAvailability(toolId, startDate, endDate) {
  const tool = await Tool.findByPk(toolId);
  if (!tool) {
    throw new Error('Tool not found');
  }

  const totalQuantity = tool.totalQuantity ?? 5;

  let activeOverlaps = 0;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    activeOverlaps = await Rental.count({
      where: {
        toolId,
        status: { [Op.in]: ['pending', 'confirmed', 'active'] },
        startDate: { [Op.lt]: end },
        endDate: { [Op.gt]: start },
      },
    });
  }

  const availableQuantity = Math.max(0, totalQuantity - activeOverlaps);

  return {
    totalQuantity,
    activeOverlaps,
    availableQuantity,
    isAvailable: availableQuantity > 0,
  };
}
