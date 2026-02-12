"use client";

import { CREATE_USER } from "@/graphql/mutations/createUser";
import { useAuth } from "@/providers/AuthContext";
import { User } from "@/types/user";
import { useMutation } from "@apollo/client/react";
import { Button } from "@heroui/react";
import { MessageCircleMore } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function Login() {
  const [username, setUserName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [createUser] = useMutation(CREATE_USER);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !selectedAvatar) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: username.trim(),
      image: selectedAvatar,
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

            <div className="flex flex-col">
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Select Avatar
              </label>
              <div className="grid grid-cols-6 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-105 ${
                      selectedAvatar === avatar
                        ? "border-slate-900 ring-4 ring-slate-100"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <Image
                      src={avatar}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      width={100}
                      height={100}
                    />
                    {selectedAvatar === avatar && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20">
                        <div className="h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full rounded-xl bg-linear-to-r from-slate-800 to-slate-900 py-4 h-auto font-semibold text-white shadow-lg shadow-slate-900/25 transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
              onPress={handleLogin}
              disabled={!username.trim() || !selectedAvatar}
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
