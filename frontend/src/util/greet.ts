export function greet() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 12 && hour < 18) {
    return "Boa Tarde";
  } else if (hour >= 6 && hour < 12) {
    return "Bom Dia";
  } else {
    return "Boa noite";
  }
}
