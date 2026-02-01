// Solapur coordinates: 17.6599° N, 75.9064° E
export const SOLAPUR_CENTER = {
  lat: 17.6599,
  lng: 75.9064,
};

// Helper functions
export const getPsiColor = (psi: number): string => {
  if (psi < 40) return "success";
  if (psi < 70) return "warning";
  return "destructive";
};

export const getPsiLabel = (psi: number): string => {
  if (psi < 40) return "Low";
  if (psi < 70) return "Moderate";
  return "High";
};

export const getTrafficColor = (level: "low" | "moderate" | "high"): string => {
  switch (level) {
    case "low":
      return "success";
    case "moderate":
      return "warning";
    case "high":
      return "destructive";
  }
};
