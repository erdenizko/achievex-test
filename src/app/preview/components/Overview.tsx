'use client';
import React, { useState } from 'react';
import styles from './Overview.module.css';
import Tournaments from './Tournaments';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';

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
        reward: 50,
        icon: '🧠',
        players: 1234
    },
    {
        id: 2,
        title: 'Spin the Wheel',
        description: 'Spin for a chance to win amazing prizes',
        type: 'Luck',
        difficulty: 'easy',
        reward: 100,
        icon: '🎰',
        players: 5678
    },
    {
        id: 4,
        title: 'Number Puzzle',
        description: 'Solve mathematical puzzles to earn points',
        type: 'Math',
        difficulty: 'hard',
        reward: 150,
        icon: '🔢',
        players: 987
    },
];

const Overview = () => {
    const [activeTab] = useState<'all' | 'started' | 'finished'>('all');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGame(null);
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
                        <button className={styles.playNowButton}>
                            <span className={styles.buttonIcon}>🚀</span>
                            Start Playing Now
                            <div className={styles.buttonShine}></div>
                        </button>
                        <button className={styles.bonusButton}>
                            <span className={styles.buttonIcon}>🎁</span>
                            Claim Daily Bonus
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
                                    <h4 className={styles.gameTitle}>{game.title}</h4>
                                    <p className={styles.gameDescription}>{game.description}</p>
                                    <div className={styles.gameStats}>
                                        <div className={styles.statItem}>
                                            <span className={styles.statIcon}>🏷️</span>
                                            <span className={styles.statValue}>{game.type}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statIcon}>💎</span>
                                            <span className={styles.statValue}>{game.reward} pts</span>
                                        </div>
                                    </div>
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
                                        <p>Game will load here...</p>
                                        <div className={styles.loadingSpinner}></div>
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
                                        <span>{selectedGame.reward} points</span>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>Players:</span>
                                        <span>{selectedGame.players.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={`${styles.startGameButton} ${styles[`${selectedGame.difficulty}Button`]}`}>
                                        🚀 Start Game
                                    </button>
                                    <button className={styles.watchAdButton}>
                                        📺 Watch Ad for 2x Rewards
                                    </button>
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