import React, { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { FaBell, FaTimes, FaHeart, FaComment } from 'react-icons/fa';

const NotificationDropdown = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);

    const fetchNotifications = useCallback(async (showLoading = true) => {
        if (!userId) return;
        
        try {
            if (showLoading) {
                setIsLoading(true);
            }
            const data = await notificationService.getNotifications(userId);
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    }, [userId]);

    // Initial fetch
    useEffect(() => {
        if (userId) {
            fetchNotifications(true);
        }
    }, [userId, fetchNotifications]);

    // Setup polling
    useEffect(() => {
        if (userId && isOpen) {
            const pollInterval = setInterval(() => {
                setIsPolling(true);
                fetchNotifications(false).finally(() => {
                    setIsPolling(false);
                });
            }, 100); // Poll every 5 seconds

            return () => clearInterval(pollInterval);
        }
    }, [userId, isOpen, fetchNotifications]);

    const handleClearNotifications = async () => {
        try {
            await notificationService.clearNotifications(userId);
            setNotifications([]);
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const formatNotification = (notification) => {
        // Check if it's a reaction notification
        if (notification.includes('reacted to your post with')) {
            const [username, reaction] = notification.split(' reacted to your post with ');
            return (
                <div className="flex items-center space-x-2">
                    <FaHeart className="text-red-500 w-4 h-4" />
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">{username}</span> reacted to your post with{' '}
                        <span className="font-bold">{reaction}</span>
                    </p>
                </div>
            );
        }
        // Check if it's a comment notification
        else if (notification.includes('commented on your post')) {
            const username = notification.split(' commented on your post')[0];
            return (
                <div className="flex items-center space-x-2">
                    <FaComment className="text-blue-500 w-4 h-4" />
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">{username}</span> commented on your post
                    </p>
                </div>
            );
        }
        // Default case
        return <p className="text-sm text-gray-700">{notification}</p>;
    };

    // Loading skeleton component
    const NotificationSkeleton = () => (
        <div className="animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="py-2 px-3 mb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <FaBell className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <button
                                onClick={handleClearNotifications}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <NotificationSkeleton />
                            ) : notifications.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No notifications</p>
                            ) : (
                                <div className={`transition-opacity duration-300 ${isPolling ? 'opacity-50' : 'opacity-100'}`}>
                                    {notifications.map((notification, index) => (
                                        <div
                                            key={index}
                                            className="py-2 px-3 hover:bg-gray-100 rounded-lg mb-2"
                                        >
                                            {formatNotification(notification)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown; 