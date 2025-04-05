
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Sprout, AlertTriangle, Info, CloudRain, Thermometer } from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock function to generate sample notifications for demo purposes
  useEffect(() => {
    const generateSampleNotifications = () => {
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'Pest Alert',
          message: 'High aphid concentration detected in Field 3',
          type: 'warning',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          icon: <AlertTriangle className="h-4 w-4" />
        },
        {
          id: '2',
          title: 'Weather Update',
          message: 'Rain expected in the next 24 hours. Consider delaying spraying.',
          type: 'info',
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
          read: false,
          icon: <CloudRain className="h-4 w-4" />
        },
        {
          id: '3',
          title: 'Treatment Success',
          message: 'Field 2 treatment complete. 45% reduction in pest population.',
          type: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          read: true,
          icon: <Sprout className="h-4 w-4" />
        }
      ];

      setNotifications(sampleNotifications);
      
      // Show unread notifications
      sampleNotifications
        .filter(notification => !notification.read)
        .forEach(notification => {
          showToastNotification(notification);
        });
    };

    const interval = setInterval(() => {
      // Simulate new notification every 2 minutes
      const random = Math.random();
      let newNotification: Notification;
      
      if (random < 0.33) {
        newNotification = {
          id: Date.now().toString(),
          title: 'Temperature Alert',
          message: `Field temperature has reached ${Math.round(30 + Math.random() * 8)}°C. Consider irrigation.`,
          type: 'warning',
          timestamp: new Date(),
          read: false,
          icon: <Thermometer className="h-4 w-4" />
        };
      } else if (random < 0.66) {
        newNotification = {
          id: Date.now().toString(),
          title: 'System Update',
          message: 'Pest detection models have been updated for higher accuracy.',
          type: 'info',
          timestamp: new Date(),
          read: false,
          icon: <Info className="h-4 w-4" />
        };
      } else {
        newNotification = {
          id: Date.now().toString(),
          title: 'Treatment Reminder',
          message: 'Scheduled treatment for Field 4 is due tomorrow.',
          type: 'info',
          timestamp: new Date(),
          read: false,
          icon: <Bell className="h-4 w-4" />
        };
      }
      
      setNotifications(prev => [newNotification, ...prev]);
      showToastNotification(newNotification);
    }, 120000); // Every 2 minutes

    generateSampleNotifications();

    return () => clearInterval(interval);
  }, []);

  const showToastNotification = (notification: Notification) => {
    const toastOptions = {
      duration: 5000,
      icon: notification.icon,
      description: notification.message
    };

    switch (notification.type) {
      case 'warning':
        toast.warning(notification.title, toastOptions);
        break;
      case 'success':
        toast.success(notification.title, toastOptions);
        break;
      case 'error':
        toast.error(notification.title, toastOptions);
        break;
      case 'info':
      default:
        toast.info(notification.title, toastOptions);
        break;
    }
  };

  // We don't render anything directly - this component just manages notifications
  return null;
};

export default NotificationSystem;
