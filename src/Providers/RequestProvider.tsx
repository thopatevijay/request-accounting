import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react';
import { IRequestDataWithEvents } from '@requestnetwork/request-client.js/dist/types';
import { useRequestNetwork } from '@/hooks';

interface RequestContextType {
  requests: IRequestDataWithEvents[];
  isLoading: boolean;
  error: unknown;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchAllRequests } = useRequestNetwork();
  const [requests, setRequests] = useState<IRequestDataWithEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const requests = await fetchAllRequests();
        if (requests) {
          setRequests(requests);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchAllRequests]);

  return (
    <RequestContext.Provider value={{ requests, isLoading, error }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
