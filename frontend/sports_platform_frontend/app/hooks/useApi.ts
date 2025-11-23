"use client";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const useApi = () => {
  const { getToken } = useAuth();
  const [api, setApi] = useState(axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  }));

  useEffect(() => {
    const newApi = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    });

    newApi.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    setApi(newApi);
  }, [getToken]);

  return api;
};

export default useApi;
