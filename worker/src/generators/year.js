import { createSVG, rect, circle, text, parseColor, colorWithAlpha } from '../svg.js';
import { getDateInTimezone, getDayOfYear, getWeekOfYear, getDaysInYear } from '../timezone.js';

/**
 * Generate Year Progress Calendar Wallpaper
 * Shows weeks of the year as a grid, highlighting completed weeks
 */
export function generateYearCalendar(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone
    } = options;

    // Get current date in user's timezone
    const { year, month, day } = getDateInTimezone(timezone);
    const dayOfYear = getDayOfYear(year, month, day);
    const weekOfYear = getWeekOfYear(year, month, day);
    const totalDays = getDaysInYear(year);

    // Layout calculations
    const cols = 7; // Days per week
    const rows = Math.ceil(totalDays / cols); // ~52-53 rows
    const padding = width * 0.08;
    const topPadding = height * 0.2; // Space for title
    const bottomPadding = height * 0.12; // Space for stats

    const availableWidth = width - (padding * 2);
    const availableHeight = height - topPadding - bottomPadding;

    const gap = Math.max(3, width * 0.005);
    const cellWidth = (availableWidth - (gap * (cols - 1))) / cols;
    const cellHeight = (availableHeight - (gap * (rows - 1))) / rows;
    const cellSize = Math.min(cellWidth, cellHeight);

    // Center the grid
    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = topPadding + (availableHeight - gridHeight) / 2;

    let content = '';

    // Background
    content += rect(0, 0, width, height, parseColor(bgColor));

    // Title - Year
    content += text(width / 2, topPadding * 0.5, year.toString(), {
        fill: parseColor(accentColor),
        fontSize: width * 0.08,
        fontWeight: '700',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Subtitle
    content += text(width / 2, topPadding * 0.75, 'Year Progress', {
        fill: colorWithAlpha('#ffffff', 0.5),
        fontSize: width * 0.035,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Day grid
    for (let i = 0; i < totalDays; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cellSize + gap);
        const y = startY + row * (cellSize + gap);

        const isCompleted = i < dayOfYear;
        const isToday = i === dayOfYear - 1;

        let fillColor;
        if (isToday) {
            fillColor = parseColor(accentColor);
        } else if (isCompleted) {
            fillColor = colorWithAlpha(parseColor(accentColor), 0.6);
        } else {
            fillColor = colorWithAlpha('#ffffff', 0.08);
        }

        content += rect(x, y, cellSize, cellSize, fillColor, cellSize * 0.15);
    }

    // Stats at bottom
    const progressPercent = Math.round((dayOfYear / totalDays) * 100);
    const daysRemaining = totalDays - dayOfYear;

    content += text(width / 2, height - bottomPadding * 0.6, `${progressPercent}% complete · ${daysRemaining} days remaining`, {
        fill: colorWithAlpha('#ffffff', 0.4),
        fontSize: width * 0.03,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Current week indicator
    content += text(width / 2, height - bottomPadding * 0.3, `Week ${weekOfYear} of 52`, {
        fill: colorWithAlpha('#ffffff', 0.3),
        fontSize: width * 0.025,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    return createSVG(width, height, content);
}
