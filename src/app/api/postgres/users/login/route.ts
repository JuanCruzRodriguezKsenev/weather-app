// src/app/api/postgres/users/login/route.ts

import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Modifica la consulta para obtener más detalles del usuario
    const { rows } = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Devuelve el usuario completo
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
