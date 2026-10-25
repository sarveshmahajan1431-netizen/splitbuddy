import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
// FIX: Import CompatibilityResult from types.ts and remove the local definition.
import type { User, CompatibilityResult } from '../types';
import { getCompatibility } from '../services/geminiService';
// FIX: SparklesIcon is now available for import.
import { SparklesIcon, XMarkIcon } from './icons/Icons';

interface CompatibilityModalProps {
  users: [User, User];
  onClose: () => void;
}

const CompatibilityModal: React.FC<CompatibilityModalProps> = ({ users, onClose }) => {
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompatibility = async () => {
      try {
        setLoading(true);
        setError(null);
        const analysis = await getCompatibility(users[0], users[1]);
        setResult(analysis);
      } catch (err) {
        console.error("Failed to get compatibility score:", err);
        setError("Could not analyze compatibility. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompatibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const chartData = useMemo(() => {
    const score = result?.score || 0;
    return [
      { name: 'Compatibility', value: score },
      { name: 'Remaining', value: 100 - score },
    ];
  }, [result]);

  const COLORS = ['#4f46e5', '#e0e7ff'];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <SparklesIcon className="w-12 h-12 text-indigo-500 animate-pulse" />
          <p className="mt-4 text-lg text-gray-600">Analyzing compatibility...</p>
        </div>
      );
    }

    if (error || !result) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-lg text-red-600">{error || 'An unexpected error occurred.'}</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
            <div className="w-full md:w-1/3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label 
                                value={`${result.score}%`}
                                position="center"
                                fill="#111827"
                                className="text-3xl font-bold"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full md:w-2/3">
                <h4 className="font-bold text-lg text-gray-800 mb-2">Overall Summary</h4>
                <p className="text-gray-600">{result.summary}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-lg text-green-600 mb-2">Potential Positives</h4>
                <ul className="space-y-2">
                    {result.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{pro}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-lg text-red-600 mb-2">Things to Consider</h4>
                 <ul className="space-y-2">
                    {result.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                            <span className="text-red-500 mt-1">!</span>
                            <span>{con}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <SparklesIcon /> Compatibility Report
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon />
            </button>
          </div>
          <p className="text-gray-500 mt-1">
            {users[0].name} & {users[1].name}
          </p>
        </div>
        <div className="p-6">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityModal;
