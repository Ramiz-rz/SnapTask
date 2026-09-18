// Browser-based notification & audio chime utilities
import { formatTimeDisplay } from '../components/TimePicker';
import { Task } from '../types';

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

export const sendBrowserNotification = (task: Task): boolean => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const timeFormatted = task.dueTime ? formatTimeDisplay(task.dueTime) : '';
    const bodyText = [
      timeFormatted ? `Due at ${timeFormatted}` : '',
      task.category ? `Category: ${task.category}` : '',
      task.priority ? `Priority: ${task.priority}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    const notification = new Notification(`⏰ Task Reminder: ${task.title}`, {
      body: bodyText,
      icon: '/favicon.ico',
      tag: `snaptask-reminder-${task.id}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('Browser notification display failed:', err);
    return false;
  }
};

// Zero-dependency web audio chime
export const playReminderChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Chime Note 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Chime Note 2: B5 (987.77 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch (err) {
    // Autoplay restrictions or audio context errors can safely be ignored
  }
};
