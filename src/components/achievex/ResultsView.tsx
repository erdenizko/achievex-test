"use client";

import { useAchieveX } from "@/contexts/AchieveXContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { MemberDataPreview } from "@/components/MemberDataPreview";

export function ResultsView() {
    const {
        processActionMutation,
        handleCopyResponse,
        copiedResponse,
        isClearMilestoneDialogOpen,
        onOpenClearMilestoneDialog,
        isContinueDisabled,
        handleClearMilestone,
        beforeMemberData,
        beforeMilestoneData,
        memberData,
        memberMilestoneData
    } = useAchieveX();

    if (processActionMutation.isPending) {
        return (
            <div className="flex flex-1 flex-col gap-8 items-center justify-center p-8">
                <b className="text-2xl font-semibold text-gray-800">Loading...</b>
            </div>
        );
    }

    if (processActionMutation.isError) {
        return (
            <div className="flex flex-1 flex-col gap-8 items-center justify-center p-8">
                <b className="text-2xl font-semibold text-red-500">Error: {processActionMutation.error.message}</b>
            </div>
        );
    }

    if (processActionMutation.isSuccess) {
        return (
            <div className="flex w-2/3 flex-col gap-8 border-l border-gray-200 p-8">
                <div className="flex flex-1 flex-col gap-8">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-row justify-between">
                            <h2 className="text-2xl font-semibold text-gray-800">Response</h2>
                            <Dialog open={isClearMilestoneDialogOpen} onOpenChange={onOpenClearMilestoneDialog}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="transition-transform duration-200 hover:scale-105 active:scale-100">Clear milestone progress of this user</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            You cannot revert this back!
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" disabled={isContinueDisabled} onClick={handleClearMilestone}>Continue</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="relative animate__animated animate__fadeIn min-h-[100px] h-full overflow-auto rounded-lg bg-gray-900 p-4 text-white">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 text-white hover:bg-gray-700"
                                onClick={handleCopyResponse}
                            >
                                {copiedResponse ? "Copied!" : "Copy"}
                            </Button>
                            <pre className="text-sm">{JSON.stringify(processActionMutation.data, null, 2)}</pre>
                        </div>
                    </div>
                    <div className="flex space-x-6">
                        <div className="animate__animated animate__fadeInLeft w-1/2">
                            {beforeMemberData && <MemberDataPreview title="Member Data (Before)" data={beforeMemberData.data} milestoneData={beforeMilestoneData?.data} />}
                        </div>
                        <div className="animate__animated animate__fadeInRight w-1/2">
                            {memberData && <MemberDataPreview title="Member Data (After)" data={memberData.data} milestoneData={memberMilestoneData?.data} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-2/3 flex-col gap-8 border-l border-gray-200 p-8">
            <div className="flex flex-1 flex-col gap-8 items-center justify-center">
                <b className="text-2xl font-semibold text-gray-800">When you send a request you will see result in here.</b>
            </div>
        </div>
    );
} 