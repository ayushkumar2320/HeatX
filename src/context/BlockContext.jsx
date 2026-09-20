import { createContext, useContext, useState } from 'react';
import { mockBlocks } from '../data/mockBlocks';

const BlockContext = createContext();

export function BlockProvider({ children }) {
  const [selectedBlock, setSelectedBlock] = useState(mockBlocks[0]); // default to Bhubaneswar
  const [activeLayer, setActiveLayer] = useState('wbgt'); // 'wbgt' | 'temperature' | 'aqi' | 'lst'
  const [forecastHorizon, setForecastHorizon] = useState('T1'); // 'T1' | 'T3' | 'T5'
  const [districtFilter, setDistrictFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const selectBlockById = (blockId) => {
    const found = mockBlocks.find(b => b.block_id === blockId);
    if (found) {
      setSelectedBlock(found);
      setModalOpen(true);
    }
  };

  const openModal = (block = null) => {
    if (block) setSelectedBlock(block);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <BlockContext.Provider
      value={{
        blocks: mockBlocks,
        selectedBlock,
        setSelectedBlock,
        selectBlockById,
        activeLayer,
        setActiveLayer,
        forecastHorizon,
        setForecastHorizon,
        districtFilter,
        setDistrictFilter,
        modalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
}

export function useBlock() {
  const ctx = useContext(BlockContext);
  if (!ctx) {
    throw new Error('useBlock must be used within a BlockProvider');
  }
  return ctx;
}
