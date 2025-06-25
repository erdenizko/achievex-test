"use client";

import { useAchieveX } from "@/contexts/AchieveXContext";
import { Button } from "@/components/ui/button";

export function RequestPreview() {
    const {
        handleCopyRequest,
        copiedRequest,
        token,
        memberId,
        integrationKey,
        points,
        additionalData,
        timestamp,
    } = useAchieveX();

    const requestBody = {
        memberId,
        integrationKey,
        points,
        additionalData: additionalData.reduce((acc, { key, value }) => {
            if (key) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, string>),
        timestamp,
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Request Data</h2>
            <div className="relative h-full overflow-auto rounded-lg bg-gray-100/80 text-sm">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-800 hover:bg-gray-200"
                    onClick={handleCopyRequest}
                >
                    {copiedRequest ? "Copied!" : "Copy"}
                </Button>
                <div className="relative animate__animated animate__fadeIn min-h-[100px] h-full overflow-auto rounded-lg bg-gray-900 p-4 text-white">
                    <div><b>EndPoint:</b> /api/process</div>
                    <div><b>Method:</b> POST</div>
                    <div><b>Headers:</b></div>
                    <pre className="text-xs">{JSON.stringify({
                        "Content-Type": "application/json",
                        "x-api-key": token,
                    }, null, 2)}</pre>
                    <div><b>Body:</b></div>
                    <pre className="text-xs">{JSON.stringify(requestBody, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
} 