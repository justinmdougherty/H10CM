import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setCurrentProgram, fetchUserPrograms } from '../services/api';
import certificateService from '../services/certificateService';

interface Program {
  program_id: number;
  program_name: string;
  program_code: string;
  program_description?: string;
  is_active: boolean;
}

interface UserProgramAccess {
  program_id: number;
  program_name: string;
  program_code: string;
  access_level: string;
  user_role: string;
}

interface ProgramContextType {
  currentProgram: Program | null;
  availablePrograms: UserProgramAccess[];
  isLoading: boolean;
  error: string | null;
  switchProgram: (programId: number) => Promise<void>;
  refreshPrograms: () => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider: React.FC<ProgramProviderProps> = ({ children }) => {
  const [currentProgram, setCurrentProgramState] = useState<Program | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<UserProgramAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default Program configuration (fallback for development/setup)
  const DEFAULT_PROGRAM: Program = {
    program_id: 1,
    program_name: 'default',
    program_code: 'default',
    program_description: 'default',
    is_active: true,
  };

  // Initialize program context
  useEffect(() => {
    initializePrograms();
  }, []);

  const initializePrograms = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Initializing programs with authentication...');

      // Try to authenticate and fetch user's available programs from the API
      try {
        console.log('Attempting to authenticate user...');

        // Get certificate info for debugging
        const userInfo = await certificateService.getCurrentUser();
        console.log('Certificate user info:', userInfo);

        // Try to fetch user programs (this will trigger authentication)
        console.log('Fetching user programs from API...');
        const userPrograms = await fetchUserPrograms();
        console.log('Received user programs:', userPrograms);

        if (userPrograms && userPrograms.length > 0) {
          // Convert API response to our expected format
          const formattedPrograms = userPrograms.map((p) => ({
            program_id: p.program_id,
            program_name: p.program_name,
            program_code: p.program_code,
            access_level: 'Read', // Default access level
            user_role: 'User', // Default role
          }));

          setAvailablePrograms(formattedPrograms);

          // Check if default program is available
          const defaultProgram = formattedPrograms.find((p) => p.program_code === 'default');
          if (defaultProgram) {
            const defaultProgramFull: Program = {
              program_id: defaultProgram.program_id,
              program_name: defaultProgram.program_name,
              program_code: defaultProgram.program_code,
              is_active: true,
            };
            console.log('Found default program, switching to it:', defaultProgramFull);
            await switchToProgram(defaultProgramFull);
          } else {
            // Default to the first available program if default is not available
            const firstProgram = formattedPrograms[0];
            const firstProgramFull: Program = {
              program_id: firstProgram.program_id,
              program_name: firstProgram.program_name,
              program_code: firstProgram.program_code,
              is_active: true,
            };
            console.log('Default program not found, switching to first program:', firstProgramFull);
            await switchToProgram(firstProgramFull);
          }
        } else {
          // No programs available from API, default to default program for development
          console.warn('No programs available from API. Please contact your administrator.');
          setError('No programs available. Please contact your administrator.');
          await switchToProgram(DEFAULT_PROGRAM);
        }
      } catch (apiError: any) {
        console.error('API Error details:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          headers: apiError.response?.headers,
        });

        if (apiError.response?.status === 401) {
          setError('Authentication failed: User not authorized. Please check your certificate.');
        } else {
          setError(`API Error: ${apiError.message}`);
        }

        console.warn('Could not fetch user programs from API, defaulting to default program');
        // Default to default program for development when API is not available
        await switchToProgram(DEFAULT_PROGRAM);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize programs';
      setError(errorMessage);
      console.error('Error initializing programs:', err);

      // Even on error, default to default program
      await switchToProgram(DEFAULT_PROGRAM);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToProgram = async (program: Program) => {
    setCurrentProgramState(program);
    setCurrentProgram(program.program_id);

    // Store in localStorage for persistence
    localStorage.setItem('current_program', JSON.stringify(program));

    console.log(`Switched to program: ${program.program_name} (ID: ${program.program_id})`);
  };

  const switchProgram = async (programId: number): Promise<void> => {
    try {
      // Find the program in available programs
      const programAccess = availablePrograms.find((p) => p.program_id === programId);
      if (programAccess) {
        const program: Program = {
          program_id: programAccess.program_id,
          program_name: programAccess.program_name,
          program_code: programAccess.program_code,
          is_active: true,
        };
        await switchToProgram(program);
      } else {
        throw new Error(`Program ${programId} not found in available programs`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch program');
      throw err;
    }
  };

  const refreshPrograms = async (): Promise<void> => {
    await initializePrograms();
  };

  const contextValue: ProgramContextType = {
    currentProgram,
    availablePrograms,
    isLoading,
    error,
    switchProgram,
    refreshPrograms,
  };

  return <ProgramContext.Provider value={contextValue}>{children}</ProgramContext.Provider>;
};

export const useProgram = (): ProgramContextType => {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};

export default ProgramContext;
