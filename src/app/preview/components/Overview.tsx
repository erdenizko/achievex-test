'use client';
import React, { useState, useEffect } from 'react';
import styles from './Overview.module.css';
import Tournaments from './Tournaments';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';
import { useAchieveX } from '@/contexts/AchieveXContext';

interface Game {
    id: number;
    title: string;
    description: string;
    type: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reward: number;
    icon: string;
    players: number;
}

const featuredGames: Game[] = [
    {
        id: 1,
        title: 'Memory Match',
        description: 'Test your memory skills by matching pairs of cards',
        type: 'Puzzle',
        difficulty: 'easy',
        reward: 1000,
        icon: '🧠',
        players: 1234
    },
    {
        id: 2,
        title: 'Spin the Wheel',
        description: 'Spin for a chance to win amazing prizes',
        type: 'Luck',
        difficulty: 'easy',
        reward: 1000,
        icon: '🎰',
        players: 5678
    },
    {
        id: 3,
        title: 'Word Hunt',
        description: 'Find hidden words in the letter grid',
        type: 'Word',
        difficulty: 'medium',
        reward: 5000,
        icon: '📝',
        players: 2341
    },
];

const Overview = ({ setActiveView }: { setActiveView: (view: string) => void }) => {
    const [activeTab] = useState<'all' | 'started' | 'finished'>('all');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { token, refetchProfileData, memberId, refetchMemberMilestoneData } = useAchieveX();
    const [isBonusClaimed, setIsBonusClaimed] = useState(false);
    const [isClaimingBonus, setIsClaimingBonus] = useState(false);

    useEffect(() => {
        const bonusClaimed = localStorage.getItem('dailyBonusClaimed');
        if (bonusClaimed === 'true') {
            setIsBonusClaimed(true);
        }
    }, []);

    const getSpotlightColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'rgba(34, 197, 94, 0.4)';
            case 'medium': return 'rgba(249, 115, 22, 0.4)';
            case 'hard': return 'rgba(239, 68, 68, 0.4)';
            default: return 'rgba(79, 70, 229, 0.4)';
        }
    };

    const openGameModal = (game: Game) => {
        setSelectedGame(game);
        setIsModalOpen(true);
        setGameResult(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGame(null);
        setGameResult(null);
        setIsProcessing(false);
    };

    const handleGameResult = async (result: 'win' | 'lose') => {
        if (!selectedGame || isProcessing) return;
        
        setGameResult(result);
        
        if (result === 'win') {
            setIsProcessing(true);
            try {
                console.log("memberId", memberId);
                const response = await fetch('/api/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': token || process.env.NEXT_PUBLIC_ACHIEVEX_DEMO_TOKEN || ''
                    },
                    body: JSON.stringify({
                        integrationKey: 'transaction_added',
                        memberId: memberId,
                        points: selectedGame.reward
                    })
                });

                if (response.ok) {
                    refetchProfileData();
                    refetchMemberMilestoneData();
                } else {
                    console.error('Failed to process game result');
                }
            } catch (error) {
                console.error('Error processing game result:', error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleClaimBonus = async () => {
        if (isClaimingBonus || isBonusClaimed) return;

        setIsClaimingBonus(true);
        try {
            const response = await fetch('/api/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': token || process.env.NEXT_PUBLIC_ACHIEVEX_DEMO_TOKEN || ''
                },
                body: JSON.stringify({
                    integrationKey: 'claim_bonus',
                    memberId: memberId,
                })
            });

            if (response.ok) {
                refetchProfileData();
                setIsBonusClaimed(true);
                localStorage.setItem('dailyBonusClaimed', 'true');
            } else {
                console.error('Failed to claim daily bonus');
            }
        } catch (error) {
            console.error('Error claiming daily bonus:', error);
        } finally {
            setIsClaimingBonus(false);
        }
    };

    return (
        <div>
            {/* Welcome Banner */}
            <div className={styles.welcomeBanner}>
                <div className={styles.bannerBackground}>
                    <div className={styles.bannerDecorations}>
                        <div className={styles.bannerChip1}>🎰</div>
                        <div className={styles.bannerChip2}>🃏</div>
                        <div className={styles.bannerChip3}>💎</div>
                        <div className={styles.bannerChip4}>🎲</div>
                        <div className={styles.bannerChip5}>🍀</div>
                        <div className={styles.bannerChip6}>⭐</div>
                    </div>
                    <div className={styles.bannerGlow}></div>
                </div>
                <div className={styles.bannerContent}>
                    <div className={styles.bannerHeader}>
                        <div className={styles.casinoIcon}>🎰</div>
                        <h1 className={styles.bannerTitle}>
                            <span className={styles.welcomeText}>Welcome to</span>
                            <span className={styles.casinoText}>AchieveX PLAYGROUND</span>
                        </h1>
                        <div className={styles.casinoIcon}>🎰</div>
                    </div>
                    <p className={styles.bannerSubtitle}>
                        🌟 Where Every Spin, Game & Challenge Leads to Amazing Rewards! 🌟
                    </p>
                    <div className={styles.bannerStats}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🏆</div>
                            <div className={styles.statValue}>12,456</div>
                            <div className={styles.statLabel}>Active Players</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>💰</div>
                            <div className={styles.statValue}>₹2.8M</div>
                            <div className={styles.statLabel}>Total Winnings</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🎯</div>
                            <div className={styles.statValue}>987</div>
                            <div className={styles.statLabel}>Games Available</div>
                        </div>
                    </div>
                    <div className={styles.bannerActions}>
                        <button className={styles.playNowButton} onClick={() => setActiveView('Mini Games')}>
                            <span className={styles.buttonIcon}>🚀</span>
                            Start Playing Now
                            <div className={styles.buttonShine}></div>
                        </button>
                        <button
                            className={`${styles.bonusButton} ${isBonusClaimed ? styles.bonusClaimedButton : ''}`}
                            onClick={handleClaimBonus}
                            disabled={isBonusClaimed || isClaimingBonus}
                        >
                            <span className={styles.buttonIcon}>🎁</span>
                            {isClaimingBonus ? 'Claiming...' : isBonusClaimed ? 'Bonus Claimed' : 'Claim Daily Bonus'}
                        </button>
                    </div>
                    <div className={styles.liveIndicator}>
                        <div className={styles.liveDot}></div>
                        <span>🔴 LIVE - 3,247 players online now!</span>
                    </div>
                </div>
            </div>

            {/* Featured Mini Games Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleIcon}>🎮</span>
                        Featured Mini Games
                    </h2>
                    <p className={styles.sectionSubtitle}>Quick games to earn points and have fun</p>
                </div>
                <div className={styles.gamesGrid}>
                    {featuredGames.map(game => (
                        <div key={game.id} onClick={() => openGameModal(game)} className={styles.gameCardWrapper}>
                            <SpotlightCard
                                className={`${styles.gameCard} ${styles[game.difficulty]}`}
                                spotlightColor={getSpotlightColor(game.difficulty)}
                            >
                                <div className={styles.gameHeader}>
                                    <div className={styles.gameIcon}>{game.icon}</div>
                                    <div className={styles.difficultyBadge}>
                                        {game.difficulty.toUpperCase()}
                                    </div>
                                </div>
                                <div className={styles.gameContent}>
                                    <div className={styles.topContainerGameCard}>
                                        <h4 className={styles.gameTitle}>{game.title}</h4>
                                        <div className={styles.statItem}>
                                            <span className={styles.gameCardStatIcon}>🏷️</span>
                                            <span className={styles.statValue}>{game.type}</span>
                                        </div>
                                    </div>
                                    <p className={styles.gameDescription}>{game.description}</p>
                                    <button className={`${styles.playButton} ${styles[`${game.difficulty}Button`]}`}>
                                        🎮 Play & Earn {game.reward / 100} points
                                    </button>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tournaments Section */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <span className={styles.titleIcon}>🏆</span>
                        Live Tournaments
                    </h2>
                    <p className={styles.sectionSubtitle}>Compete with others and win amazing prizes</p>
                </div>
                <Tournaments showTitle={false} filter={activeTab} />
            </div>

            {/* Game Modal */}
            {isModalOpen && selectedGame && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalGameIcon}>{selectedGame.icon}</div>
                            <h3 className={styles.modalTitle}>{selectedGame.title}</h3>
                            <button className={styles.closeButton} onClick={closeModal}>✕</button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.gamePreview}>
                                <div className={styles.gameScreen}>
                                    <div className={styles.gameScreenContent}>
                                        <div className={styles.gameScreenIcon}>{selectedGame.icon}</div>
                                        <div className={styles.gameScreenDescription}>{selectedGame.description}</div>
                                        {gameResult ? (
                                            <div className={styles.gameResultContainer}>
                                                <div className={`${styles.gameResult} ${styles[gameResult]}`}>
                                                    {gameResult === 'win' ? '🎉 You Won!' : '😔 You Lost!'}
                                                </div>
                                                {gameResult === 'win' && isProcessing && (
                                                    <div className={styles.processingMessage}>
                                                        Processing reward...
                                                    </div>
                                                )}
                                                {gameResult === 'win' && !isProcessing && (
                                                    <div className={styles.rewardMessage}>
                                                        {selectedGame.reward / 100} points earned!
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}

                                        <div className={styles.modalActions}>
                                            {!gameResult ? (
                                                <>
                                                    <button 
                                                        className={`${styles.gameResultButton} ${styles.winButton}`}
                                                        onClick={() => handleGameResult('win')}
                                                        disabled={isProcessing}
                                                    >
                                                        🏆 Win
                                                    </button>
                                                    <button 
                                                        className={`${styles.gameResultButton} ${styles.loseButton}`}
                                                        onClick={() => handleGameResult('lose')}
                                                        disabled={isProcessing}
                                                    >
                                                        😞 Lose
                                                    </button>
                                                </>
                                            ) : (
                                                <button 
                                                    className={`${styles.playAgainButton} ${styles[`${selectedGame.difficulty}Button`]}`}
                                                    onClick={() => setGameResult(null)}
                                                >
                                                    🎮 Play Again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.gameInfo}>
                                <p className={styles.gameDescription}>{selectedGame.description}</p>
                                <div className={styles.gameDetails}>
                                    <div className={styles.detailRow}>
                                        <span>Type:</span>
                                        <span>{selectedGame.type}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Difficulty:</span>
                                        <span className={styles[selectedGame.difficulty]}>{selectedGame.difficulty}</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Reward:</span>
                                        <span>{selectedGame.reward / 100} points</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Players:</span>
                                        <span>{selectedGame.players.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview; 