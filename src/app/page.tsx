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

interface ActionItem {
  id: string;
  integrationKey: string;
  name: string;
  additionalData?: string[];
  milestones?: { name: string, id: string }[];
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
  const [showContent, setShowContent] = useState(false);
  const [token, setToken] = useState("");
  const [copiedRequest, setCopiedRequest] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isClearMilestoneDialogOpen, setIsClearMilestoneDialogOpen] = useState(false);
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [triggerDepositSuccess, setTriggerDepositSuccess] = useState(false);

  useEffect(() => {
    setShowContent(localStorage.getItem("showContent") === "true");
  }, []);

  const { data, isLoading, isError, refetch: refetchActionItems } = useQuery<ActionItem[]>({
    enabled: !!token,
    queryKey: ["action-items"],
    queryFn: () => fetch(`/api/tasks`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
    }).then((res) => res.json()),
  });

  const { data: memberData, refetch: refetchMemberData } = useQuery<MemberResponse>({
    enabled: !!memberId,
    queryKey: ["member-data", memberId],
    queryFn: () => fetch(`/api/members/external/${memberId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
    }).then((res) => res.json()),
  });

  const { data: memberMilestoneData, refetch: refetchMemberMilestoneData } = useQuery<MemberMilestoneResponse>({
    enabled: !!memberId,
    queryKey: ["member-milestone-data", memberId],
    queryFn: () => fetch(`/api/members/${memberId}/milestone-progress`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
    }).then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: (newData: FormData) => {
      return fetch(`/api/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
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

  const handleIntegrationKeyChange = (selectedKey: string) => {
    setIntegrationKey(selectedKey);
    setTriggerDepositSuccess(false);

    // Find the selected action item
    const selectedAction = data?.find(item => item.integrationKey === selectedKey);
    setSelectedAction(selectedAction ?? null);

    // If the action has additional data defined, populate the form fields
    if (selectedAction?.additionalData) {
      console.log(selectedAction.additionalData);
      const newAdditionalData: { key: string; value: string }[] = [];
      selectedAction.additionalData.forEach((item: string) => {
        newAdditionalData.push({
          key: item,
          value: "",
        });
      });
      setAdditionalData(newAdditionalData);
    } else {
      // Clear additional data if no predefined data exists
      setAdditionalData([]);
    }
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
    if (!triggerDepositSuccess) {
      mutation.mutate({ memberId, integrationKey, points, additionalData: formattedAdditionalData, timestamp });
    } else {
      mutation.mutate({ memberId, integrationKey: "deposit_succeeded", points, additionalData: formattedAdditionalData, timestamp });
    }

    if (triggerDepositSuccess) {
      const depositSuccessAction = data?.find(item => item.integrationKey === 'deposit-success');
      if (depositSuccessAction) {
        mutation.mutate({ memberId, integrationKey: depositSuccessAction.integrationKey, points: '', additionalData: {}, timestamp });
      }
    }
  };

  const handleCopyRequest = () => {
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
    const allRequestData = `Endpoint: /api/process
Method: POST
Headers: ${JSON.stringify({ "Content-Type": "application/json", "x-api-key": token }, null, 2)}
Body: ${JSON.stringify(requestBody, null, 2)}`;
    navigator.clipboard.writeText(allRequestData);
    setCopiedRequest(true);
    setTimeout(() => setCopiedRequest(false), 2000);
  };

  const handleCopyResponse = () => {
    if (mutation.data) {
      navigator.clipboard.writeText(JSON.stringify(mutation.data, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleClearMilestone = () => {
    fetch(`/api/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
      },
      body: JSON.stringify({
        memberId
      }),
    }).then((res) => res.json()).then(() => {
      refetchMemberData();
      refetchMemberMilestoneData();
    });
    setIsClearMilestoneDialogOpen(false);
  }

  const onOpenClearMilestoneDialog = (isOpen: boolean) => {
    setIsClearMilestoneDialogOpen(isOpen);
    if (isOpen) {
      setIsContinueDisabled(true);
      setTimeout(() => {
        setIsContinueDisabled(false);
      }, 5000);
    }
  }

  useEffect(() => {
    if (memberId && token) {
      refetchMemberData();
      refetchMemberMilestoneData();
    }
    if (token) {
      refetchActionItems();
    }
  }, [memberId, token]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-sans transition-all duration-500 ease-in-out sm:p-8 md:p-12">
      <div className={`w-full max-w-md transform transition-all duration-500 ease-in-out ${showContent ? "hidden" : "block"}`}>
        <div className="space-y-6 rounded-2xl bg-white/60 p-8 shadow-lg ring-1 ring-black/5 backdrop-blur-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome to AchieveX</h1>
            <p className="mt-2 text-gray-600">
              This is a tool to test the AchieveX API.
            </p>
          </div>
          <div className="flex w-full items-center gap-2">
            <Input
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full transition-all duration-300 focus:ring-2 focus:ring-indigo-400/80 focus:ring-offset-2 focus:ring-offset-white"
              onKeyUp={(e) => e.key === 'Enter' && checkPassword()}
            />
            <Button type="button" onClick={() => checkPassword()} className="transition-transform duration-200 hover:scale-105 active:scale-100">
              Enter
            </Button>
          </div>
        </div>
      </div>
      <div className={`animate__animated animate__fadeInUp animate__faster w-full rounded-2xl bg-white/60 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl ${showContent ? "block" : "hidden"}`}>
        <div className={`flex w-full`}>
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
                    {isLoading && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                    {isError && <SelectItem value="error" disabled>Error fetching actions</SelectItem>}
                    {data?.sort((a, b) => (b.milestones?.length ?? 0) - (a.milestones?.length ?? 0)).map((item: ActionItem) => (
                      <SelectItem key={item.id} value={item.integrationKey}>
                        {item.name} - {item.milestones?.length ? `${item.milestones.length} milestones` : "No milestones"}
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
              {triggerDepositSuccess && data?.find(item => item.integrationKey === "deposit_succeeded")?.milestones?.length && <div>
                <div className="text-lg font-medium text-gray-700 p-4 bg-gray-100/80 rounded-lg border border-gray-200"><b>These milestones gonna be triggered:</b><br />
                  {data?.find(item => item.integrationKey === "deposit_succeeded")?.milestones?.sort((a, b) => a.name.localeCompare(b.name)).map((milestone) => (
                    <span key={milestone.id}>{milestone.name}, </span>
                  ))}
                </div>
              </div>}
              {!triggerDepositSuccess && selectedAction?.milestones?.length && <div>
                <div className="text-lg font-medium text-gray-700 p-4 bg-gray-100/80 rounded-lg border border-gray-200"><b>These milestones gonna be triggered:</b><br />
                  {selectedAction?.milestones?.sort((a, b) => a.name.localeCompare(b.name)).map((milestone) => (
                    <span key={milestone.id}>{milestone.name}, </span>
                  ))}
                </div>
              </div>}
              <div className="space-y-2 pt-4">
                <Button type="submit" disabled={mutation.isPending} className="w-full transition-transform duration-200 hover:scale-105 active:scale-100">
                  {mutation.isPending ? "Sending..." : "Send"}
                </Button>

                <Button type="button" variant="outline" className="w-full transition-transform duration-200 hover:scale-105 active:scale-100" onClick={() => setIsShowRequestPreview(!isShowRequestPreview)}>
                  {isShowRequestPreview ? "Hide Request Preview" : "Show Request Preview"}
                </Button>
              </div>
              {isShowRequestPreview && <div className="animate__animated animate__fadeIn">
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
                    <pre className="text-xs">{JSON.stringify({
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
                    }, null, 2)}</pre>
                  </div>
                </div>
              </div>
              }
            </form>
          </div>
          <div className="flex w-2/3 flex-col gap-8 border-l border-gray-200 p-8">
            {!mutation.data && !mutation.isPending && <div className="flex flex-1 flex-col gap-8 items-center justify-center">
              <b className="text-2xl font-semibold text-gray-800">When you send a request you will see result in here.</b>
            </div>}
            {mutation.isPending && <div className="flex flex-1 flex-col gap-8 items-center justify-center">
              <b className="text-2xl font-semibold text-gray-800">Loading...</b>
            </div>}
            {mutation.isError && <div className="flex flex-1 flex-col gap-8 items-center justify-center">
              <b className="text-2xl font-semibold text-gray-800">Error: {mutation.error.message}</b>
            </div>}
            {mutation.data && <div className="flex flex-1 flex-col gap-8">
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
                  {mutation.isPending && <p>Loading...</p>}
                  {mutation.isError && <p className="text-red-400">Error: {mutation.error.message}</p>}
                  {mutation.isSuccess && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-white hover:bg-gray-700"
                        onClick={handleCopyResponse}
                      >
                        {copiedResponse ? "Copied!" : "Copy"}
                      </Button>
                      <pre className="text-sm">{JSON.stringify(mutation.data, null, 2)}</pre>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-6">
                <div className="animate__animated animate__fadeInLeft w-1/2">
                  {beforeMemberData && <MemberDataPreview title="Member Data (Before)" data={beforeMemberData.data} milestoneData={beforeMilestoneData?.data} />}
                </div>
                <div className="animate__animated animate__fadeInRight w-1/2">
                  {mutation.isSuccess && memberData && <MemberDataPreview title="Member Data (After)" data={memberData.data} milestoneData={memberMilestoneData?.data} />}
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </main >
  );
}
