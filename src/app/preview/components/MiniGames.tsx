import React, { useState } from 'react';
import styles from './MiniGames.module.css';
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

const gamesData: Game[] = [
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
        id: 3,
        title: 'Word Hunt',
        description: 'Find hidden words in the letter grid',
        type: 'Word',
        difficulty: 'medium',
        reward: 75,
        icon: '📝',
        players: 2341
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
    {
        id: 5,
        title: 'Color Match',
        description: 'Match colors in sequence as fast as you can',
        type: 'Reaction',
        difficulty: 'medium',
        reward: 80,
        icon: '🎨',
        players: 3456
    },
    {
        id: 6,
        title: 'Treasure Hunt',
        description: 'Navigate through mazes to find hidden treasures',
        type: 'Adventure',
        difficulty: 'hard',
        reward: 200,
        icon: '💰',
        players: 1876
    },
];

const MiniGames = () => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
                const response = await fetch('/api/process', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.NEXT_PUBLIC_ACHIEVEX_DEMO_TOKEN || ''
                    },
                    body: JSON.stringify({
                        integrationKey: 'play_a_game',
                        memberId: '1234567890',
                        gameid: selectedGame.id,
                        points: selectedGame.reward
                    })
                });

                if (response.ok) {
                    console.log('Game result processed successfully');
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

    return (
        <div>
            <div className={styles.titleSection}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleIcons}>
                        <div className={styles.iconWrapper}>
                            <span className={styles.gameIcon1}>🎮</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.gameIcon2}>🎯</span>
                        </div>
                        <div className={styles.iconWrapper}>
                            <span className={styles.gameIcon3}>🎲</span>
                        </div>
                    </div>
                    <h2 className={styles.title}>
                        <span className={styles.titleMain}>Mini</span>
                        <span className={styles.titleAccent}>Games</span>
                    </h2>
                    <div className={styles.titleSubtext}>
                        <span className={styles.subtextIcon}>🚀</span>
                        Challenge yourself with fun and rewarding mini games
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

            <div className={styles.gamesGrid}>
                {gamesData.map(game => (
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
                                        <span className={styles.statIcon}>👥</span>
                                        <span className={styles.statValue}>{game.players.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className={`${styles.playButton} ${styles[`${game.difficulty}Button`]}`}>
                                    🎮 Play & Earn {game.reward} pts
                                </button>
                            </div>
                        </SpotlightCard>
                    </div>
                ))}
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
                                                        +100 points earned!
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <p>Game will load here...</p>
                                                <div className={styles.loadingSpinner}></div>
                                            </>
                                        )}
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
                </div>
            )}
        </div>
    );
};

export default MiniGames; 