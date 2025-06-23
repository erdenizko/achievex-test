"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemberDataPreview } from "@/components/MemberDataPreview";

interface ActionItem {
  id: string;
  integrationKey: string;
  name: string;
}

interface ActionItemResponse {
  data: ActionItem[];
}

interface Level {
  level: number;
  name: string;
  min: number;
  imageUrl: string;
}

interface MemberData {
  id: string;
  externalId: string;
  points: number;
  spendablePoints: number;
  currentLevel: Level;
  nextLevel: Level;
}

interface MemberResponse {
  data: MemberData;
}

interface Progress {
  currentValue: number;
  targetValue: string;
  completed: boolean;
}

interface StreakInfo {
  streakDuration: number;
  currentStreak: number;
  streakStartDate: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  completed: boolean;
  rewardPoints: number;
  isStreakBased: boolean;
  progress: Progress[];
  imageUrl: string | null;
  isActive: boolean;
  streakInfo: StreakInfo | null;
}

interface MilestoneData {
  memberMilestones: Milestone[];
  otherMilestones: Milestone[];
}

interface MemberMilestoneResponse {
  data: MilestoneData;
}

interface FormData {
  memberId: string;
  integrationKey: string;
  points: string;
  additionalData: Record<string, string>;
  timestamp: string;
}

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AchieveXForm />
    </QueryClientProvider>
  );
}

function AchieveXForm() {
  const [memberId, setMemberId] = useState("");
  const [integrationKey, setIntegrationKey] = useState("");
  const [points, setPoints] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [additionalData, setAdditionalData] = useState<{ key: string; value: string }[]>([]);
  const [beforeMemberData, setBeforeMemberData] = useState<MemberResponse | null>(null);
  const [beforeMilestoneData, setBeforeMilestoneData] = useState<MemberMilestoneResponse | null>(null);
  const [isShowRequestPreview, setIsShowRequestPreview] = useState(false);
  const [password, setPassword] = useState("");
  const [showContent, setShowContent] = useState(localStorage.getItem("showContent") === "true");

  const { data, isLoading, isError } = useQuery<ActionItemResponse>({
    queryKey: ["action-items"],
    queryFn: () => fetch("/api/tasks", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }).then((res) => res.json()),
  });

  const { data: memberData, refetch: refetchMemberData } = useQuery<MemberResponse>({
    enabled: !!memberId,
    queryKey: ["member-data", memberId],
    queryFn: () => fetch(`/api/members/external/${memberId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }).then((res) => res.json()),
  });

  const { data: memberMilestoneData, refetch: refetchMemberMilestoneData } = useQuery<MemberMilestoneResponse>({
    enabled: !!memberId,
    queryKey: ["member-milestone-data", memberId],
    queryFn: () => fetch(`/api/members/${memberId}/milestone-progress`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
    }).then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (newData: FormData) => {
      return fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
        },
        body: JSON.stringify(newData),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      refetchMemberData();
      refetchMemberMilestoneData();
    },
  });

  const checkPassword = () => {
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setShowContent(true);
      localStorage.setItem("showContent", "true");
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBeforeMemberData(memberData ?? null);
    setBeforeMilestoneData(memberMilestoneData ?? null);
    const formattedAdditionalData = additionalData.reduce((acc, { key, value }) => {
      if (key) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    mutation.mutate({ memberId, integrationKey, points, additionalData: formattedAdditionalData, timestamp });
  };

  useEffect(() => {
    if (memberId) {
      refetchMemberData();
      refetchMemberMilestoneData();
    }
  }, [memberId]);

  return (
    <main className="flex min-h-screen items-start justify-center p-24 bg-gray-50">
      <div className={`flex flex-col items-center justify-center space-y-4 ${showContent ? "hidden" : "block"}`}>
        <h1 className="text-2xl font-bold">AchieveX API Test</h1>
        <p className="text-sm text-gray-500">
          This is a tool to help you test the AchieveX API.
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-2 w-full">
          <input placeholder="Enter password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" />
          <Button type="button" onClick={() => checkPassword()}>Enter</Button>
        </p>
      </div>
      <div className={`flex w-full ${showContent ? "block" : "hidden"}`}>
        <div className="w-1/3 pr-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Enter member ID"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="action">Action</Label>
              <Select onValueChange={setIntegrationKey} value={integrationKey}>
                <SelectTrigger id="integrationKey" className="w-full">
                  <SelectValue placeholder="Select an integration key" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                  {isError && <SelectItem value="error" disabled>Error fetching actions</SelectItem>}
                  {data?.data.map((item: ActionItem) => (
                    <SelectItem key={item.id} value={item.integrationKey}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter value"
              />
            </div>

            <div className="grid gap-2">
              <Label>Additional Data</Label>
              <div className="space-y-2">
                {additionalData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={data.key}
                      onChange={(e) => handleAdditionalDataChange(index, "key", e.target.value)}
                      placeholder="Key"
                      className="flex-1"
                    />
                    <Input
                      value={data.value}
                      onChange={(e) => handleAdditionalDataChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button type="button" onClick={() => handleRemoveAdditionalData(index)} variant="destructive">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={handleAddAdditionalData} variant="outline">
                Add Data
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timestamp">Timestamp</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter timestamp"
              />
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Sending..." : "Send"}
            </Button>


            <Button type="button" variant="outline" className="w-full" onClick={() => setIsShowRequestPreview(!isShowRequestPreview)}>
              {isShowRequestPreview ? "Hide Request Preview" : "Show Request Preview"}
            </Button>
            {isShowRequestPreview && <div>
              {/* preview request data */}
              <h2 className="text-xl font-semibold mb-2 mt-4">Request Data</h2>
              <div className="bg-gray-100 p-4 rounded-md h-full overflow-auto">
                <div><b>EndPoint:</b> {process.env.NEXT_PUBLIC_API_URL}/api/process</div>
                <div><b>Method:</b> POST</div>
                <div><b>Headers:</b></div>
                <pre className="text-sm">{JSON.stringify({
                  "Content-Type": "application/json",
                  "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
                }, null, 2)}</pre>
                <div><b>Body:</b></div>
                <pre className="text-sm">{JSON.stringify({
                  memberId,
                  integrationKey,
                  points,
                  additionalData,
                  timestamp,
                }, null, 2)}</pre>
              </div>
            </div>
            }
          </form>
        </div>
        <div className="w-2/3 pl-8 border-l border-gray-300 flex flex-col gap-8">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2 mt-4">Response</h2>
              <div className="bg-gray-100 p-4 rounded-md h-full overflow-auto">
                {mutation.isPending && <p>Loading...</p>}
                {mutation.isError && <p className="text-red-500">Error: {mutation.error.message}</p>}
                {mutation.isSuccess && (
                  <pre className="text-sm">{JSON.stringify(mutation.data, null, 2)}</pre>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                {beforeMemberData && <MemberDataPreview title="Member Data (Before)" data={beforeMemberData.data} milestoneData={beforeMilestoneData?.data} />}
              </div>
              <div className="w-1/2">
                {mutation.isSuccess && memberData && <MemberDataPreview title="Member Data (After)" data={memberData.data} milestoneData={memberMilestoneData?.data} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
