'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import ClientGuard from '@/components/ClientGuard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import apiClient from '@/lib/api/client';
import { User } from '@/lib/types';
import {
    UserGroupIcon,
    TrophyIcon,
    UserPlusIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function FriendsPage() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'leaderboard'>('leaderboard');
    const [friends, setFriends] = useState<User[]>([]);
    const [requests, setRequests] = useState<User[]>([]);
    const [leaderboard, setLeaderboard] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [friendsData, requestsData, leaderboardData] = await Promise.all([
                apiClient.getFriends(),
                apiClient.getPendingFriendRequests(),
                apiClient.getLeaderboard()
            ]);

            setFriends(friendsData);
            setRequests(requestsData);
            setLeaderboard(leaderboardData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAcceptRequest = async (userId: string) => {
        try {
            await apiClient.acceptFriendRequest(userId);
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Failed to accept request:', err);
        }
    };

    const handleDeclineRequest = async (userId: string) => {
        try {
            await apiClient.declineFriendRequest(userId);
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Failed to decline request:', err);
        }
    };

    const handleSendRequest = async (userId: string) => {
        try {
            await apiClient.sendFriendRequest(userId);
            alert('Friend request sent!');
            // Optimistically update UI or refresh? Refreshing for now to be safe
            fetchData();
        } catch (err: any) {
            console.error('Failed to send request:', err);
            const errorMessage = err?.response?.data?.error || 'Failed to send friend request. Please try again.';
            alert(errorMessage);
        }
    };

    const handleRemoveFriend = async (userId: string) => {
        if (!confirm('Are you sure you want to remove this friend?')) {
            return;
        }
        try {
            await apiClient.removeFriend(userId);
            alert('Friend removed successfully!');
            fetchData(); // Refresh data
        } catch (err: any) {
            console.error('Failed to remove friend:', err);
            const errorMessage = err?.response?.data?.error || 'Failed to remove friend. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <ClientGuard>
            <Sidebar>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Social Hub</h1>
                        <p className="text-muted-foreground">Connect with friends and compete on the leaderboard.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-2 border-b">
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'leaderboard'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <TrophyIcon className="h-5 w-5" />
                                Leaderboard
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'friends'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <UserGroupIcon className="h-5 w-5" />
                                My Friends ({friends.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'requests'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <UserPlusIcon className="h-5 w-5" />
                                Requests ({requests.length})
                            </div>
                        </button>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-error text-center py-12">{error}</div>
                    ) : (
                        <div className="space-y-6">

                            {/* Leaderboard Tab */}
                            {activeTab === 'leaderboard' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Global Leaderboard</CardTitle>
                                        <CardDescription>Top players ranked by XP</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {leaderboard.map((user, index) => (
                                                <div key={user._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-secondary text-muted-foreground'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                            {user.avatar ? (
                                                                <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                                                            ) : (
                                                                user.name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">{user.name}</p>
                                                            <p className="text-sm text-muted-foreground">Level {user.level}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right mr-4">
                                                            <p className="font-bold text-foreground">{user.xp} XP</p>
                                                        </div>
                                                        {/* Don't show add button for self or existing friends (simplified check) */}
                                                        {/* Don't show add button for self */}
                                                        {currentUser?._id !== user._id && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleSendRequest(user._id)}
                                                            >
                                                                <UserPlusIcon className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Friends Tab */}
                            {activeTab === 'friends' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {friends.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-muted-foreground">
                                            No friends yet. Check the leaderboard to find people!
                                        </div>
                                    ) : (
                                        friends.map((friend) => (
                                            <Card key={friend._id}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                                                {friend.avatar ? (
                                                                    <img src={friend.avatar} alt={friend.name} className="h-12 w-12 rounded-full object-cover" />
                                                                ) : (
                                                                    friend.name.charAt(0)
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">{friend.name}</p>
                                                                <p className="text-sm text-muted-foreground">{friend.email}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-error hover:text-error hover:bg-error/10 border-error/20"
                                                            onClick={() => handleRemoveFriend(friend._id)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Requests Tab */}
                            {activeTab === 'requests' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Friend Requests</CardTitle>
                                        <CardDescription>People who want to connect with you</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {requests.length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                No pending friend requests.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {requests.map((request) => (
                                                    <div key={request._id} className="flex items-center justify-between p-4 rounded-lg border">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {request.avatar ? (
                                                                    <img src={request.avatar} alt={request.name} className="h-10 w-10 rounded-full object-cover" />
                                                                ) : (
                                                                    request.name.charAt(0)
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">{request.name}</p>
                                                                <p className="text-sm text-muted-foreground">wants to be your friend</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                className="bg-success hover:bg-success/90"
                                                                onClick={() => handleAcceptRequest(request._id)}
                                                            >
                                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-error hover:text-error hover:bg-error/10 border-error/20"
                                                                onClick={() => handleDeclineRequest(request._id)}
                                                            >
                                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </Sidebar>
        </ClientGuard>
    );
}
