"use client";

import { useAchieveX } from "@/contexts/AchieveXContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ActionItem } from "@/lib/types";
import { RequestPreview } from "./RequestPreview";
import { useMemo } from "react";

export function ActionForm() {
    const {
        token, setToken,
        memberId, setMemberId,
        integrationKey, handleIntegrationKeyChange,
        actionItems, actionItemsLoading, actionItemsError,
        selectedAction,
        triggerDepositSuccess, setTriggerDepositSuccess,
        points, setPoints,
        additionalData, handleAddAdditionalData, handleAdditionalDataChange, handleRemoveAdditionalData,
        timestamp, setTimestamp,
        handleSubmit,
        processActionMutation,
        isShowRequestPreview, setIsShowRequestPreview,
    } = useAchieveX();

    const sortedActionItems = useMemo(() => {
        if (!actionItems) return [];
        return [...actionItems].sort((a, b) => (b.milestones?.length ?? 0) - (a.milestones?.length ?? 0));
    }, [actionItems]);

    return (
        <div className="w-1/3 p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">AchieveX API Test</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="token" className="text-sm font-medium text-gray-700">Token</Label>
                    <Input
                        id="token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Enter token"
                        className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="memberId" className="text-sm font-medium text-gray-700">Member ID</Label>
                    <Input
                        id="memberId"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        placeholder="Enter member ID"
                        className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="action" className="text-sm font-medium text-gray-700">Action</Label>
                    <Select onValueChange={handleIntegrationKeyChange} value={integrationKey}>
                        <SelectTrigger id="integrationKey" className="w-full mt-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white">
                            <SelectValue placeholder="Select an integration key" />
                        </SelectTrigger>
                        <SelectContent>
                            {actionItemsLoading && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                            {actionItemsError && <SelectItem value="error" disabled>Error fetching actions</SelectItem>}
                            {sortedActionItems.map((item: ActionItem) => (
                                <SelectItem key={item.id} value={item.integrationKey}>
                                    {item.name} - {item.milestones?.length ? <b>{item.milestones.length} milestones connected</b> : "No milestones connected"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedAction?.integrationKey.includes("deposit") && selectedAction?.integrationKey !== "deposit_succeeded" && (
                    <div className="flex items-center space-x-2 -mt-3">
                        <input
                            type="checkbox"
                            id="triggerDepositSuccess"
                            checked={triggerDepositSuccess}
                            onChange={(e) => setTriggerDepositSuccess(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="triggerDepositSuccess" className="text-sm font-medium text-gray-700">
                            Also trigger <b>&quot;Successful Deposit&quot;</b> action
                        </Label>
                    </div>
                )}
                <div className="grid gap-2">
                    <Label htmlFor="value" className="text-sm font-medium text-gray-700">Value</Label>
                    <Input
                        id="value"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        placeholder="Enter value"
                        className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white"
                    />
                </div>

                <div className="grid gap-4">
                    <Label className="text-sm font-medium text-gray-700">Additional Data</Label>
                    <div className="space-y-3">
                        {additionalData.map((data, index) => (
                            <div key={index} className="animate__animated animate__fadeIn flex items-center space-x-2">
                                <Input
                                    value={data.key}
                                    onChange={(e) => handleAdditionalDataChange(index, "key", e.target.value)}
                                    placeholder="Key"
                                    className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80"
                                />
                                <Input
                                    value={data.value}
                                    onChange={(e) => handleAdditionalDataChange(index, "value", e.target.value)}
                                    placeholder="Value"
                                    className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80"
                                />
                                <Button type="button" onClick={() => handleRemoveAdditionalData(index)} variant="destructive" className="transition-transform duration-200 hover:scale-105 active:scale-100">
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" onClick={handleAddAdditionalData} variant="outline" className="transition-transform duration-200 hover:scale-105 active:scale-100">
                        Add Data
                    </Button>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="timestamp" className="text-sm font-medium text-gray-700">Timestamp</Label>
                    <Input
                        id="timestamp"
                        type="datetime-local"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        placeholder="Enter timestamp"
                        className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white"
                    />
                </div>
                {triggerDepositSuccess && actionItems?.find(item => item.integrationKey === "deposit_succeeded")?.milestones?.length ? <div>
                    <div className="text-lg font-medium text-gray-700 p-4 bg-gray-100/80 rounded-lg border border-gray-200"><b>These milestones gonna be triggered:</b><br />
                        {actionItems?.find(item => item.integrationKey === "deposit_succeeded")?.milestones?.sort((a, b) => a.name.localeCompare(b.name)).map((milestone) => (
                            <span key={milestone.id}>{milestone.name}, </span>
                        ))}
                    </div>
                </div> : null}
                {!triggerDepositSuccess && selectedAction?.milestones?.length ? <div>
                    <div className="text-lg font-medium text-gray-700 p-4 bg-gray-100/80 rounded-lg border border-gray-200"><b>These milestones gonna be triggered:</b><br />
                        {selectedAction?.milestones?.sort((a, b) => a.name.localeCompare(b.name)).map((milestone) => (
                            <span key={milestone.id}>{milestone.name}, </span>
                        ))}
                    </div>
                </div> : null}
                <div className="space-y-2 pt-4">
                    <Button type="submit" disabled={processActionMutation.isPending} className="w-full transition-transform duration-200 hover:scale-105 active:scale-100">
                        {processActionMutation.isPending ? "Sending..." : "Send"}
                    </Button>

                    <Button type="button" variant="outline" className="w-full transition-transform duration-200 hover:scale-105 active:scale-100" onClick={() => setIsShowRequestPreview(!isShowRequestPreview)}>
                        {isShowRequestPreview ? "Hide Request Preview" : "Show Request Preview"}
                    </Button>
                </div>
                {isShowRequestPreview && <RequestPreview />}
            </form>
        </div>
    );
} 