import { createContext, useContext } from 'react';
import { useToast as useChakraToast } from '@chakra-ui/react';

// Creëer de context
export const ToastContext = createContext();

// Exporteer de hook
export const useToast = () => useContext(ToastContext);

// ToastProvider component
export const ToastProvider = ({ children }) => {
  const toast = useChakraToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
};