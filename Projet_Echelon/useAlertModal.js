import React, { createContext, useContext, useState} from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [visibleM, setVisibleM] = useState(null)

  return (
    <ModalContext.Provider value={{ visibleM, setVisibleM }}>
      {children}
    </ModalContext.Provider>
  );
};
