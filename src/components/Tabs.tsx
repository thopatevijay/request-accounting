import React, { useState } from 'react';

interface TabsProps {
    children: React.ReactNode;
    labels: string[];
    onTabClick?: (label: string) => void;
}

const Tabs = ({ children, labels, onTabClick }: TabsProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number, label: string) => {
        setActiveTab(index);
        if (onTabClick) {
            onTabClick(label);
        }
    };

    return (
        <div>
            <div className="flex space-x-4 mb-4 border-b-2 border-gray-200">
                {labels.map((label, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'} focus:outline-none`}
                        onClick={() => handleTabClick(index, label)}
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
