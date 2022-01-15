import { useEffect } from "react";
import { useAuth } from "./use-auth.js";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export function useRequireAuth(redirectUrl = "/login") {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user === false) {
      navigate(redirectUrl, {replace: false});
    }
  }, [auth,navigate,redirectUrl]);
  return auth;
}

export default useRequireAuth;