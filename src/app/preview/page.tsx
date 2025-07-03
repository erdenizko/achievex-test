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
import { useAchieveX } from '@/contexts/AchieveXContext';
import { useDepositMutation, useClaimMilestoneMutation, useClearMilestoneMutation, useAddPointsMutation } from '@/hooks/useAchieveXApi';
import QuickActionForm from './components/QuickActionForm';
import { Milestone } from '@/lib/types';
import { ChevronsDownIcon, ZapIcon } from 'lucide-react';
import { useEffect } from 'react';

type ActiveQuickMenu = 'settoken' | 'setMemberId' | 'deposit' | 'claim' | 'clear' | 'addDiamonds' | 'addPoints' | null;

const PreviewPage = () => {
    const [activeView, setActiveView] = useState('Overview');
    const [activeQuickMenu, setActiveQuickMenu] = useState<ActiveQuickMenu>(null);
    const [isQuickMenuVisible, setIsQuickMenuVisible] = useState(false);
    const navItems = ['Overview', 'Mini Games', 'Milestones', 'Leaderboard', 'Events', 'Levels', 'Rewards'];
    
    // User data management
    const [usernameError, setUsernameError] = useState('');
    const { profileData, token, setToken, memberId, setMemberId, getMilestones, username, setUsername } = useAchieveX();

    const [milestones, setMilestones] = useState<Milestone[]>([]);
    useEffect(() => {
        getMilestones().then((data) => {
            console.log(data);
            setMilestones(data);
        });
    }, []);

    const depositMutation = useDepositMutation(token, () => {
        console.log("Deposit successful");
        setActiveQuickMenu(null);
    });

    const claimMilestoneMutation = useClaimMilestoneMutation(token, () => {
        console.log("Milestone claimed successfully");
        setActiveQuickMenu(null);
    });

    const clearMilestoneMutation = useClearMilestoneMutation(token, () => {
        console.log("Milestone cleared successfully");
        setActiveQuickMenu(null);
    });

    const addPointsMutation = useAddPointsMutation(token, () => {
        console.log("Points added successfully");
        setActiveQuickMenu(null);
    });

    const handleDeposit = (amount: number) => {
        if (memberId) {
            console.log("Deposit amount: ", amount);
            depositMutation.mutate({ memberId: memberId, amount, integrationKey: 'deposit_succeeded' }); 
        }
    };

    const handleClaimMilestone = (milestoneId: string) => {
        if (memberId) {
            claimMilestoneMutation.mutate({ memberId: memberId, milestoneId });
        }
    };

    const handleClearMilestone = () => {
        if (memberId) {
            clearMilestoneMutation.mutate({ memberId: memberId });
        }
    };

    const handleAddPoints = (amount: number) => {
        if (memberId) {
            addPointsMutation.mutate({ memberId: memberId, amount });
        }
    };

    // User profile data - now dynamic based on userData
    const userProfile = {
        name: username || 'GUEST',
        level: profileData?.level || 'Stone',
        currentLevel: profileData?.currentLevel || 1,
        currentLevelMinXP: profileData?.currentLevelMinXP || 0,
        currentXP: profileData?.currentXP || 0,
        nextLevelXP: profileData?.nextLevelXP || 500,
        totalPoints: profileData?.totalPoints || 0,
        rank: profileData?.rank || 0,
    };

    const generateUUID = (): string => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
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
        setMemberId(generateUUID());
        setUsername(trimmedUsername);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        // Clear error when user starts typing
        if (usernameError) {
            setUsernameError('');
        }
    };

    const handleSetToken = (token: string) => {
        setToken(token);
        localStorage.setItem('achieveXToken', token);
        setActiveQuickMenu(null);
    }

    const handleSetMemberId = (memberId: string) => {
        setMemberId(memberId);
        localStorage.setItem('achieveXMemberId', memberId);
        setActiveQuickMenu(null);
    }

    const renderContent = () => {
        switch (activeView) {
            case 'Overview':
                return <Overview setActiveView={setActiveView} />;
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
        const value = ((userProfile.currentXP - userProfile.currentLevelMinXP) / (userProfile.nextLevelXP - userProfile.currentLevelMinXP)) * 100;
        return value > 100 ? 100 : value;
    };

    return (
        <>
            {/* Username Modal - shows only when user data is not available */}
            <Dialog open={!memberId} modal>
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
                                        {userProfile.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.userInfo}>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', justifyContent: 'space-between', width: '100%', marginBottom: '10px', padding: '6px 16px', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px'}}>
                                    <h3 className={styles.username}>{userProfile.name} </h3>
                                    <span className={styles.diamonds}>{Math.round(userProfile.totalPoints)} Points</span>
                                </div>
                                <div className={styles.levelBadge}>Level: {userProfile.level}</div>
                            </div>

                            <div className={styles.progressSection}>
                                <div className={styles.progressHeader}>
                                    <span className={styles.progressLabel}>Level Progress</span>
                                    <span className={styles.progressStats}>
                                        {Math.round(userProfile.currentXP)} / {Math.round(userProfile.nextLevelXP)} XP
                                    </span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${getProgressPercentage()}%` }}
                                    ></div>
                                    <div className={styles.progressGlow}></div>
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
                    <div className={styles.quickMenuContainer}>
                        {isQuickMenuVisible ? (
                            <div className={styles.quickMenu}>
                                <div className={styles.quickMenuHeader}>
                                    <div className={styles.title}>Quick Menu</div>
                                    <button 
                                        onClick={() => {
                                            setIsQuickMenuVisible(false);
                                            setActiveQuickMenu(null);
                                        }} 
                                        className={styles.closeQuickMenuButton}
                                    >
                                        <ChevronsDownIcon />
                                    </button>
                                </div>
                                <div style={{marginBottom: '16px', fontSize: '10px', padding: '16px', background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px'}}>
                                    <strong style={{color: 'white'}}>Member ID:</strong> <span style={{color: 'gray'}}>{memberId}</span>
                                    <br />
                                    <strong style={{color: 'white'}}>Token:</strong> <span style={{color: 'gray'}}>{token}</span>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {activeQuickMenu === 'deposit' ? (
                                        <QuickActionForm
                                            title="Deposit"
                                            actionLabel="Deposit"
                                            inputType="number"
                                            placeholder="Enter Amount..."
                                            onSubmit={(value) => handleDeposit(value as number)}
                                            isLoading={depositMutation.isPending}
                                            onCancel={() => setActiveQuickMenu(null)}
                                        />
                                    ) : activeQuickMenu === null && (
                                        <button className={styles.outlineButton} onClick={() => setActiveQuickMenu('deposit')}>Deposit</button>
                                    )}

                                    {activeQuickMenu === 'claim' ? (
                                        <QuickActionForm
                                            title="Claim Milestone"
                                            actionLabel="Claim"
                                            inputType="select"
                                            selectOptions={milestones.map((m: Milestone) => ({ value: m.id, label: m.name }))}
                                            onSubmit={(value) => handleClaimMilestone(value as string)}
                                            isLoading={claimMilestoneMutation.isPending}
                                            onCancel={() => setActiveQuickMenu(null)}
                                        />
                                    ) : activeQuickMenu === null && (
                                        <button className={styles.outlineButton}  onClick={() => setActiveQuickMenu('claim')}>Claim Milestone</button>
                                    )}

                                    {activeQuickMenu === null && (
                                        <button className={styles.outlineButton}  onClick={() => handleClearMilestone()}>Clear Member&apos;s Progress</button>
                                    )}

                                    {activeQuickMenu === 'addPoints' ? (
                                        <QuickActionForm
                                            title="Add Points"
                                            actionLabel="Add"
                                            inputType="number"
                                            onSubmit={(value) => handleAddPoints(value as number)}
                                            isLoading={addPointsMutation.isPending}
                                            onCancel={() => setActiveQuickMenu(null)}
                                        />
                                    ) : activeQuickMenu === null && (
                                        <button className={styles.outlineButton} onClick={() => setActiveQuickMenu('addPoints')}>Add XP & Points</button>
                                    )}


                                    {activeQuickMenu === 'settoken' ? (
                                        <QuickActionForm
                                            title="Set Token"
                                            actionLabel="Save"
                                            inputType="text"
                                            placeholder="Enter Token..."
                                            onSubmit={(value) => handleSetToken(value as string)}
                                            isLoading={claimMilestoneMutation.isPending}
                                            onCancel={() => setActiveQuickMenu(null)}
                                        />
                                    ) : activeQuickMenu === null && (
                                        <button onClick={() => setActiveQuickMenu('settoken')}>Set Token</button>
                                    )}


                                    {activeQuickMenu === 'setMemberId' ? (
                                        <QuickActionForm
                                            title="Set Member ID"
                                            actionLabel="Save"
                                            inputType="text"
                                            placeholder="Enter Member ID..."
                                            onSubmit={(value) => handleSetMemberId(value as string)}
                                            isLoading={claimMilestoneMutation.isPending}
                                            onCancel={() => setActiveQuickMenu(null)}
                                        />
                                    ) : activeQuickMenu === null && (
                                        <button onClick={() => setActiveQuickMenu('setMemberId')}>Set Member ID</button>
                                    )}
                                    {activeQuickMenu === null && (
                                        <button onClick={() => {
                                            setToken(process.env.NEXT_PUBLIC_ACHIEVEX_DEMO_TOKEN || "");
                                            setMemberId(generateUUID());
                                            setActiveQuickMenu(null);
                                        }}>Revert to Demo Token & Member ID</button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsQuickMenuVisible(true)} 
                                className={styles.openQuickMenuButton}
                            >
                                <ZapIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PreviewPage;