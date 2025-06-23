// src/components/MemberDataPreview.tsx

import { MilestonePreview } from "./MilestonePreview";

interface Level {
    level: number;
    name: string;
    min: number;
    imageUrl: string;
}

interface Progress {
    currentValue: number;
    targetValue: string;
    completed: boolean;
}

interface StreakInfo {
    streakDuration: number;
    currentStreak: number;
    streakStartDate: string;
}

interface Milestone {
    id: string;
    name: string;
    description: string | null;
    completed: boolean;
    rewardPoints: number;
    isStreakBased: boolean;
    progress: Progress[];
    imageUrl: string | null;
    isActive: boolean;
    streakInfo: StreakInfo | null;
}

interface MilestoneData {
    memberMilestones: Milestone[];
    otherMilestones: Milestone[];
}

interface MemberData {
    id: string;
    externalId: string;
    points: number;
    spendablePoints: number;
    currentLevel: Level;
    nextLevel: Level;
}

interface MemberDataPreviewProps {
    data: MemberData;
    milestoneData?: MilestoneData;
    title: string;
}

export function MemberDataPreview({ data, milestoneData, title }: MemberDataPreviewProps) {
    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No data to display.
            </div>
        );
    }

    const progress = data.currentLevel && data.nextLevel && data.nextLevel.min > data.currentLevel.min
        ? Math.min(((data.points - data.currentLevel.min) / (data.nextLevel.min - data.currentLevel.min)) * 100, 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 font-sans text-gray-800 h-full">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
            </div>

            <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase font-semibold">External ID</p>
                <p className="text-sm font-mono text-gray-600 tracking-wider">{data.externalId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Points</p>
                    <p className="text-2xl font-bold text-indigo-600">{data.points.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Spendable</p>
                    <p className="text-2xl font-bold text-teal-600">{data.spendablePoints.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Current Level</h3>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.currentLevel.imageUrl} alt={data.currentLevel.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-md">{data.currentLevel.name}</p>
                            <p className="text-xs text-gray-500">Level {data.currentLevel.level} ({data.currentLevel.min}+ pts)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Next Level</h3>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={data.nextLevel.imageUrl} alt={data.nextLevel.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-md">{data.nextLevel.name}</p>
                            <p className="text-xs text-gray-500">Level {data.nextLevel.level} ({data.nextLevel.min}+ pts)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Progress to Next Level</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-medium text-gray-500 mt-1">
                    <span>{data.currentLevel.name}</span>
                    <span>{data.points.toFixed(0)}/{data.nextLevel.min} pts</span>
                    <span>{data.nextLevel.name}</span>
                </div>
            </div>
            {milestoneData && (
                <div className="mt-6">
                    <MilestonePreview data={milestoneData} title="Milestones" />
                </div>
            )}
        </div>
    );
} 