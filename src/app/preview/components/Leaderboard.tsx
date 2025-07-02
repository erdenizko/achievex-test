'use client';
import React, { useEffect, useState } from 'react';
import styles from './Leaderboard.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';
import { useUserData } from '@/hooks/useUserData';

interface LeaderboardEntry {
    rank: number;
    user: string;
    level: string;
    score: number;
    avatar?: string;
    userId: string;
    currentLevel: number;
}

interface Member {
    id: string;
    externalId: string;
    totalPoints: number;
    currentLevel: string;
}

const dummyUserNames = [
    'John Doe',
    'Jane Smith',
    'Alice Johnson',
    'Bob Brown',
    'Charlie Davis',
    'Diana White',
    'Ethan Green',
    'Fiona Black',
    'George White',
    'Hannah Brown',
    'Isaac Davis',
    'Julia Green',
    'Kevin White',
    'Liam Black',
    'Mia White',
    'Noah Green',
    'Olivia Black',
    'Patrick White',
    'Quinn Brown',
    'Ryan Davis',
    'Sophia Green',
]

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const { userData } = useUserData();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch('/api/achievex/members?sortBy=totalPoints');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const json = await response.json();
                const members: Member[] = json.data || [];
                const formattedData = members.map((member, index) => ({
                    rank: index + 1,
                    user: dummyUserNames[index],
                    level: member.currentLevel,
                    score: member.totalPoints,
                    userId: member.externalId,
                    currentLevel: parseInt(member.currentLevel)
                }));
                setLeaderboardData(formattedData);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    const getSpotlightColor = (rank: number) => {
        switch (rank) {
            case 1: return 'rgba(255, 215, 0, 0.6)'; // Gold
            case 2: return 'rgba(192, 192, 192, 0.6)'; // Silver  
            case 3: return 'rgba(205, 127, 50, 0.6)'; // Bronze
            default: return 'rgba(79, 70, 229, 0.4)'; // Default
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '👑';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🏆';
        }
    };

    const getLevelColor = (level: number) => {
        switch (level) {
            case 1: return '#b9f2ff';
            case 2: return '#e0115f';
            case 3: return '#ffd700';
            case 4: return '#c0c0c0';
            case 5: return '#cd7f32';
            default: return '#94a3b8';
        }
    };

    return (
        <div>
            <div className={styles.titleSection}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleIcons}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.leaderIcon1}>👑</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.leaderIcon2}>🏅</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.leaderIcon3}>🎖️</span>
                        </div>
                    </div>
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>Daily</span>
                        <span className={styles.titleAccent}>Leaderboard</span>
                    </h2>
                    <div className={styles.titleSubtext}>
                        <span className={styles.subtextIcon}>⚡</span>
                        Rise to the top and claim your rightful throne
                    </div>
                </div>
                <div className={styles.titleDecorations}>
                    <div className={styles.decoration1}></div>
                    <div className={styles.decoration2}></div>
                    <div className={styles.decoration3}></div>
                    <div className={styles.decoration4}></div>
                    <div className={styles.decoration5}></div>
                </div>
            </div>

            <div className={styles.leaderboardContainer}>
                {leaderboardData.map((entry) => (
                    <SpotlightCard
                        key={entry.rank}
                        className={`${styles.leaderboardCard} ${entry.rank <= 3 ? styles.topThree : ''} ${styles[`rank${entry.rank}`]}`}
                        spotlightColor={getSpotlightColor(entry.rank)}
                    >
                        <div className={styles.rankSection}>
                            <div className={styles.rankBadge}>
                                <span className={styles.rankIcon}>{getRankIcon(entry.rank)}</span>
                                <span className={styles.rankNumber}>#{entry.rank}</span>
                            </div>
                        </div>

                        <div className={styles.userSection}>
                            <div className={styles.userAvatar}>
                                <span className={styles.avatarText}>
                                    {entry.user.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.username}>{entry.userId === userData?.id ? userData.username + " (You)" : entry.user}</div>
                            </div>
                        </div>

                        <div className={styles.scoreSection}>
                            <div className={styles.scoreValue}>{entry.score}</div>
                            <div className={styles.scoreLabel}>pts</div>
                        </div>

                        {entry.rank <= 3 && (
                            <div className={styles.crownEffect}></div>
                        )}
                    </SpotlightCard>
                ))}
            </div>

            <div className={styles.prizesSection}>
                <h3>🎁 Daily Prizes</h3>
                <div className={styles.prizesList}>
                    <div className={styles.prizeItem}>
                        <span className={styles.prizeRank}>🥇 1st</span>
                        <span className={styles.prizeValue}>100 Pts</span>
                    </div>
                    <div className={styles.prizeItem}>
                        <span className={styles.prizeRank}>🥈 2nd</span>
                        <span className={styles.prizeValue}>75 Pts</span>
                    </div>
                    <div className={styles.prizeItem}>
                        <span className={styles.prizeRank}>🥉 3rd</span>
                        <span className={styles.prizeValue}>50 Pts</span>
                    </div>
                    <div className={styles.prizeItem}>
                        <span className={styles.prizeRank}>4th</span>
                        <span className={styles.prizeValue}>25 Pts</span>
                    </div>
                    <div className={styles.prizeItem}>
                        <span className={styles.prizeRank}>5th</span>
                        <span className={styles.prizeValue}>10 Pts</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard; 