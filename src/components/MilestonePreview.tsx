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

interface MilestonePreviewProps {
    data: MilestoneData;
    title: string;
}

const MilestoneCard = ({ milestone }: { milestone: Milestone }) => {
    const progress = milestone.progress.length > 0 ? milestone.progress[0] : null;
    let progressPercentage = progress && progress.targetValue !== "{previous_value}" && +progress.targetValue > 0
        ? (progress.currentValue / +progress.targetValue) * 100
        : progress?.completed ? 100 : 0;
    if (milestone.isStreakBased && milestone.streakInfo) {
        progressPercentage = (milestone.streakInfo.currentStreak / milestone.streakInfo.streakDuration) * 100;
    }

    return (
        <div className={`bg-white rounded-lg shadow-sm p-4 border ${milestone.completed ? 'border-green-400' : 'border-gray-200'}`}>
            <div className="flex items-start space-x-4">
                {milestone.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={milestone.imageUrl} alt={milestone.name} className="w-16 h-16 rounded-md object-cover" />
                )}
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-md">{milestone.name}</h3>
                        {milestone.completed && (
                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Completed
                            </span>
                        )}
                    </div>
                    {milestone.description && <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>}

                    {milestone.rewardPoints > 0 && (
                        <p className="text-xs text-yellow-600 font-semibold mt-1">+{milestone.rewardPoints} points</p>
                    )}

                    {progress && progress.targetValue !== "{previous_value}" && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                {milestone.isStreakBased && milestone.streakInfo && (
                                    <span>{milestone.streakInfo.currentStreak} / {milestone.streakInfo.streakDuration} days</span>
                                )}
                                {!milestone.isStreakBased && (
                                    <span>{progress.currentValue} / {progress.targetValue}</span>
                                )}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>
                    )}

                    {milestone.isStreakBased && milestone.streakInfo && (
                        <div className="mt-2 text-xs bg-purple-50 p-2 rounded-md">
                            <p>Current Streak: <span className="font-semibold">{milestone.streakInfo.currentStreak}</span></p>
                            <p>Duration: <span className="font-semibold">{milestone.streakInfo.streakDuration} days</span></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export function MilestonePreview({ data, title }: MilestonePreviewProps) {
    if (!data || (!data.memberMilestones?.length && !data.otherMilestones?.length)) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 p-4">
                No milestone data to display.
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-xl p-4 h-full font-sans">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
            <div className="space-y-4">
                {data.memberMilestones?.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Your Milestones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                            {data.memberMilestones.sort((a, b) => a.name.localeCompare(b.name)).sort((a) => a.isStreakBased ? -1 : 1).map((milestone) => (
                                <MilestoneCard key={milestone.id} milestone={milestone} />
                            ))}
                        </div>
                    </div>
                )}
                {data.otherMilestones?.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Other Milestones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                            {data.otherMilestones.map((milestone) => (
                                <MilestoneCard key={milestone.id} milestone={milestone} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 