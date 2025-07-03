'use client';
import React, { useEffect, useState } from 'react';
import styles from './Rewards.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';
import { useAchieveX } from '@/contexts/AchieveXContext';

interface Reward {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    is_active: boolean;
}

const Rewards = () => {
    const [rewardsData, setRewardsData] = useState<Reward[]>([]);
    const { token, memberId, refetchMemberData } = useAchieveX();
    useEffect(() => {
        const fetchRewards = async () => {
            const response = await fetch(`/api/achievex/rewards`, {
                headers: {
                    'x-api-key': token,
                },
            });
            const data = (await response.json()).data as Reward[];
            setRewardsData(data);
        };

        fetchRewards();
    }, [token]);

    const handleBuyReward = async (rewardId: string) => {
        if (!memberId) {
            console.error('Member ID not found');
            return;
        }

        try {
            const response = await fetch(
                `/api/achievex/rewards/${rewardId}/claim`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': token,
                    },
                    body: JSON.stringify({
                        memberId: memberId,
                        quantity: 1,
                    }),
                }
            );

            if (response.ok) {
                console.log('Reward claimed successfully');
                refetchMemberData();
            } else {
                const errorData = await response.json();
                console.error('Failed to claim reward:', errorData);
            }
        } catch (error) {
            console.error('Error claiming reward:', error);
        }
    };

    const getSpotlightColor = () => {
        return 'rgba(34, 197, 94, 0.4)' as `rgba(${number}, ${number}, ${number}, ${number})`;
    };

    return (
        <div>
            <div className={styles.titleSection}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleIcons}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.rewardIcon1}>🎁</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.rewardIcon2}>💎</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.rewardIcon3}>🛒</span>
                        </div>
                    </div>
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>Rewards</span>
                        <span className={styles.titleAccent}>Store</span>
                    </h2>
                    <div className={styles.titleSubtext}>
                        <span className={styles.subtextIcon}>✨</span>
                        Discover amazing rewards and exclusive treasures
                    </div>
                </div>
                <div className={styles.titleDecorations}>
                    <div className={styles.decoration1}></div>
                    <div className={styles.decoration2}></div>
                    <div className={styles.decoration3}></div>
                    <div className={styles.decoration4}></div>
                    <div className={styles.decoration5}></div>
                    <div className={styles.decoration6}></div>
                </div>
            </div>

            <div className={styles.rewardsGrid}>
                {rewardsData.map(reward => (
                    <SpotlightCard
                        key={reward.id}
                        className={`${styles.rewardCard}`}
                        spotlightColor={getSpotlightColor()}
                    >
                        <div className={styles.rewardImage}>
                        </div>
                        <div className={styles.rewardContent}>
                            <h4>{reward.name}</h4>
                            <button
                                className={`${styles.buyButton}`}
                                onClick={() => handleBuyReward(reward.id)}
                            >
                                Buy for {reward.pointsCost} points
                            </button>
                        </div>
                    </SpotlightCard>
                ))}
            </div>
        </div>
    );
};

export default Rewards; 