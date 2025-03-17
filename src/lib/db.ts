import { Pool } from "pg"; // Importa la clase `Pool` desde la librería `pg`

// Validar la existencia de la variable de entorno
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno");
}

// Configuración del pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined, // Configuración SSL para producción
});

// Evento para manejar errores en el pool
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL", err);
  process.exit(-1); // Termina la aplicación en caso de un error crítico
});

// Función para cerrar el pool al finalizar la aplicación
export async function closePool() {
  try {
    await pool.end();
    console.log("Conexión con la base de datos cerrada");
  } catch (error) {
    console.error("Error al cerrar la conexión con la base de datos", error);
  }
}

// Exportar el pool para uso en otros archivos
export { pool };