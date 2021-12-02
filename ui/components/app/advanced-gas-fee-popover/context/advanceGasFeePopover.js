import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AdvanceGasFeePopoverContext = createContext({});

export const AdvanceGasFeePopoverContextProvider = ({ children }) => {
  const [gasLimit, setGasLimit] = useState();
  const [maxFeePerGas, setMaxFeePerGas] = useState();
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState();
  const [isDirty, setDirty] = useState();
  const [baseFeeMultiplier, setBaseFeeMultiplier] = useState();

  return (
    <AdvanceGasFeePopoverContext.Provider
      value={{
        gasLimit,
        isDirty,
        maxFeePerGas,
        maxPriorityFeePerGas,
        baseFeeMultiplier,
        setDirty,
        setGasLimit,
        setMaxPriorityFeePerGas,
        setMaxFeePerGas,
        setBaseFeeMultiplier,
      }}
    >
      {children}
    </AdvanceGasFeePopoverContext.Provider>
  );
};

export function useAdvanceGasFeePopoverContext() {
  return useContext(AdvanceGasFeePopoverContext);
}

AdvanceGasFeePopoverContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
