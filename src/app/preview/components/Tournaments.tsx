'use client';
import React, { useEffect, useState } from 'react';
import styles from './Tournaments.module.css';
import SpotlightCard from '../../../components/SpotlightCard/SpotlightCard';

interface Tournament {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isTournament: boolean;
    numWinners: number | null;
    minimumLevel: number;
    participantCount: number;
}

interface TournamentsProps {
    filter: 'all' | 'started' | 'finished' | 'upcoming';
    showTitle?: boolean;
}

const getEventStatus = (event: Tournament): 'started' | 'finished' | 'upcoming' => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now >= startDate && now <= endDate) {
        return 'started';
    }
    if (now > endDate) {
        return 'finished';
    }
    return 'upcoming';
};

const Tournaments: React.FC<TournamentsProps> = ({ filter, showTitle = true }) => {
    const [tournamentsData, setTournamentsData] = useState<Tournament[]>([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            const response = await fetch(`/api/achievex/events`);
            const jsonResponse = await response.json();
            const data = jsonResponse.data as Tournament[];
            setTournamentsData(data);
        };

        fetchTournaments();
    }, []);

    const filteredTournaments = tournamentsData?.filter(t => {
        const status = getEventStatus(t);
        return filter === 'all' || status === filter;
    });

    const getSpotlightColor = (status: string) => {
        switch (status) {
            case 'started': return 'rgba(34, 197, 94, 0.4)' as const;
            case 'finished': return 'rgba(99, 102, 241, 0.4)' as const;
            case 'upcoming': return 'rgba(249, 115, 22, 0.4)' as const;
            default: return 'rgba(148, 163, 184, 0.4)' as const;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'started': return '🔥';
            case 'finished': return '✅';
            case 'upcoming': return '⏰';
            default: return '🎮';
        }
    };

    return (
        <div>
            {showTitle && (
                <div className={styles.titleSection}>
                    <div className={styles.titleContainer}>
                        <div className={styles.titleIcons}>
                            <div className={styles.iconWrapper}>
                                <span className={styles.eventIcon1}>🎮</span>
                            </div>
                            <div className={styles.iconWrapper}>
                                <span className={styles.eventIcon2}>⚡</span>
                            </div>
                            <div className={styles.iconWrapper}>
                                <span className={styles.eventIcon3}>🎯</span>
                            </div>
                        </div>
                        <h2 className={styles.title}>
                            <span className={styles.titleMain}>Gaming</span>
                            <span className={styles.titleAccent}>Events</span>
                        </h2>
                        <div className={styles.titleSubtext}>
                            <span className={styles.subtextIcon}>🔥</span>
                            Compete in thrilling tournaments and win amazing prizes
                        </div>
                    </div>
                    <div className={styles.titleDecorations}>
                        <div className={styles.decoration1}></div>
                        <div className={styles.decoration2}></div>
                        <div className={styles.decoration3}></div>
                        <div className={styles.decoration4}></div>
                    </div>
                </div>
            )}

            <div className={styles.tournamentsGrid}>
                {filteredTournaments && filteredTournaments.length > 0 && filteredTournaments.map(tournament => {
                    const status = getEventStatus(tournament);
                    return (
                        <SpotlightCard
                            key={tournament.id}
                            className={`${styles.tournamentCard} ${styles[status]}`}
                            spotlightColor={getSpotlightColor(status)}
                        >
                            <div className={styles.tournamentImage}>
                                <div className={styles.statusBadge}>
                                    {getStatusIcon(status)} {status.toUpperCase()}
                                </div>
                            </div>
                            <div className={styles.tournamentInfo}>
                                <h4>{tournament.name}</h4>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>👥 Registered:</span>
                                        <span className={styles.value}>{tournament.participantCount}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.label}>📈 Min Level:</span>
                                        <span className={styles.value}>{tournament.minimumLevel}</span>
                                    </div>
                                    {tournament.numWinners && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>🏆 Winners:</span>
                                            <span className={styles.value}>{tournament.numWinners}</span>
                                        </div>
                                    )}
                                    {status === 'upcoming' && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>🚀 Starting:</span>
                                            <span className={styles.value}>{new Date(tournament.startDate).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {status === 'started' && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>⏱️ Finishing:</span>
                                            <span className={styles.value}>{new Date(tournament.endDate).toLocaleString()}</span>
                                        </div>
                                    )}
                                    {status === 'finished' && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.label}>🏁 Finished:</span>
                                            <span className={styles.value}>{new Date(tournament.endDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SpotlightCard>
                    )
                })}
                {filteredTournaments && filteredTournaments.length === 0 && (
                    <div className={styles.noTournaments}>
                        <p>No tournaments found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tournaments; 