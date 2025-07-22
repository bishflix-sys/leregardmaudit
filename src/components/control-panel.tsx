'use client';

import type { NumericalID } from '@/lib/types';
import { ALL_TAGS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Bot, Loader, MapPin, Search, Tag, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';


interface ControlPanelProps {
  ids: NumericalID[];
  selectedId: NumericalID | undefined;
  onSelectId: (id: string | null) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  activeTags: string[];
  onActiveTagsChange: (tags: string[]) => void;
  onInterpretAnomaly: (id: string) => void;
}

export default function ControlPanel({
  ids,
  selectedId,
  onSelectId,
  searchTerm,
  onSearchTermChange,
  activeTags,
  onActiveTagsChange,
  onInterpretAnomaly,
}: ControlPanelProps) {
  
  const handleTagChange = (tag: string) => {
    const newTags = activeTags.includes(tag)
      ? activeTags.filter(t => t !== tag)
      : [...activeTags, tag];
    onActiveTagsChange(newTags);
  };

  return (
    <aside className="border-r border-border flex flex-col bg-card overflow-y-auto">
      {selectedId ? (
        <InspectorPanel 
          idData={selectedId} 
          onBack={() => onSelectId(null)}
          onInterpretAnomaly={onInterpretAnomaly}
        />
      ) : (
        <ListPanel
          ids={ids}
          onSelectId={onSelectId}
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          activeTags={activeTags}
          handleTagChange={handleTagChange}
        />
      )}
    </aside>
  );
}

function ListPanel({ ids, onSelectId, searchTerm, onSearchTermChange, activeTags, handleTagChange }: any) {
    return (
        <div className="flex-1 flex flex-col">
            <div className="p-4 space-y-4">
                <div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par ID..."
                            value={searchTerm}
                            onChange={(e) => onSearchTermChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground">Filtres par tag</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {ALL_TAGS.map(tag => (
                            <div key={tag} className="flex items-center space-x-2">
                                <Checkbox
                                    id={tag}
                                    checked={activeTags.includes(tag)}
                                    onCheckedChange={() => handleTagChange(tag)}
                                />
                                <Label htmlFor={tag} className="text-sm font-normal capitalize cursor-pointer">{tag}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {ids.map(id => (
                        <Card
                            key={id.id}
                            onClick={() => onSelectId(id.id)}
                            className={`cursor-pointer hover:bg-muted/50 transition-colors mb-2 ${id.alert ? 'border-destructive' : ''}`}
                        >
                            <CardContent className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm">{id.metadata.name}</p>
                                    <p className="text-xs text-muted-foreground">{id.id}</p>
                                </div>
                                {id.alert && <AlertCircle className="h-5 w-5 text-destructive" />}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

function InspectorPanel({ idData, onBack, onInterpretAnomaly }: { idData: NumericalID, onBack: () => void, onInterpretAnomaly: (id: string) => void }) {
    return (
        <div className="p-4 flex-1 flex flex-col">
             <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold font-headline">{idData.metadata.name}</h2>
            </div>
            <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center">
                                <MapPin className="h-4 w-4 mr-2 text-primary" /> Informations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p><strong className="text-muted-foreground">ID:</strong> {idData.id}</p>
                            <p><strong className="text-muted-foreground">Type:</strong> <span className="capitalize">{idData.metadata.type}</span></p>
                            <p><strong className="text-muted-foreground">Dernière MàJ:</strong> {formatDistanceToNow(new Date(idData.currentPosition.timestamp), { addSuffix: true, locale: fr })}</p>
                            <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                <div className="flex flex-wrap gap-1">
                                    {idData.metadata.tags.map(tag => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center">
                                    <Bot className="h-4 w-4 mr-2 text-primary" />
                                    Analyse d'Anomalie
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {idData.isProcessingAnomaly ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader className="h-6 w-6 animate-spin text-primary" />
                                    <p className="ml-2">Analyse en cours...</p>
                                </div>
                            ) : idData.anomaly ? (
                                <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground italic">"{idData.anomaly.interpretation}"</p>
                                    <div className="flex items-center">
                                        <strong className="mr-2">Confiance:</strong>
                                        <div className="w-full bg-muted rounded-full h-2.5">
                                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${idData.anomaly.confidence * 100}%` }}></div>
                                        </div>
                                        <span className="ml-2 font-mono">{Math.round(idData.anomaly.confidence * 100)}%</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune analyse d'anomalie effectuée.</p>
                            )}
                             <Button onClick={() => onInterpretAnomaly(idData.id)} disabled={idData.isProcessingAnomaly} className="w-full mt-4">
                                {idData.isProcessingAnomaly ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                Interpréter l'Anomalie
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
