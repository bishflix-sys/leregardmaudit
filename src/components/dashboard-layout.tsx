'use client';

import { useState, useEffect, useMemo } from 'react';
import type { NumericalID } from '@/lib/types';
import { MOCK_IDs } from '@/lib/mock-data';
import { interpretAnomaly } from '@/ai/flows/interpret-anomaly';
import { useToast } from '@/hooks/use-toast';
import ControlPanel from '@/components/control-panel';
import MapView from '@/components/map-view';
import { Activity } from 'lucide-react';

export default function DashboardLayout() {
  const [ids, setIds] = useState<NumericalID[]>(MOCK_IDs);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setIds(prevIds => {
        const randomIndex = Math.floor(Math.random() * prevIds.length);
        return prevIds.map((id, index) => {
          if (index === randomIndex) {
            const newLat = id.currentPosition.lat + (Math.random() - 0.5) * 0.001;
            const newLng = id.currentPosition.lng + (Math.random() - 0.5) * 0.001;
            const newPosition = { lat: newLat, lng: newLng, timestamp: Date.now() };
            return {
              ...id,
              currentPosition: newPosition,
              movementHistory: [...id.movementHistory, newPosition],
            };
          }
          return id;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const handleSelectId = (id: string | null) => {
    setSelectedId(id);
  };

  const handleInterpretAnomaly = async (id: string) => {
    const targetId = ids.find(i => i.id === id);
    if (!targetId) return;

    setIds(prev => prev.map(i => i.id === id ? { ...i, isProcessingAnomaly: true } : i));

    try {
      const result = await interpretAnomaly({
        id: targetId.id,
        movementData: JSON.stringify(targetId.movementHistory),
        metadata: JSON.stringify(targetId.metadata),
      });

      setIds(prev =>
        prev.map(i =>
          i.id === id
            ? { ...i, anomaly: result, alert: result.confidence > 0.8, isProcessingAnomaly: false }
            : i
        )
      );
      toast({
        title: "Analyse terminée",
        description: `L'anomalie pour ${id} a été interprétée.`,
      });

    } catch (error) {
      console.error('Failed to interpret anomaly:', error);
      toast({
        variant: 'destructive',
        title: "Erreur d'analyse",
        description: "L'interprétation de l'anomalie a échoué.",
      });
      setIds(prev => prev.map(i => i.id === id ? { ...i, isProcessingAnomaly: false } : i));
    }
  };

  const filteredIds = useMemo(() => {
    return ids
      .filter(id => id.id.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(id => activeTags.length === 0 || activeTags.every(tag => id.metadata.tags.includes(tag)));
  }, [ids, searchTerm, activeTags]);

  const currentSelectedIdData = useMemo(() => {
    return ids.find(id => id.id === selectedId);
  }, [ids, selectedId]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center h-16 px-6 border-b border-border flex-shrink-0">
         <Activity className="h-6 w-6 mr-3 text-primary" />
        <h1 className="text-xl font-bold tracking-tighter font-headline">Le Regard Maudit</h1>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[400px_1fr] overflow-hidden">
        <ControlPanel
          ids={filteredIds}
          selectedId={currentSelectedIdData}
          onSelectId={handleSelectId}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          activeTags={activeTags}
          onActiveTagsChange={setActiveTags}
          onInterpretAnomaly={handleInterpretAnomaly}
        />
        <MapView ids={filteredIds} selectedId={currentSelectedIdData} onSelectId={handleSelectId} />
      </div>
    </div>
  );
}
