import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Leer el archivo JSON base
    const filePath = path.join(process.cwd(), 'src', 'data', 'operariosConHistorial.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContents);

    // Como estamos en el servidor, no podemos acceder directamente al localStorage
    // Devolvemos un indicador para que el cliente combine los datos
    return NextResponse.json({
      baseOperarios: jsonData.operarios,
      needsLocalStorage: true
    });

  } catch (error) {
    console.error('Error al leer los datos de operarios:', error);
    return NextResponse.json(
      { error: 'Error al cargar los datos de operarios' },
      { status: 500 }
    );
  }
} 