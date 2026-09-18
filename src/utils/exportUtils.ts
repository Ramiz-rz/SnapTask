import { Task } from '../types';

/**
 * Safely escapes a field value according to RFC 4180 CSV specifications.
 * If the value contains commas, double quotes, or newlines, it will be enclosed in double quotes,
 * and internal double quotes will be escaped as `""`.
 */
export function formatCsvCell(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const stringVal = String(val);
  // Replace internal quotes with double quotes
  const escaped = stringVal.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates a standard RFC 4180 compliant CSV string from an array of tasks.
 * Includes UTF-8 Byte Order Mark (BOM) for cross-platform Excel and Sheets compatibility.
 */
export function generateTasksCSV(tasks: Task[]): string {
  const headers = [
    'ID',
    'Title',
    'Description',
    'Category',
    'Priority',
    'Due Date',
    'Due Time',
    'Status',
    'Source',
    'Source Detail',
    'Confidence Score (%)',
    'Context',
    'Created At',
    'Completed At',
  ];

  const headerRow = headers.map(formatCsvCell).join(',');

  const rows = tasks.map((task) => {
    return [
      formatCsvCell(task.id),
      formatCsvCell(task.title),
      formatCsvCell(task.description || ''),
      formatCsvCell(task.category),
      formatCsvCell(task.priority),
      formatCsvCell(task.dueDate),
      formatCsvCell(task.dueTime || ''),
      formatCsvCell(task.isCompleted ? 'Completed' : 'Pending'),
      formatCsvCell(task.source),
      formatCsvCell(task.sourceDetail || ''),
      formatCsvCell(task.confidence !== undefined ? `${task.confidence}%` : ''),
      formatCsvCell(task.context || ''),
      formatCsvCell(task.createdAt || ''),
      formatCsvCell(task.completedAt || ''),
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel properly decodes Unicode characters
  return '\uFEFF' + [headerRow, ...rows].join('\r\n');
}

/**
 * Triggers a client-side download of the tasks array formatted as a CSV file.
 * Returns the generated filename.
 */
export function downloadTasksCSV(tasks: Task[], customPrefix = 'snaptask-backup'): string {
  const csvContent = generateTasksCSV(tasks);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${customPrefix}-${timestamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL after small delay
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}
