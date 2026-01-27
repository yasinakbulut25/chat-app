"use client";

import { CREATE_USER } from "@/graphql/mutations/createUser";
import { useAuth } from "@/providers/AuthContext";
import { User } from "@/types/user";
import { useMutation } from "@apollo/client/react";
import { Button } from "@heroui/react";
import { MessageCircleMore } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [username, setUserName] = useState("");
  const [createUser] = useMutation(CREATE_USER);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim()) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: username.trim(),
      image: "/users/user1.png",
      isOnline: true,
    };

    const res = await createUser({ variables: { input: newUser } });
    if (res.data) {
      login(newUser);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-slate-700 to-slate-900 shadow-lg shadow-slate-900/20">
              <MessageCircleMore
                className="text-white"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Chat App</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your username to start chatting
            </p>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, "");
                  if (value.length <= 20) {
                    setUserName(value);
                  }
                }}
                maxLength={20}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <Button
              className="w-full rounded-xl bg-linear-to-r from-slate-800 to-slate-900 py-4 h-auto font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
              onPress={handleLogin}
              disabled={!username.trim()}
            >
              Sign In
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Demo purposes only • No password required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
