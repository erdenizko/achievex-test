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
import { useUserData } from '@/hooks/useUserData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PreviewPage = () => {
    const [activeView, setActiveView] = useState('Overview');
    const navItems = ['Overview', 'Mini Games', 'Milestones', 'Leaderboard', 'Events', 'Levels', 'Rewards'];
    
    // User data management
    const { userData, isLoading, saveUserData, hasUserData } = useUserData();
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');

    // User profile data - now dynamic based on userData
    const userProfile = {
        name: userData?.username || 'GUEST',
        level: 'Stone',
        currentLevel: 1,
        currentXP: 340,
        nextLevelXP: 500,
        totalPoints: 1250,
        rank: 15
    };

    // Handle username submission
    const handleUsernameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedUsername = username.trim();
        
        if (!trimmedUsername) {
            setUsernameError('Username is required');
            return;
        }
        
        if (trimmedUsername.length < 2) {
            setUsernameError('Username must be at least 2 characters long');
            return;
        }
        
        if (trimmedUsername.length > 20) {
            setUsernameError('Username must be less than 20 characters long');
            return;
        }
        
        // Clear any previous errors and save the user data
        setUsernameError('');
        saveUserData(trimmedUsername);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        // Clear error when user starts typing
        if (usernameError) {
            setUsernameError('');
        }
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
        <>
            {/* Username Modal - shows only when user data is not available */}
            <Dialog open={!isLoading && !hasUserData} modal>
                <DialogContent 
                    className="sm:max-w-md"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl font-bold">
                            Welcome to AchieveX!
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            Please enter a username to get started with your gamified experience.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleUsernameSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={handleUsernameChange}
                                className={usernameError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                autoFocus
                            />
                            {usernameError && (
                                <p className="text-sm text-red-500">{usernameError}</p>
                            )}
                        </div>
                        
                        <div className="flex justify-center pt-4">
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={!username.trim()}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Main Preview Page Content */}
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
                                {userData && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        ID: {userData.id.slice(0, 8)}...
                                    </div>
                                )}
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
        </>
    );
};

export default PreviewPage;