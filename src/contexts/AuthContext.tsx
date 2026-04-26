import { createContext, useContext, type ReactNode } from "react";

type DemoUser = {
  email: string;
  user_metadata: {
    display_name: string;
  };
};

type AuthContextValue = {
  user: DemoUser;
  loading: false;
  signOut: () => void;
};

const demoUser: DemoUser = {
  email: "demo@polyquant.local",
  user_metadata: {
    display_name: "Portfolio Demo",
  },
};

const AuthContext = createContext<AuthContextValue>({
  user: demoUser,
  loading: false,
  signOut: () => undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider
    value={{
      user: demoUser,
      loading: false,
      signOut: () => undefined,
    }}
  >
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => useContext(AuthContext);
