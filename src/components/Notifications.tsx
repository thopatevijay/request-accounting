import React from 'react';

interface Notification {
  message: string;
  type: string;
}

interface NotificationsProps {
  notifications: Notification[];
  isLoading: boolean;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notifications and Alerts</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : notifications?.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul>
          {notifications?.map((notification, index) => (
            <li
              key={index}
              className={`p-2 mb-2 rounded ${
                notification.type === 'success'
                  ? 'bg-green-100'
                  : notification.type === 'warning'
                  ? 'bg-yellow-100'
                  : 'bg-blue-100'
              }`}
            >
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
