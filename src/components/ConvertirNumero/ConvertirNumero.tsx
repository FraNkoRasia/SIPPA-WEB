export function numeroALetras(num: number | string): string {
  // Si es string, convertir a número eliminando separadores de miles y reemplazando coma por punto
  const numero =
    typeof num === "string"
      ? parseFloat(num.replace(/\./g, "").replace(",", "."))
      : num;

  const unidades = [
    "UNO",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
    "DIEZ",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISÉIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
    "VEINTE",
  ];

  const decenas = [
    "",
    "",
    "VEINTI",
    "TREINTA",
    "CUARENTA",
    "CINCUENTA",
    "SESENTA",
    "SETENTA",
    "OCHENTA",
    "NOVENTA",
  ];

  const centenas = [
    "",
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETECIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ];

  function convertir(n: number): string {
    if (n === 0) return "CERO";
    if (n <= 20) return unidades[n - 1];
    if (n < 100) {
      const dec = Math.floor(n / 10);
      const uni = n % 10;
      return (
        decenas[dec] +
        (uni > 0
          ? dec === 2
            ? unidades[uni - 1].toLowerCase()
            : " Y " + unidades[uni - 1]
          : "")
      );
    }
    if (n === 100) return "CIEN";
    if (n < 1000) {
      return (
        centenas[Math.floor(n / 100)] +
        (n % 100 > 0 ? " " + convertir(n % 100) : "")
      );
    }
    if (n < 1000000) {
      const miles = Math.floor(n / 1000);
      const resto = n % 1000;
      return (
        (miles === 1 ? "MIL" : convertir(miles) + " MIL") +
        (resto > 0 ? " " + convertir(resto) : "")
      );
    }
    const millones = Math.floor(n / 1000000);
    const resto = n % 1000000;
    return (
      (millones === 1 ? "UN MILLÓN" : convertir(millones) + " MILLONES") +
      (resto > 0 ? " " + convertir(resto) : "")
    );
  }

  const partes = numero.toFixed(2).split(".");
  const entero = parseInt(partes[0]);
  const centavos = partes[1];

  const literal = convertir(entero);
  const moneda = entero === 1 ? "PESO" : "PESOS";

  return `SON ${moneda}: ${literal} CON ${centavos}/100---------`;
}
