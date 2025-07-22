'use client';

import { APIProvider, Map, AdvancedMarker, Pin, Polyline } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '@/config';
import type { NumericalID } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PulsingMapMarkerIcon } from '@/components/icons';

interface MapViewProps {
  ids: NumericalID[];
  selectedId: NumericalID | undefined;
  onSelectId: (id: string) => void;
}

export default function MapView({ ids, selectedId, onSelectId }: MapViewProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <Card className="max-w-md m-4">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-bold">Configuration Requise</h2>
            <p className="text-muted-foreground">
              Veuillez fournir une clé API Google Maps dans votre fichier `.env.local` sous la variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` pour afficher la carte.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const center = selectedId ? selectedId.currentPosition : { lat: 48.8566, lng: 2.3522 };
  const zoom = selectedId ? 14 : 12;

  return (
    <section className="relative h-full w-full">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId="le-regard-maudit-map"
          center={center}
          zoom={zoom}
          disableDefaultUI={true}
          gestureHandling={'greedy'}
          className="w-full h-full"
          styles={[
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }],
            },
          ]}
        >
          {ids.map(id => (
            <AdvancedMarker
              key={id.id}
              position={id.currentPosition}
              onClick={() => onSelectId(id.id)}
              title={id.metadata.name}
            >
              {id.alert ? (
                <PulsingMapMarkerIcon className="text-destructive h-8 w-8 drop-shadow-lg" fill="currentColor" />
              ) : (
                <Pin
                    background={'hsl(var(--primary))'}
                    borderColor={'hsl(var(--primary-foreground))'}
                    glyphColor={'hsl(var(--primary-foreground))'}
                />
              )}
            </AdvancedMarker>
          ))}
          {selectedId && (
            <Polyline
              path={selectedId.movementHistory}
              strokeColor="hsl(var(--accent))"
              strokeOpacity={0.8}
              strokeWeight={3}
            />
          )}
        </Map>
      </APIProvider>
    </section>
  );
}
