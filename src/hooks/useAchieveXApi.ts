import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionItem, FormData, MemberMilestoneResponse, MemberResponse } from "@/lib/types";

export const useActionItems = (token: string) => {
    return useQuery<ActionItem[]>({
        enabled: !!token,
        queryKey: ["action-items"],
        queryFn: () =>
            fetch(`/api/achievex/tasks`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": token,
                },
            }).then((res) => res.json()).then((data) => data.data),
    });
};

export const useMemberData = (memberId: string, token: string) => {
    return useQuery<MemberResponse>({
        enabled: !!memberId,
        queryKey: ["member-data", memberId],
        queryFn: () => fetch(`/api/members/external/${memberId}`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token,
            },
        }).then((res) => res.json()).then((data) => data.data),
    });
}

export const useMemberMilestoneData = (memberId: string, token: string) => {
    return useQuery<MemberMilestoneResponse>({
        enabled: !!memberId,
        queryKey: ["member-milestone-data", memberId],
        queryFn: () => fetch(`/api/members/${memberId}/milestone-progress`, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": token,
            },
        }).then((res) => res.json()).then((data) => data.data),
    });
}

export const useProcessActionMutation = (token: string, onSuccess: () => void) => {
    return useMutation({
        mutationFn: (newData: FormData) => {
            return fetch(`/api/process`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": token,
                },
                body: JSON.stringify(newData),
            }).then((res) => res.json()).then((data) => data.data);
        },
        onSuccess,
    });
}

export const useClearMilestonesMutation = (token: string, onSuccess: () => void) => {
    return useMutation({
        mutationFn: (memberId: string) => {
            return fetch(`/api/clear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": token,
                },
                body: JSON.stringify({ memberId }),
            }).then((res) => res.json()).then((data) => data.data);
        },
        onSuccess,
    });
}

export const useDepositMutation = (token: string, onSuccess: () => void) => {
    return useMutation({
        mutationFn: (data: { memberId: string, amount: number, integrationKey: string }) => {
            data.integrationKey = 'deposit_succeeded';
            return fetch(`/api/process`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": token,
                },
                body: JSON.stringify(data),
            }).then((res) => res.json()).then((data) => data.data);
        },
        onSuccess,
    });
};

export const useClaimMilestoneMutation = (token: string | null, onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId, milestoneId }: { memberId: string; milestoneId: string }) => {
            const response = await fetch('/api/claimmilestone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': token || ''
                },
                body: JSON.stringify({ memberId, milestoneId }),
            });
            if (!response.ok) {
                throw new Error('Failed to claim milestone');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievex-profile'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
};

export const useClearMilestoneMutation = (token: string | null, onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId }: { memberId: string }) => {
            const response = await fetch('/api/clearmilestone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': token || ''
                },
                body: JSON.stringify({ memberId }),
            });
            if (!response.ok) {
                throw new Error('Failed to clear milestone');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievex-profile'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
};

export const useAddDiamondsMutation = (token: string | null, onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId, amount }: { memberId: string; amount: number }) => {
            const response = await fetch('/api/adddiamonds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': token || ''
                },
                body: JSON.stringify({ memberId, amount }),
            });
            if (!response.ok) {
                throw new Error('Failed to add diamonds');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievex-profile'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
};

export const useAddPointsMutation = (token: string | null, onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ memberId, amount }: { memberId: string; amount: number }) => {
            const response = await fetch('/api/addpoints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': token || ''
                },
                body: JSON.stringify({ memberId, amount }),
            });
            if (!response.ok) {
                throw new Error('Failed to add points');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['achievex-profile'] });
            if (onSuccess) {
                onSuccess();
            }
        },
    });
};