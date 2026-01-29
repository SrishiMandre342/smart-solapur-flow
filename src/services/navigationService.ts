export const openGoogleMapsNavigation = (
  user: { lat: number; lng: number },
  zone: { lat: number; lng: number }
) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${user.lat},${user.lng}&destination=${zone.lat},${zone.lng}&travelmode=driving`;

  window.open(url, "_blank");
};
