import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

// Simulated historical yield data
const yieldData = [
  { name: 'Jan', apy: 12.5 },
  { name: 'Feb', apy: 15.2 },
  { name: 'Mar', apy: 14.8 },
  { name: 'Apr', apy: 16.1 },
  { name: 'May', apy: 13.9 },
  { name: 'Jun', apy: 15.5 },
];

const DeFiProtocolCard = ({ protocol, onInvest }) => (
  <Card className="w-full mb-4">
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          {protocol.icon}
          {protocol.name}
        </CardTitle>
        <Badge variant={protocol.riskLevel === 'Low' ? 'success' : 
               protocol.riskLevel === 'Medium' ? 'warning' : 'destructive'}>
          {protocol.riskLevel} Risk
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Current APY</p>
          <p className="text-xl font-bold text-green-600">{protocol.apy}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">TVL</p>
          <p className="text-xl font-bold">${protocol.tvl}M</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Safety Score</p>
          <p className="text-xl font-bold">{protocol.safetyScore}/100</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Recommended Allocation</p>
          <p className="text-xl font-bold">{protocol.recommendedAllocation}%</p>
        </div>
      </div>
      
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yieldData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="apy" stroke="#059669" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          <span>Smart Contract Audited</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>{protocol.riskNote}</span>
        </div>
      </div>

      <Button onClick={() => onInvest(protocol.id)} className="w-full">
        Start Investing
      </Button>
    </CardContent>
  </Card>
);

const DeFiAdvisorDashboard = () => {
  const [selectedRisk, setSelectedRisk] = useState('all');
  
  const protocols = [
    {
      id: 1,
      name: "Stablecoin Yield Pool",
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      riskLevel: "Low",
      apy: 8.5,
      tvl: 150,
      safetyScore: 95,
      recommendedAllocation: 40,
      riskNote: "Main risks are smart contract and stablecoin de-pegging"
    },
    {
      id: 2,
      name: "Liquidity Mining Strategy",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      riskLevel: "Medium",
      apy: 25.8,
      tvl: 80,
      safetyScore: 85,
      recommendedAllocation: 30,
      riskNote: "Impermanent loss risk, market volatility risk"
    },
    {
      id: 3,
      name: "Leverage Yield Aggregator",
      icon: <TrendingUp className="h-5 w-5 text-red-500" />,
      riskLevel: "High",
      apy: 45.2,
      tvl: 30,
      safetyScore: 75,
      recommendedAllocation: 10,
      riskNote: "High leverage risk, requires continuous monitoring"
    }
  ];

  const handleInvest = (protocolId) => {
    // TODO: Implement investment logic
    console.log(`Investing in protocol ${protocolId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">DeFi Investment Recommendations</h1>
        <div className="flex gap-2">
          <Button 
            variant={selectedRisk === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedRisk('all')}
          >
            All
          </Button>
          <Button 
            variant={selectedRisk === 'low' ? 'default' : 'outline'}
            onClick={() => setSelectedRisk('low')}
          >
            Low Risk
          </Button>
          <Button 
            variant={selectedRisk === 'medium' ? 'default' : 'outline'}
            onClick={() => setSelectedRisk('medium')}
          >
            Medium Risk
          </Button>
          <Button 
            variant={selectedRisk === 'high' ? 'default' : 'outline'}
            onClick={() => setSelectedRisk('high')}
          >
            High Risk
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {protocols
          .filter(p => selectedRisk === 'all' || 
            (selectedRisk === 'low' && p.riskLevel === 'Low') ||
            (selectedRisk === 'medium' && p.riskLevel === 'Medium') ||
            (selectedRisk === 'high' && p.riskLevel === 'High'))
          .map(protocol => (
            <DeFiProtocolCard
              key={protocol.id}
              protocol={protocol}
              onInvest={handleInvest}
            />
          ))
        }
      </div>
    </div>
  );
};

export default DeFiAdvisorDashboard; 