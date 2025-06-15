//recibo/page.tsx
"use client";
import { Button, Typography } from "@mui/material";
import { useFormContext } from "@/context/FormContext";
import { generarConceptos } from "@/utils/calculosRecibo";
import { numeroALetras } from "@/components/ConvertirNumero/ConvertirNumero";
import { useRouter } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";
import { Box } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

// Función para formatear números con separadores de miles y decimales
const formatearNumero = (numero: number | string): string => {
  const num = typeof numero === "string" ? parseFloat(numero) : numero;
  return num.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ReciboPage() {
  const { empleado } = useFormContext();
  const router = useRouter();

  if (!empleado) {
    return (
      <main className="recibo-main min-h-screen">
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mb: 50,
            mt: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <div className="bg-red-500/80 p-4 rounded-md shadow-md">
            <Typography className="text-white text-center">
              No hay datos cargados para generar el Recibo.
            </Typography>
          </div>
        </Box>
      </main>
    );
  }

  const conceptos = generarConceptos(empleado);

  const totalRemunerativoNumber = conceptos
    .map((c) => parseFloat(String(c.remunerativo)) || 0)
    .reduce((total, val) => total + val, 0);

  const totalNoRemunerativoNumber = conceptos.reduce((total, c) => {
    const noremunerativo = parseFloat(String(c.noremunerativo)) || 0;
    const compensacion = parseFloat(String(c.compensacion)) || 0;
    return total + noremunerativo + compensacion;
  }, 0);

  const totalDescuentosNumber = conceptos
    .map((c) => parseFloat(String(c.descuentos)) || 0)
    .reduce((total, val) => total + val, 0);

  // Formateos para mostrar
  const totalRemunerativo = formatearNumero(totalRemunerativoNumber);
  const totalNoRemunerativo = formatearNumero(totalNoRemunerativoNumber);
  const totalDescuentos = formatearNumero(totalDescuentosNumber);

  // Cálculo correcto del neto
  const totalNeto = formatearNumero(
    totalRemunerativoNumber + totalNoRemunerativoNumber - totalDescuentosNumber
  );

  return (
    <motion.main className="recibo-main" initial="initial" animate="animate" variants={fadeIn}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mb: 4,
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 0, sm: 0 },
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          variant="contained"
          size="medium"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            py: 1,
            px: 2,
            fontSize: "0.875rem",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Volver
        </Button>
        <div className="recibo-titulo-container">
          <h1 className="recibo-titulo">
            Recibo de: {empleado.nombreCompleto}
          </h1>
        </div>
      </Box>

      {/* NUEVO RECIBO */}
      <div className="recibo-container">
        <div className="recibo-header-grid">
          <div className="recibo-logo-container">
            <Image
              src="/Img/avesurS.png"
              alt="logo"
              width={100}
              height={50}
              className="recibo-logo"
            />
          </div>
          <div className="recibo-empresa-info">
            <span className="font-bold">EMPRESA S.A. </span>
            <span>RUTA 25 KM 295</span>
            <span>LA PAMPA CP:5978</span>
            <span>30-25455987-9</span>
          </div>
          <div className="recibo-proyecto">PROYECTO WEB *RECIBO*</div>
        </div>

        <div className="recibo-datos-grid">
          <div className="recibo-datos-header">NRO. DE LEGAJO</div>
          <div className="recibo-datos-header">APELLIDO Y NOMBRE</div>
          <div className="recibo-datos-header">C.U.I.L</div>
          <div className="recibo-datos-header-last">FECHA INGRESO</div>
        </div>

        <div className="recibo-datos-grid">
          <div className="recibo-datos-valor-bold">{empleado.legajo}</div>
          <div className="recibo-datos-valor-bold">{empleado.nombreCompleto}</div>
          <div className="recibo-datos-valor">{empleado.cuil}</div>
          <div className="recibo-datos-valor-last">{empleado.fechaIngreso}</div>
        </div>

        <div className="recibo-info-grid">
          <div className="recibo-datos-header">PERIODO DE PAGO</div>
          <div className="recibo-datos-header">OBRA SOCIAL</div>
          <div className="recibo-datos-header">SINDICATO</div>
          <div className="recibo-datos-header-last">FORMA CONTRATACION</div>
        </div>

        <div className="recibo-info-grid">
          <div className="recibo-datos-valor">{empleado.periodoPago}</div>
          <div className="recibo-datos-valor">{empleado.obraSocial}</div>
          <div className="recibo-datos-valor">{empleado.afiliado}	</div>
          <div className="recibo-datos-valor-last">{empleado.formaContratacion}</div>
        </div>

        <div className="recibo-info-grid">
          <div className="recibo-datos-header">SECCION</div>
          <div className="recibo-datos-header">CALIFICACION PROFECIONAL</div>
          <div className="recibo-datos-header">SUELDO BASICO NORMAL</div>
          <div className="recibo-datos-header-last">SUELDO BASICO NO REM</div>
        </div>

        <div className="recibo-info-grid">
          <div className="recibo-datos-valor">{empleado.seccion}</div>
          <div className="recibo-datos-valor">{empleado.calificacion}</div>
          <div className="recibo-datos-valor">{empleado.valorHoraNormal}</div>
          <div className="recibo-datos-valor-last">{empleado.valorHoraNoRem}</div>
        </div>

        <div className="recibo-conceptos-header">
          <div className="recibo-concepto-titulo">CONCEPTO</div>
          <div className="recibo-concepto-codigo">COD</div>
          <div className="recibo-concepto-unidades">UNIDADES</div>
          <div className="recibo-concepto-valor">REMUNERATIVO</div>
          <div className="recibo-concepto-valor">NO REMUNERATIVO</div>
          <div className="recibo-concepto-valor-last">DESCUENTOS</div>
        </div>

        {conceptos.map((fila, index) =>
          fila.unidades !== 0 ? (
            <div className="recibo-fila" key={index}>
              <div className="recibo-fila-concepto">
                <div>{fila.concepto}</div>
              </div>
              <div className="recibo-fila-codigo">{fila.codigo}</div>
              <div className="recibo-fila-unidades">
                {(() => {
                  const conceptosSinUnidades = [
                    "PREMIO Y ASIST. Y PUNT 1°",
                    "PREMIO Y ASIST. Y PUNT 2°",
                    "COMPENSACION MENSUAL",
                    "JUBILACION",
                    "O.S RURAL Y ESTIBADO",
                    "FEDERACION GREMIAL",
                    "SEPELIO",
                    "LEY 19032",
                    "OBRA SOCIAL NO REM",
                    "CUOTA SINDICAL",
                    "RESOLUCION 11/16",
                    "ASIG NO REM",
                    "COMEDOR",
                    "MERCADERIA",
                  ];
                  return conceptosSinUnidades.includes(fila.concepto)
                    ? ""
                    : fila.unidades !== 0
                    ? fila.unidades.toFixed(2)
                    : "";
                })()}
              </div>
              <div className="recibo-fila-valor">
                {parseFloat(String(fila.remunerativo)) > 0
                  ? formatearNumero(fila.remunerativo)
                  : ""}
              </div>
              <div className="recibo-fila-valor">
                {(() => {
                  const noremunerativo =
                    parseFloat(String(fila.noremunerativo)) || 0;
                  const compensacion =
                    parseFloat(String(fila.compensacion)) || 0;
                  const total = noremunerativo + compensacion;
                  return total > 0 ? formatearNumero(total) : "";
                })()}
              </div>
              <div className="recibo-fila-valor">
                {parseFloat(String(fila.descuentos)) > 0
                  ? formatearNumero(fila.descuentos)
                  : ""}
              </div>
            </div>
          ) : null
        )}

        <div className="recibo-forma-pago">
          <div className="recibo-forma-pago-info">
            <div>
              FORMA DE PAGO: DEPOSITO DE AHORRO <br /> Nº 545454558 <br />{" "}
              BANCO: SANTANDER
            </div>
          </div>

          <div className="recibo-totales">
            <div className="recibo-totales-titulo">TOTAL</div>
            <div className="recibo-totales-grid">
              <div className="recibo-totales-header">Remunerativos</div>
              <div className="recibo-totales-header">No Remunerativos</div>
              <div className="recibo-totales-header-last">Descuentos</div>
            </div>
            <div className="recibo-totales-valores">
              <div className="recibo-totales-valor">{totalRemunerativo}</div>
              <div className="recibo-totales-valor">{totalNoRemunerativo}</div>
              <div className="recibo-totales-valor-last">
                - {totalDescuentos}
              </div>
            </div>
          </div>
        </div>

        <div className="recibo-pie">
          <div className="recibo-pie-lugar">
            LUGAR Y FECHA DE PAGO: LA RIOJA
          </div>
          <div className="recibo-pie-fecha">07/04/2025</div>
          <div className="recibo-pie-neto-label">NETO A PAGAR</div>
          <div className="recibo-pie-neto-valor">{totalNeto}</div>
        </div>

        <div className="recibo-letras">
          <div className="recibo-letras-texto">{numeroALetras(totalNeto)}</div>
        </div>

        <div className="recibo-observaciones">
          <div className="recibo-observaciones-izq">
            <div className="recibo-observaciones-titulo">OBSERVACIONES:</div>
            <div className="recibo-deposito-grid">
              <div className="recibo-deposito-titulo">
                DEPOSITO JUBILATORIO (LEY 17250 ART.12)
              </div>
            </div>
            <div className="recibo-deposito-grid">
              <div className="recibo-deposito-header">FECHA</div>
              <div className="recibo-deposito-header">PERIODO</div>
              <div className="recibo-deposito-header-last">BANCO</div>

              <div className="recibo-deposito-valor">12/03/2025</div>
              <div className="recibo-deposito-valor">FEBRERO 2025</div>
              <div className="recibo-deposito-valor-last">INTERBANKING</div>
            </div>
          </div>

          <div className="recibo-firma">
            <div className="recibo-firma-container">
              <span className="recibo-firma-linea">
                <hr className="recibo-firma-hr" />
              </span>
              <div className="recibo-firma-texto">FIRMA DEL EMPLEADO</div>
              <p className="recibo-firma-nota">
                Recibí cantidad de pesos indicada de conformidad por el pago de
                mi
                <br />
                remuneración y duplicado de este recibo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
