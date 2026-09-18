import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@streamapp/player-profile";

interface Profile {
  name: string;
  plan: string;
}

interface ProfileContextValue {
  profile: Profile;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  updateName: (name: string) => void;
  completeOnboarding: (name: string) => void;
}

const DEFAULT_PROFILE: Profile = {
  name: "New Player",
  plan: "Player",
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<Profile>;
          setProfile((prev) => ({ ...prev, ...saved }));
        } catch {
          // ignore corrupt data
        }
      }
      setIsLoading(false);
    });
  }, []);

  const saveProfile = useCallback((next: Profile) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setProfile(next);
  }, []);

  const updateName = useCallback((name: string) => {
    const trimmed = name.trim() || DEFAULT_PROFILE.name;
    setProfile((prev) => {
      const next = { ...prev, name: trimmed };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeOnboarding = useCallback(
    (name: string) => {
      saveProfile({ ...DEFAULT_PROFILE, name: name.trim() });
    },
    [saveProfile],
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        hasCompletedOnboarding:
          profile.name.trim().length > 0 && profile.name !== DEFAULT_PROFILE.name,
        updateName,
        completeOnboarding,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
