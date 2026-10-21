import type { NumerologyChart } from "@/lib/numerology";

export function formatChartForPrompt(chart: NumerologyChart): string {
  return (
    `Numerology context (${chart.system} system):\n` +
    `- Life Path ${chart.lifePath.value}\n` +
    `- Birthday Number ${chart.birthdayNumber.value}\n` +
    `- Destiny ${chart.destiny.value}\n` +
    `- Soul Urge ${chart.soulUrge.value}\n` +
    `- Personality ${chart.personality.value}`
  );
}
