import React, { useState } from 'react';

interface TabsProps {
    children: React.ReactNode;
    labels: string[];
}

const Tabs = ({ children, labels }: TabsProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex space-x-4 mb-4 border-b-2 border-gray-200">
                {labels.map((label, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'} focus:outline-none`}
                        onClick={() => setActiveTab(index)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <div>{React.Children.toArray(children)[activeTab]}</div>
        </div>
    );
};

export default Tabs;
