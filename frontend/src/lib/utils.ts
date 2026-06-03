import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JWTPayload {
  id_user: number;
  role: string;
  nama: string;
  exp: number;
}

export function getPayloadToken(): JWTPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    console.error("Gagal mendecode token:", error);
    return null;
  }
}

export function getRoleFromToken(): string | null {
  const payload = getPayloadToken();
  return payload ? payload.role : null;
}

export function getNameFromToken(): string | null {
  const payload = getPayloadToken();
  return payload ? payload.nama : null;
}

export function clearAuth() {
  localStorage.removeItem("token");
}
