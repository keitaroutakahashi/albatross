import { Cloudy, Snowflake, Sun, Umbrella } from "lucide-react";
import type { Weather } from "@/generated/prisma/enums";

type Props = {
  weather: Weather | undefined;
};

export const WeatherIcon = ({ weather }: Props) => {
  if (!weather) return null;

  if (weather === "sunny") {
    return <Sun className="text-red-400" />;
  }

  if (weather === "cloudy") {
    return <Cloudy className="text-gray-500" />;
  }

  if (weather === "rainy") {
    return <Umbrella className="text-blue-400" />;
  }

  if (weather === "snowy") {
    return <Snowflake />;
  }

  return null;
};
