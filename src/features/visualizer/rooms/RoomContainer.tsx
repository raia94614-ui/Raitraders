import React from 'react';
import { useVisualizerStore } from '../store/visualizerStore';
import { LivingRoom } from './LivingRoom';
import { MasterBedroom } from './MasterBedroom';
import { KidsRoom } from './KidsRoom';
import { KitchenRoom } from './KitchenRoom';
import { DiningRoom } from './DiningRoom';
import { BathroomRoom } from './BathroomRoom';
import { PoojaRoom } from './PoojaRoom';
import { BalconyRoom } from './BalconyRoom';
import { HallwayRoom } from './HallwayRoom';
import { ExteriorVilla } from './ExteriorVilla';

export const RoomContainer: React.FC = () => {
  const { activeRoom } = useVisualizerStore();

  switch (activeRoom) {
    case 'living':
      return <LivingRoom />;
    case 'master_bedroom':
      return <MasterBedroom />;
    case 'kids':
      return <KidsRoom />;
    case 'kitchen':
      return <KitchenRoom />;
    case 'dining':
      return <DiningRoom />;
    case 'bathroom':
      return <BathroomRoom />;
    case 'pooja':
      return <PoojaRoom />;
    case 'balcony':
      return <BalconyRoom />;
    case 'hallway':
      return <HallwayRoom />;
    case 'exterior':
      return <ExteriorVilla />;
    default:
      return <LivingRoom />;
  }
};
