import React from 'react';

const notifications = [
  { id: 1, message: 'Invoice #1234 is due tomorrow', type: 'reminder' },
  { id: 2, message: 'Payment #5678 was successful', type: 'confirmation' },
];

const Notifications = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Notifications and Alerts</h2>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className="py-2 border-b">
            <span className={`${notification.type === 'reminder' ? 'text-yellow-500' : 'text-green-500'}`}>
              {notification.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
