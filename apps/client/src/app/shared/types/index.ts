import { Type } from "@angular/core";

export * from "./category"

export interface User {
  id: number;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DialogConfig<T = unknown> {

  title: string;

  subtitle?: string;

  component: Type<T>;

  inputs?: Record<string, unknown>;

  width?: string;

}
