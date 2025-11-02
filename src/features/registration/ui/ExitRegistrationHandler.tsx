import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { exitRegistration } from '../lib/storage';

export function useExitRegistration() {
  const navigate = useNavigate();

  return useCallback(() => exitRegistration(navigate as any), [navigate]);
}
