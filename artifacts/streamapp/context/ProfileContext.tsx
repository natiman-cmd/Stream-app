import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "@streamapp/profile";

interface Profile {
  name: string;
  plan: string;
}

interface ProfileContextValue {
  profile: Profile;
  updateName: (name: string) => void;
}

const DEFAULT_PROFILE: Profile = {
  name: "Your Name",
  plan: "Premium",
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

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
    });
  }, []);

  const updateName = useCallback((name: string) => {
    const trimmed = name.trim() || DEFAULT_PROFILE.name;
    setProfile((prev) => {
      const next = { ...prev, name: trimmed };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateName }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
}
