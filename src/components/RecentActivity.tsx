import React from 'react';

const RecentActivity = () => {
  const activities = [
    { id: 1, description: 'Invoice #1234', amount: '$500', date: '2024-07-01' },
    { id: 2, description: 'Payment #5678', amount: '$300', date: '2024-06-30' },
    { id: 3, description: 'Invoice #4321', amount: '$700', date: '2024-06-29' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className="flex justify-between py-2 border-b">
            <span>{activity.description}</span>
            <span>{activity.amount}</span>
            <span>{activity.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
