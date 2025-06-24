import React from 'react';
import { Users, Heart, Eye, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Followers',
      value: '124,532',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Likes',
      value: '89,421',
      change: '+8.2%',
      trend: 'up',
      icon: Heart,
      color: 'green',
    },
    {
      title: 'Impressions',
      value: '2.1M',
      change: '+15.3%',
      trend: 'up',
      icon: Eye,
      color: 'purple',
    },
    {
      title: 'Engagement Rate',
      value: '4.8%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
              <stat.icon size={24} className="text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{stat.change}</span>
            </div>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;