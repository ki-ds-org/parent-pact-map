
export type Pact = {
    id: string;
    name: string;
    municipality: string[];
    school?: string;
    coordinates: [number, number];
    studentCount: number;
    parentCount: number;
    contact?: string;
  };