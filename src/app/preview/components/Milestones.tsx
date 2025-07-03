'use client';
import React, { useEffect, useState } from 'react';
import styles from './Milestones.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';
import { useAchieveX } from '@/contexts/AchieveXContext';

interface Milestone {
    id: string;
    name: string;
    description?: string;
    rewardPoints: number;
    isStreakBased: boolean;
    streakDuration: number;
    requirements: {
        data: string;
        integrationKey: string;
        operator: string;
        repeatCount: number;
        targetValue: string;
        taskId: string;
        taskName: string;
    }[];
    isActive: boolean;
    imageUrl: string;
}

const Milestones = () => {
    const [milestonesData, setMilestonesData] = useState<Milestone[]>([]);
    const { token, memberMilestoneData } = useAchieveX();
    useEffect(() => {
        const fetchMilestones = async () => {
            const response = await fetch(`/api/achievex/milestones`, {
                headers: {
                    'x-api-key': token,
                },
            });
            const data = (await response.json()).data as Milestone[];
            console.log('FROM API',data);
            setMilestonesData(data);
        };

        fetchMilestones();
    }, []);

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
                {milestonesData.map(milestone => {
                    const milestoneData = memberMilestoneData?.memberMilestones.find(m => m.name === milestone.name);
                    console.log('milestoneData', milestoneData);
                    const isCompleted = milestoneData ? milestoneData.completed : false;
                    console.log('isCompleted', isCompleted);
                    return (
                    <SpotlightCard
                        key={milestone.id}
                        className={`${styles.milestoneCard}`}
                        spotlightColor={isCompleted ? 'rgba(34, 197, 94, 0.6)' : 'rgba(148, 163, 184, 0.4)'}
                    >
                        <div className={styles.milestoneContent}>
                                {isCompleted && (
                                    <div className={styles.completedBadge}>✅ COMPLETED</div>
                                )}
                            <div className={`${isCompleted ? styles.completedMilestoneCard : ''}`}>
                                {milestone.imageUrl && (
                                    <img className={styles.milestoneImage} src={milestone.imageUrl} alt={milestone.name}/>
                                )}
                                {!milestone.imageUrl && (
                                    <img className={styles.milestoneImage} src="/images/placeholder.svg" alt={milestone.name}/>
                                )}
                            </div>
                            <h4 className={`${isCompleted ? styles.completedMilestoneName : ''}`}>{milestone.name}</h4> 
                            {milestone.description && (
                                <p className={styles.description}>{milestone.description}</p>
                            )}

                            <div className={`${styles.requirementsContainer} ${isCompleted ? styles.completedRequirementsContainer : ''}`}>
                                <ul>
                                    {milestone.requirements.map((requirement) => (
                                        <li key={requirement.taskId}>{requirement.taskName.replaceAll('_', ' ')} {requirement.repeatCount > 1 && <span>({requirement.repeatCount} times)</span>}
                                        {milestone.isStreakBased && (
                                            <span>
                                                for <strong>{milestone.streakDuration} days</strong>
                                            </span>
                                        )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {milestone.isStreakBased && (
                                <div className={`${styles.streakContainer} ${isCompleted ? styles.completedStreakContainer : ''}`}>
                                    {Array.from({length: milestone.streakDuration}).map((_, index) => (
                                        <div className={`${styles.streakDot} ${(milestoneData?.streakInfo?.currentStreak || -1) >= (index + 1) ? styles.completed : ''}`} key={index}></div>
                                    ))}
                                </div>
                            )}

                            {!milestone.isStreakBased && (
                                milestone.requirements.map((requirement, index) => (
                                    <div className={`${styles.streakContainer} ${isCompleted ? styles.completedStreakContainer : ''}`} key={index}>
                                        {Array.from({length: requirement?.repeatCount}).map((_, index) => (
                                            <div className={`${styles.streakDot} ${((milestoneData?.progress[0]?.currentValue || 0) >= (index + 1)) ? styles.completed : ''}`} key={index}></div>
                                        ))}
                                    </div>
                                ))
                            )}

                            <div className={`${styles.rewardSection} ${isCompleted ? styles.completedRewardSection : ''}`}>
                                        <span className={styles.rewardLabel}>🎁 Reward:</span>
                                        <span className={styles.rewardValue}>{milestone.rewardPoints} Points</span>
                            </div>
                            </div>
                        </SpotlightCard>
                    );
                })}
            </div>
        </div>
    );
};

export default Milestones; 