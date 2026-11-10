interface PactApiSchool {
  id: string;
  school: string;
  coordinates: [number, number];
  studentCount?: number;
  parentCount?: number;
  contact?: string | null;
}

interface PactApiMunicipality {
  municipality: string;
  schools?: PactApiSchool[];
}

interface PactApiResponse {
  municipalities: PactApiMunicipality[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSchool(value: unknown): value is PactApiSchool {
  if (!isRecord(value)) return false;
  const coordinates = value.coordinates;
  return (
    typeof value.id === "string" &&
    typeof value.school === "string" &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every((coordinate) => typeof coordinate === "number") &&
    (value.studentCount === undefined ||
      typeof value.studentCount === "number") &&
    (value.parentCount === undefined || typeof value.parentCount === "number") &&
    (value.contact === undefined ||
      value.contact === null ||
      typeof value.contact === "string")
  );
}

function isMunicipality(value: unknown): value is PactApiMunicipality {
  if (!isRecord(value)) return false;
  return (
    typeof value.municipality === "string" &&
    (value.schools === undefined ||
      (Array.isArray(value.schools) && value.schools.every(isSchool)))
  );
}

export function isPactApiResponse(value: unknown): value is PactApiResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.municipalities) &&
    value.municipalities.every(isMunicipality)
  );
}
