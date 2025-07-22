// @license
// Copyright 2021 Google LLC
// SPDX-License-Identifier: Apache-2.0

// This component is a copy of the un-exported Polyline component from
// @vis.gl/react-google-maps.

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type Ref,
} from 'react';
import {useMap} from '@vis.gl/react-google-maps';

type PolylineProps = google.maps.PolylineOptions & {
  /**
   * This callback is called when the polyline instance has been created.
   * It can be used to access the native google.maps.Polyline object for
   * advanced usage.
   */
  onPolylineCreated?: (polyline: google.maps.Polyline) => void;
  /**
   * Retains the polyline instance between renders.
   * When true, the polyline will not be removed from the map and re-added
   * on every render.
   */
  static?: boolean;
};

/**
 * Component to render a polyline on a map
 */
export const Polyline = (props: PolylineProps): null => {
  const {onClick, onPolylineCreated, static: isStatic, ...options} = props;
  const map = useMap();
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);

  // create the polyline
  useEffect(() => {
    if (!map) return;

    const newPolyline = new google.maps.Polyline();
    if (onPolylineCreated) {
      onPolylineCreated(newPolyline);
    }
    setPolyline(newPolyline);

    // cleanup on unmount
    return () => {
      newPolyline.setMap(null);
    };
  }, [map, isStatic]);

  // bind the click event to the polyline
  useEffect(() => {
    if (!polyline || !onClick) return;

    const listener = polyline.addListener('click', e => {
      onClick(e);
    });

    return () => {
      listener.remove();
    };
  }, [polyline, onClick]);

  useMemo(() => {
    polyline?.setOptions(options);
  }, [polyline, options]);

  // add the polyline to the map
  useEffect(() => {
    polyline?.setMap(map ?? null);
  }, [map, polyline]);

  return null;
};
