export interface Booking {
  start: number; // minutes after midnight
  end: number;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
}
