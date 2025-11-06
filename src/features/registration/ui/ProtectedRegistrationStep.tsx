import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isStepAccessible } from '../lib/storage';

export interface ProtectedRegistrationStepProps {
  requiredStep: number;
  children: React.ReactElement;
}

export function ProtectedRegistrationStep({
  requiredStep,
  children,
}: ProtectedRegistrationStepProps) {
  const location = useLocation();

  if (!isStepAccessible(requiredStep + 1)) {
    return <Navigate to="/register/1" replace state={{ from: location }} />;
  }

  return children;
}
