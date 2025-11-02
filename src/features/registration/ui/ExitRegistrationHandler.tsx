import { useCallback } from 'react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { exitRegistration } from '../lib/storage';

export function useExitRegistration() {
  const navigate: NavigateFunction = useNavigate();
  return useCallback(() => exitRegistration(navigate), [navigate]);
}
