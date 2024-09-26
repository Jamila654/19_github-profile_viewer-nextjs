"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, ChangeEvent } from "react";

interface UserProfile {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
}

interface UserRepo {
  name: string;
  html_url: string;
  description: string | null;
}

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRepos, setUserRepos] = useState<UserRepo[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    setUserProfile(null);
    setUserRepos([]);
    try {
      const profileRes = await fetch(`https://api.github.com/users/${username}`);
      if (!profileRes.ok) {
        throw new Error("User not found");
      }
      const profileData: UserProfile = await profileRes.json();
      setUserProfile(profileData);

      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const reposData: UserRepo[] = await reposRes.json();
      setUserRepos(reposData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Github Profile Viewer</CardTitle>
            <CardDescription>
              Search for a GitHub username and view their profile and repositories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="search flex gap-4">
              <Input
                placeholder="Enter Your Github Username..."
                value={username}
                onChange={handleInputChange}
              />
              <Button onClick={fetchUserData} disabled={!username}>
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {loading && <Skeleton className="w-full h-[30px] rounded-full" />}
            {error && <div className="text-red-500">{error}</div>}
            {userProfile && (
              <div className="flex flex-col items-center">
                <Image
                  src={userProfile.avatar_url}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <h2 className="text-xl font-semibold mt-2">
                  {userProfile.name || "No Name Provided"}
                </h2>
                <p className="text-gray-600">@{userProfile.login}</p>
                <p className="text-gray-500">{userProfile.bio || "No Bio Available"}</p>
                <div className="flex gap-4 mt-4">
                  <div>
                    <p className="font-bold">{userProfile.followers}</p>
                    <p>Followers</p>
                  </div>
                  <div>
                    <p className="font-bold">{userProfile.following}</p>
                    <p>Following</p>
                  </div>
                  <div>
                    <p className="font-bold">{userProfile.public_repos}</p>
                    <p>Repos</p>
                  </div>
                </div>
                <a href="href={userProfile.html_url}" target="_blank">click here to view profile</a>
                <h3 className="mt-6 text-lg font-bold">Repositories</h3>
                <div className="w-full mt-4">
                  {userRepos.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {userRepos.map((repo) => (
                        <li key={repo.name} className="my-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                            rel="noopener noreferrer"
                          >
                            {repo.name}
                          </a>
                          <p className="text-gray-500 text-sm">
                            {repo.description || "No description available"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No repositories available</p>
                  )}
                </div>
              </div>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

