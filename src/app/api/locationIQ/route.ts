import { NextResponse } from "next/server";

class LocationAPIError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "LocationAPIError";
  }
}

const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY; // Asegúrate de configurar esta variable en `.env.local`
const LOCATIONIQ_BASE_URL = "https://us1.locationiq.com/v1/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const endpoint = `${LOCATIONIQ_BASE_URL}?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
    query
  )}&format=json`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new LocationAPIError(
        "Error fetching data from LocationIQ",
        response.status
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new LocationAPIError("Invalid data structure from LocationIQ");
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof LocationAPIError) {
      return NextResponse.json(
        { error: error.message, statusCode: error.statusCode },
        { status: error.statusCode || 500 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
