/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import { authService } from "../services/auth.service";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  image: string;
  price: string;
  stock: number;
}

type AppContextType = {
  showToast: (message: string, type: "SUCCESS" | "ERROR") => void;
  isLoggedIn: boolean;
  isAuthLoading: boolean;

  userId: string | null;
  userRole: "admin" | "user" | null;

  searchData: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  setUserData: (id: string | null, role: "admin" | "user" | null) => void;
  setListSearch: (data: any) => void;
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastMessage>();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  const [searchData, setSearchData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  /** VALIDATE TOKEN */
  const { data, isLoading: isAuthLoading } = useQuery(
    "validateToken",
    () => authService.validateToken(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.valid) {
          setUserId(data.userId);
          setUserRole(data.role);
        }
      },
      onError: () => {
        setUserId(null);
        setUserRole(null);
      }
    }
  );

  const isLoggedIn = data?.valid === true && !isAuthLoading;

  const setUserData = (id: string | null, role: "admin" | "user" | null) => {
    setUserId(id);
    setUserRole(role);
  };


  const setListSearch = (data: any) => {
    setSearchData(data?.results ?? []);
  };

  return (
    <AppContext.Provider
      value={{
        showToast: (message, type) => setToast({ message, type }),
        isLoggedIn,
        isAuthLoading,
        userId,
        userRole,
        searchData,
        searchTerm,
        setSearchTerm,
        setUserData,
        setListSearch
      }}
    >

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}

      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside <AppContextProvider/>");
  }
  return ctx;
};
