'use client';
import React, { useEffect, useState } from 'react';
import styles from './Levels.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';
import { useAchieveX } from '@/contexts/AchieveXContext';

interface Level {
    id: string;
    name: string;
    level: number;
    pointsRequired: number;
    imageUrl: string;
}

const levelIcons: { [key: string]: string } = {
    Stone: '🪨',
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Diamond: '💎',
    Ruby: '🔴',
};

const Levels = () => {
    const [levelsData, setLevelsData] = useState<Level[]>([]);
    const { profileData } = useAchieveX();

    useEffect(() => {
        const fetchLevels = async () => {
            const response = await fetch(`/api/achievex/levels`);
            const data = (await response.json()).data as Level[];
            setLevelsData(data);
        };

        fetchLevels();
    }, []);

    const getSpotlightColor = (level: Level) => {
        if (profileData?.level && profileData?.currentLevel >= level.level) return 'rgba(34, 197, 94, 0.6)' as const;
        switch (level.name) {
            case 'Bronze': return 'rgba(205, 127, 50, 0.4)' as const;
            case 'Silver': return 'rgba(192, 192, 192, 0.4)' as const;
            case 'Gold': return 'rgba(255, 215, 0, 0.4)' as const;
            case 'Diamond': return 'rgba(185, 242, 255, 0.4)' as const;
            case 'Ruby': return 'rgba(224, 17, 95, 0.4)' as const;
            default: return 'rgba(120, 113, 108, 0.4)' as const;
        }
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
                        <span className={styles.titleMain}>Level</span>
                        <span className={styles.titleAccent}>Progression</span>
                    </h2>
                    <div className={styles.titleSubtext}>
                        <span className={styles.subtextIcon}>🚀</span>
                        Climb the ranks and unlock exclusive rewards
                    </div>
                </div>
                <div className={styles.titleDecorations}>
                    <div className={styles.decoration1}></div>
                    <div className={styles.decoration2}></div>
                    <div className={styles.decoration3}></div>
                </div>
            </div>

            <div className={styles.levelsContainer}>
                {levelsData.map((level, index) => {
                    console.log("level", level);
                    let progress = 0;
                    if (profileData?.currentXP) {
                        if(profileData.currentLevel > (index + 1)) {
                            progress = 100;
                        } else if (profileData.currentLevel == (index + 1)) {
                            progress = (profileData?.currentXP - levelsData[index].pointsRequired) / (levelsData[index + 1].pointsRequired - levelsData[index].pointsRequired) * 100;
                        } else {
                            progress = 0;
                        }
                    }
                    return (
                        <SpotlightCard
                            key={level.id}
                            className={`${styles.levelCard} ${profileData?.level && profileData?.currentLevel == level.level ? styles.active : ''} ${styles[level.name.toLowerCase()]}`}
                            spotlightColor={getSpotlightColor(level)}
                        >
                            <div className={styles.levelIcon}>
                                {levelIcons[level.name] || '🏆'}
                            </div>
                            <h4>{level.name}</h4>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className={styles.progressText}>{progress.toFixed(0)}%</span>
                            {profileData?.level && (profileData?.currentLevel < index + 1) && (
                                <div className={styles.lockIcon}>🔒</div>
                            )}
                        </SpotlightCard>
                    );
                })}
            </div>
        </div>
    );
};

export default Levels; 