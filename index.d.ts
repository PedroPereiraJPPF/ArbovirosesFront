import * as L from 'leaflet';

declare module 'leaflet' {
  function heatLayer(
    latlngs: L.LatLngExpression[],
    options?: HeatMapOptions
  ): HeatLayer;

  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  interface heatLayer extends L.Layer {
    setLatLngs(latlngs: L.LatLngExpression[]): this;
    addLatLng(latlng: L.LatLngExpression): this;
    setOptions(options: HeatMapOptions): this;
  }
}
