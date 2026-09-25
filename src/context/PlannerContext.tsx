import React, { createContext, useContext, useState } from 'react';
import { PlannerState, TransportMode, BudgetTier } from '../types';

interface PlannerContextType {
  plannerState: PlannerState;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setStartingPoint: (city: string) => void;
  toggleDistrict: (districtId: string) => void;
  setSelectedDistricts: (districts: string[]) => void;
  setDurationDays: (days: number) => void;
  toggleInterest: (interest: string) => void;
  setInterests: (interests: string[]) => void;
  setTransport: (transport: TransportMode) => void;
  setBudgetTier: (tier: BudgetTier) => void;
  setTravelersCount: (count: number) => void;
  setEndPoint: (endPoint: string) => void;
  resetPlanner: () => void;
  preselectDistrict: (districtId: string) => void;
}

const DEFAULT_PLANNER_STATE: PlannerState = {
  startingPoint: 'Mangaluru',
  selectedDistricts: ['kodagu', 'chikkamagaluru'],
  durationDays: 4,
  interests: ['Nature', 'Trekking', 'Food'],
  transport: 'Car',
  budgetTier: 'Moderate',
  travelersCount: 2,
  endPoint: 'Return to starting point',
};

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plannerState, setPlannerState] = useState<PlannerState>(DEFAULT_PLANNER_STATE);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const setStartingPoint = (startingPoint: string) => {
    setPlannerState(prev => ({ ...prev, startingPoint }));
  };

  const toggleDistrict = (districtId: string) => {
    setPlannerState(prev => {
      const exists = prev.selectedDistricts.includes(districtId);
      if (exists) {
        if (prev.selectedDistricts.length === 1) return prev; // Keep at least one
        return {
          ...prev,
          selectedDistricts: prev.selectedDistricts.filter(id => id !== districtId),
        };
      } else {
        return {
          ...prev,
          selectedDistricts: [...prev.selectedDistricts, districtId],
        };
      }
    });
  };

  const setSelectedDistricts = (selectedDistricts: string[]) => {
    if (selectedDistricts.length > 0) {
      setPlannerState(prev => ({ ...prev, selectedDistricts }));
    }
  };

  const setDurationDays = (durationDays: number) => {
    setPlannerState(prev => ({ ...prev, durationDays }));
  };

  const toggleInterest = (interest: string) => {
    setPlannerState(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        if (prev.interests.length === 1) return prev;
        return {
          ...prev,
          interests: prev.interests.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest],
        };
      }
    });
  };

  const setInterests = (interests: string[]) => {
    setPlannerState(prev => ({ ...prev, interests }));
  };

  const setTransport = (transport: TransportMode) => {
    setPlannerState(prev => ({ ...prev, transport }));
  };

  const setBudgetTier = (budgetTier: BudgetTier) => {
    setPlannerState(prev => ({ ...prev, budgetTier }));
  };

  const setTravelersCount = (travelersCount: number) => {
    setPlannerState(prev => ({ ...prev, travelersCount: Math.max(1, travelersCount) }));
  };

  const setEndPoint = (endPoint: string) => {
    setPlannerState(prev => ({ ...prev, endPoint }));
  };

  const resetPlanner = () => {
    setPlannerState(DEFAULT_PLANNER_STATE);
    setCurrentStep(1);
  };

  const preselectDistrict = (districtId: string) => {
    setPlannerState(prev => ({
      ...prev,
      selectedDistricts: [districtId],
    }));
    setCurrentStep(1);
  };

  return (
    <PlannerContext.Provider
      value={{
        plannerState,
        currentStep,
        setCurrentStep,
        setStartingPoint,
        toggleDistrict,
        setSelectedDistricts,
        setDurationDays,
        toggleInterest,
        setInterests,
        setTransport,
        setBudgetTier,
        setTravelersCount,
        setEndPoint,
        resetPlanner,
        preselectDistrict,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
