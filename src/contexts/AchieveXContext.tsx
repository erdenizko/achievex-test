"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import {
    useActionItems,
    useMemberData,
    useMemberMilestoneData,
    useProcessActionMutation,
    useClearMilestonesMutation
} from '@/hooks/useAchieveXApi';
import { ActionItem, FormData, MemberMilestoneResponse, MemberResponse } from '@/lib/types';
import { useUserData } from '@/hooks/useUserData';

export interface ProfileData {
    level: string;
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    totalPoints: number;
    rank: number;
}

interface AchieveXContextType {
    memberId: string;
    setMemberId: (id: string) => void;
    integrationKey: string;
    setIntegrationKey: (key: string) => void;
    points: string;
    setPoints: (points: string) => void;
    timestamp: string;
    setTimestamp: (ts: string) => void;
    additionalData: { key: string; value: string }[];
    setAdditionalData: (data: { key: string; value: string }[]) => void;
    beforeMemberData: MemberResponse | null;
    beforeMilestoneData: MemberMilestoneResponse | null;
    isShowRequestPreview: boolean;
    setIsShowRequestPreview: (show: boolean) => void;
    password: string;
    setPassword: (pw: string) => void;
    showContent: boolean;
    token: string;
    setToken: (token: string) => void;
    copiedRequest: boolean;
    copiedResponse: boolean;
    isClearMilestoneDialogOpen: boolean;
    setIsClearMilestoneDialogOpen: (open: boolean) => void;
    isContinueDisabled: boolean;
    selectedAction: ActionItem | null;
    triggerDepositSuccess: boolean;
    setTriggerDepositSuccess: (trigger: boolean) => void;
    actionItems: ActionItem[] | undefined;
    actionItemsLoading: boolean;
    actionItemsError: boolean;
    memberData: MemberResponse | undefined;
    refetchMemberData: () => void;
    memberMilestoneData: MemberMilestoneResponse | undefined;
    refetchMemberMilestoneData: () => void;
    profileData: ProfileData | undefined;
    refetchProfileData: () => void;
    processActionMutation: UseMutationResult<unknown, Error, FormData, unknown>;
    clearMilestonesMutation: UseMutationResult<unknown, Error, string, unknown>;
    checkPassword: () => void;
    handleAddAdditionalData: () => void;
    handleAdditionalDataChange: (index: number, field: "key" | "value", fieldValue: string) => void;
    handleRemoveAdditionalData: (index: number) => void;
    handleIntegrationKeyChange: (selectedKey: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleCopyRequest: () => void;
    handleCopyResponse: () => void;
    handleClearMilestone: () => void;
    onOpenClearMilestoneDialog: (isOpen: boolean) => void;
}

const AchieveXContext = createContext<AchieveXContextType | undefined>(undefined);

export const AchieveXProvider = ({ children }: { children: ReactNode }) => {
    const [memberId, setMemberId] = useState("");
    const [integrationKey, setIntegrationKey] = useState("");
    const [points, setPoints] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [additionalData, setAdditionalData] = useState<{ key: string; value: string }[]>([]);
    const [beforeMemberData, setBeforeMemberData] = useState<MemberResponse | null>(null);
    const [beforeMilestoneData, setBeforeMilestoneData] = useState<MemberMilestoneResponse | null>(null);
    const [isShowRequestPreview, setIsShowRequestPreview] = useState(false);
    const [password, setPassword] = useState("");
    const [showContent, setShowContent] = useState(false);
    const [token, setToken] = useState("");
    const [copiedRequest, setCopiedRequest] = useState(false);
    const [copiedResponse, setCopiedResponse] = useState(false);
    const [isClearMilestoneDialogOpen, setIsClearMilestoneDialogOpen] = useState(false);
    const [isContinueDisabled, setIsContinueDisabled] = useState(false);
    const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
    const [triggerDepositSuccess, setTriggerDepositSuccess] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | undefined>(undefined);
    const { userData } = useUserData();

    useEffect(() => {
        setShowContent(localStorage.getItem("showContent") === "true");
    }, []);

    useEffect(() => {
        console.log("userData", userData);
        if (userData?.id) {
            refetchProfileData();
        }
    }, [userData]);

    const { data: actionItems, isLoading: actionItemsLoading, isError: actionItemsError } = useActionItems(token);
    const { data: memberData, refetch: refetchMemberData } = useMemberData(memberId, token);
    const { data: memberMilestoneData, refetch: refetchMemberMilestoneData } = useMemberMilestoneData(memberId, token);

    const onMutationSuccess = useCallback(() => {
        refetchMemberData();
        refetchMemberMilestoneData();
        localStorage.setItem('achievex_data_updated', Date.now().toString());
    }, [refetchMemberData, refetchMemberMilestoneData]);

    const processActionMutation = useProcessActionMutation(token, onMutationSuccess);
    const clearMilestonesMutation = useClearMilestonesMutation(token, onMutationSuccess);

    const { reset: resetProcessActionMutation } = processActionMutation;
    useEffect(() => {
        setBeforeMemberData(null);
        setBeforeMilestoneData(null);
        resetProcessActionMutation();
    }, [memberId, resetProcessActionMutation]);

    const checkPassword = () => {
        if (password === process.env.NEXT_PUBLIC_PASSWORD) {
            setShowContent(true);
            localStorage.setItem("showContent", "true");
        }
    };

    const refetchProfileData = () => {
        const fetchProfileData = async () => {
            if (userData?.id) {
                try {
                    const response = await fetch(`/api/members/external/${userData?.id}`, {
                        headers: {
                            'x-api-key': process.env.NEXT_PUBLIC_ACHIEVEX_DEMO_TOKEN || ''
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const profileData = {
                            level: data.data.currentLevel.name,
                            currentLevel: data.data.currentLevel.level,
                            currentXP: data.data.points,
                            nextLevelXP: data.data.nextLevel.min,
                            totalPoints: data.data.points,
                            rank: data.data.currentLevel.level
                        }
                        setProfileData(profileData);
                    } else {
                        console.error('Failed to fetch profile data');
                    }
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        };
        fetchProfileData();
    }

    const handleAddAdditionalData = () => {
        setAdditionalData([...additionalData, { key: "", value: "" }]);
    };

    const handleAdditionalDataChange = (index: number, field: "key" | "value", fieldValue: string) => {
        const newAdditionalData = [...additionalData];
        newAdditionalData[index][field] = fieldValue;
        setAdditionalData(newAdditionalData);
    };

    const handleRemoveAdditionalData = (index: number) => {
        const newAdditionalData = additionalData.filter((_, i) => i !== index);
        setAdditionalData(newAdditionalData);
    };

    const handleIntegrationKeyChange = (selectedKey: string) => {
        if (selectedKey === integrationKey) return;
        setIntegrationKey(selectedKey);
        setTriggerDepositSuccess(false);
        const selectedAction = actionItems?.find(item => item.integrationKey === selectedKey);
        setSelectedAction(selectedAction ?? null);

        if (selectedAction?.additionalData) {
            const newAdditionalData = selectedAction.additionalData.map(item => ({ key: item, value: "" }));
            setAdditionalData(newAdditionalData);
        } else {
            setAdditionalData([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBeforeMemberData(memberData ?? null);
        setBeforeMilestoneData(memberMilestoneData ?? null);
        const formattedAdditionalData = additionalData.reduce((acc, { key, value }) => {
            if (key) acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        const mutationPayload = { memberId, integrationKey, points, additionalData: formattedAdditionalData, timestamp };
        processActionMutation.mutate(mutationPayload);

        if (triggerDepositSuccess) {
            const depositSuccessAction = actionItems?.find(item => item.integrationKey === 'deposit_succeeded');
            if (depositSuccessAction) {
                processActionMutation.mutate({ memberId, integrationKey: depositSuccessAction.integrationKey, points, additionalData: {}, timestamp });
            }
        }
    };

    const handleCopyRequest = () => {
        const requestBody = {
            memberId,
            integrationKey,
            points,
            additionalData: additionalData.reduce((acc, { key, value }) => {
                if (key) acc[key] = value;
                return acc;
            }, {} as Record<string, string>),
            timestamp,
        };
        const allRequestData = `Endpoint: /api/process
Method: POST
Headers: ${JSON.stringify({ "Content-Type": "application/json", "x-api-key": token }, null, 2)}
Body: ${JSON.stringify(requestBody, null, 2)}`;
        navigator.clipboard.writeText(allRequestData);
        setCopiedRequest(true);
        setTimeout(() => setCopiedRequest(false), 2000);
    };

    const handleCopyResponse = () => {
        if (processActionMutation.data) {
            navigator.clipboard.writeText(JSON.stringify(processActionMutation.data, null, 2));
            setCopiedResponse(true);
            setTimeout(() => setCopiedResponse(false), 2000);
        }
    };

    const handleClearMilestone = () => {
        clearMilestonesMutation.mutate(memberId);
        setIsClearMilestoneDialogOpen(false);
    }

    const onOpenClearMilestoneDialog = (isOpen: boolean) => {
        setIsClearMilestoneDialogOpen(isOpen);
        if (isOpen) {
            setIsContinueDisabled(true);
            setTimeout(() => setIsContinueDisabled(false), 5000);
        }
    }

    const value = {
        memberId, setMemberId,
        integrationKey, setIntegrationKey,
        points, setPoints,
        timestamp, setTimestamp,
        additionalData, setAdditionalData,
        beforeMemberData,
        beforeMilestoneData,
        isShowRequestPreview, setIsShowRequestPreview,
        password, setPassword,
        showContent,
        token, setToken,
        copiedRequest,
        copiedResponse,
        isClearMilestoneDialogOpen, setIsClearMilestoneDialogOpen,
        isContinueDisabled,
        selectedAction,
        triggerDepositSuccess, setTriggerDepositSuccess,
        actionItems,
        actionItemsLoading,
        actionItemsError,
        memberData,
        refetchMemberData,
        memberMilestoneData,
        refetchMemberMilestoneData,
        processActionMutation,
        clearMilestonesMutation,
        checkPassword,
        handleAddAdditionalData,
        handleAdditionalDataChange,
        handleRemoveAdditionalData,
        handleIntegrationKeyChange,
        handleSubmit,
        handleCopyRequest,
        handleCopyResponse,
        handleClearMilestone,
        onOpenClearMilestoneDialog,
        profileData,
        refetchProfileData
    };

    return <AchieveXContext.Provider value={value}>{children}</AchieveXContext.Provider>;
}

export const useAchieveX = () => {
    const context = useContext(AchieveXContext);
    if (context === undefined) {
        throw new Error('useAchieveX must be used within an AchieveXProvider');
    }
    return context;
}; 