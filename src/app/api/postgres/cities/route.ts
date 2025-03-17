import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // Ajusta la ruta si es necesario

// Obtener todas las ciudades de un usuario específico
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      "SELECT * FROM cities WHERE user_id = $1",
      [userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Error fetching cities" },
      { status: 500 }
    );
  }
}

// Crear una nueva ciudad para un usuario específico
export async function POST(request: Request) {
  try {
    const { userId, coordinates } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      "INSERT INTO cities (user_id, coordinates) VALUES ($1, $2) RETURNING *",
      [userId, coordinates]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json({ error: "Error creating city" }, { status: 500 });
  }
}

// Actualizar una ciudad existente de un usuario específico
export async function PUT(request: Request) {
  try {
    const { id, userId, coordinates } = await request.json();

    console.log("id", id);
    console.log("userId API", userId);
    console.log("coordinates", coordinates);

    if (!userId || !id) {
      return NextResponse.json(
        { error: "User ID and City ID are required" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query(
      "UPDATE cities SET coordinates = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [coordinates, id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "City not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0]);

  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json({ error: "Error updating city" }, { status: 500 });
  }
}


// Eliminar una ciudad de un usuario específico
export async function DELETE(request: Request) {
  try {
    const { id, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { rowCount } = await pool.query(
      "DELETE FROM cities WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "City not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json({ error: "Error deleting city" }, { status: 500 });
  }
}

