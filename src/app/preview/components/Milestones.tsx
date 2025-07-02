'use client';
import React, { useEffect, useState } from 'react';
import styles from './Milestones.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';

interface Milestone {
    id: string;
    name: string;
    description?: string;
    rewardPoints: number;
    is_completed: boolean;
    progress: number;
    imageUrl: string;
}

const Milestones = () => {
    const [milestonesData, setMilestonesData] = useState<Milestone[]>([]);

    useEffect(() => {
        const fetchMilestones = async () => {
            const response = await fetch(`/api/achievex/milestones`);
            const data = (await response.json()).data as Milestone[];
            console.log(data);
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
            <div className={styles.titleSection}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleIcons}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.levelIcon1}>🏆</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.levelIcon2}>⭐</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.levelIcon3}>🎖️</span>
                        </div>
                    </div>
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>Milestone</span>
                        <span className={styles.titleAccent}>Achievements</span>
                    </h2>
                    <div className={styles.titleSubtext}>
                        <span className={styles.subtextIcon}>🚀</span>
                        Complete challenges to earn exclusive rewards
                    </div>
                </div>
                <div className={styles.titleDecorations}>
                    <div className={styles.decoration1}></div>
                    <div className={styles.decoration2}></div>
                    <div className={styles.decoration3}></div>
                </div>
            </div>
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
                            <img className={styles.milestoneImage} src={milestone.imageUrl} alt={milestone.name}/>
                            <h4>{milestone.name}</h4>
                            {milestone.description && (
                                <p className={styles.description}>{milestone.description}</p>
                            )}

                            <div className={styles.rewardSection}>
                                <span className={styles.rewardLabel}>🎁 Reward:</span>
                                <span className={styles.rewardValue}>{milestone.rewardPoints} 💎</span>
                            </div>
                        </div>
                    </SpotlightCard>
                ))}
            </div>
        </div>
    );
};

export default Milestones; 