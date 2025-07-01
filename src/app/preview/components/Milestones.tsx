'use client';
import React, { useEffect, useState } from 'react';
import styles from './Milestones.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';

interface Milestone {
    id: string;
    name: string;
    description?: string;
    points: number;
    is_completed: boolean;
    progress: number;
}

const Milestones = () => {
    const [milestonesData, setMilestonesData] = useState<Milestone[]>([]);

    useEffect(() => {
        const fetchMilestones = async () => {
            const response = await fetch(`/api/achievex/milestones`);
            const data = (await response.json()).data as Milestone[];
            setMilestonesData(data);
        };

        fetchMilestones();
    }, []);

    const getSpotlightColor = (milestone: Milestone) => {
        if (milestone.is_completed) return 'rgba(34, 197, 94, 0.6)' as const;
        return 'rgba(148, 163, 184, 0.4)' as const;
    };

    return (
        <div>
            <h2 className={styles.title}>🏆 Milestone Achievements</h2>
            <div className={styles.milestonesContainer}>
                {milestonesData.map(milestone => (
                    <SpotlightCard
                        key={milestone.id}
                        className={`${styles.milestoneCard} ${milestone.is_completed ? styles.completed : ''}`}
                        spotlightColor={getSpotlightColor(milestone)}
                    >
                        <div className={styles.milestoneHeader}>
                            {milestone.is_completed && (
                                <div className={styles.completedBadge}>✅ COMPLETED</div>
                            )}
                        </div>

                        <div className={styles.milestoneContent}>
                            <h4>{milestone.name}</h4>
                            {milestone.description && (
                                <p className={styles.description}>{milestone.description}</p>
                            )}

                            <div className={styles.progressSection}>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${milestone.progress}%` }}
                                    ></div>
                                </div>
                                <span className={styles.progressText}>{milestone.progress}%</span>
                            </div>

                            <div className={styles.rewardSection}>
                                <span className={styles.rewardLabel}>🎁 Reward:</span>
                                <span className={styles.rewardValue}>{milestone.points} pt</span>
                            </div>
                        </div>
                    </SpotlightCard>
                ))}
            </div>
        </div>
    );
};

export default Milestones; 