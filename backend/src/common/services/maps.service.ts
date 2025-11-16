import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';

@Injectable()
export class MapsService {
  private client: Client;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.client = new Client({});
    this.apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
  }

  /**
   * Geocode an address to coordinates
   */
  async geocode(address: string): Promise<{ lat: number; lng: number }> {
    try {
      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey,
        },
      });

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      throw new Error('Address not found');
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  /**
   * Calculate distance between two points
   */
  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ): Promise<{ distance: number; duration: number }> {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: [`${origin.lat},${origin.lng}`],
          destinations: [`${destination.lat},${destination.lng}`],
          key: this.apiKey,
        },
      });

      const element = response.data.rows[0].elements[0];

      return {
        distance: element.distance.value, // in meters
        duration: element.duration.value, // in seconds
      };
    } catch (error) {
      throw new Error(`Distance calculation failed: ${error.message}`);
    }
  }

  /**
   * Get directions between points
   */
  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints?: Array<{ lat: number; lng: number }>,
  ): Promise<any> {
    try {
      const params: any = {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        key: this.apiKey,
      };

      if (waypoints && waypoints.length > 0) {
        params.waypoints = waypoints.map((wp) => `${wp.lat},${wp.lng}`);
      }

      const response = await this.client.directions({ params });
      return response.data;
    } catch (error) {
      throw new Error(`Directions failed: ${error.message}`);
    }
  }

  /**
   * Search nearby places
   */
  async searchNearby(
    location: { lat: number; lng: number },
    radius: number,
    type?: string,
  ): Promise<any> {
    try {
      const response = await this.client.placesNearby({
        params: {
          location: `${location.lat},${location.lng}`,
          radius,
          type,
          key: this.apiKey,
        },
      });

      return response.data.results;
    } catch (error) {
      throw new Error(`Nearby search failed: ${error.message}`);
    }
  }
}
