import { useMutation, useQuery } from "@tanstack/react-query";
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