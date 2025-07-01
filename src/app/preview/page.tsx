'use client';
import React, { useState } from 'react';
import styles from './preview.module.css';
import Rewards from './components/Rewards';
import Levels from './components/Levels';
import Milestones from './components/Milestones';
import Leaderboard from './components/Leaderboard';
import Overview from './components/Overview';
import Tournaments from './components/Tournaments';
import MiniGames from './components/MiniGames';

const PreviewPage = () => {
    const [activeView, setActiveView] = useState('Overview');
    const navItems = ['Overview', 'Mini Games', 'Milestones', 'Leaderboard', 'Events', 'Levels', 'Rewards'];

    // User profile data
    const userProfile = {
        name: 'ERDENIZ',
        level: 'Stone',
        currentLevel: 1,
        currentXP: 340,
        nextLevelXP: 500,
        totalPoints: 1250,
        rank: 15
    };

    const renderContent = () => {
        switch (activeView) {
            case 'Overview':
                return <Overview />;
            case 'Milestones':
                return <Milestones />;
            case 'Leaderboard':
                return <Leaderboard />;
            case 'Events':
                return <Tournaments filter="all" />;
            case 'Levels':
                return <Levels />;
            case 'Rewards':
                return <Rewards />;
            case 'Mini Games':
                return <MiniGames />;
            default:
                return <div>Overview Content</div>;
        }
    };

    const getProgressPercentage = () => {
        return (userProfile.currentXP / userProfile.nextLevelXP) * 100;
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <div className={styles.profile}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}>
                                <span className={styles.avatarText}>
                                    {userProfile.name.charAt(0)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.userInfo}>
                            <h3 className={styles.username}>{userProfile.name}</h3>
                            <div className={styles.levelBadge}>Level: {userProfile.level}</div>
                        </div>

                        <div className={styles.progressSection}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Level Progress</span>
                                <span className={styles.progressStats}>
                                    {userProfile.currentXP}/{userProfile.nextLevelXP} XP
                                </span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                                <div className={styles.progressGlow}></div>
                            </div>
                            <div className={styles.nextLevelInfo}>
                                {userProfile.nextLevelXP - userProfile.currentXP} XP to next level
                            </div>
                        </div>
                    </div>
                    <nav className={styles.nav}>
                        <ul>
                            {navItems.map(item => (
                                <li
                                    key={item}
                                    className={activeView === item ? styles.active : ''}
                                    onClick={() => setActiveView(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <main className={styles.mainContent}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default PreviewPage;