"use client";

import { useAchieveX } from "@/contexts/AchieveXContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm() {
    const { password, setPassword, checkPassword } = useAchieveX();

    return (
        <div className="w-full max-w-md transform transition-all duration-500 ease-in-out">
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
    );
} 