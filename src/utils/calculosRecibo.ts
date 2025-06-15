// calculosRecibo.ts
import type { EmpleadoData as Empleado } from "../context/FormContext";
import type { Concepto } from "../context/FormContext";

export const procesarDatosEmpleado = (formData: Empleado) => {
  const parse = (val: string | undefined) => parseFloat(val || "0");

  const valorHoraNormal = parse(formData.valorHoraNormal);
  const valorHoraNoRem = parse(formData.valorHoraNoRem);

  const diasPrimeraQuincenaUnidades = parse(formData.diasPrimeraQuincena) * 8.8;
  const diasSegundaQuincenaUnidades = parse(formData.diasSegundaQuincena) * 8.8;

  const feriadoPrimeraQuincenaUnidades =
    parse(formData.feriadoPrimeraQuincena) * 8.8;
  const feriadoSegundaQuincenaUnidades =
    parse(formData.feriadoSegundaQuincena) * 8.8;

  const horasExtrasPrimeraQui = parse(formData.horaExtraPrimeraQuincena);
  const horasExtrasSegundaQui = parse(formData.horaExtraSegundaQuincena);

  const horasExtrasAL100Primera = parse(formData.horaExtraAL100PrimeraQuincena);
  const horasExtrasAL100Segunda = parse(formData.horaExtraAL100SegundaQuincena);

  const horasNocturnasPrimera = parse(formData.horaNocturnaPrimeraQuincena);
  const horasNocturnasSegunda = parse(formData.horaNocturnaSegundaQuincena);

  const horasNocturnasExtrasPrimera = parse(
    formData.horaExtraNocturnaPrimeraQuincena
  );
  const horasNocturnasExtrasSegunda = parse(
    formData.horaExtraNocturnaSegundaQuincena
  );

  const dias1QFinal =
    diasPrimeraQuincenaUnidades -
    (horasNocturnasPrimera > 0 ? horasNocturnasPrimera : 0);
  const dias2QFinal =
    diasSegundaQuincenaUnidades -
    (horasNocturnasSegunda > 0 ? horasNocturnasSegunda : 0);

  const bonificacionAdicional = (Number(formData.bonificacion) || 0) / 100;

  return {
    ...formData,
    nombreCompleto: `${formData.apellido} ${formData.nombre} ${
      formData.segundoNombre || ""
    }`.toUpperCase(),
    sueldoBasico: valorHoraNormal.toFixed(2),
    sueldoNoRem: valorHoraNoRem.toFixed(2),
    seccion: formData.seccion,
    calificacion: formData.calificacion,
    formaContratacion: formData.formaContratacion,
    sindicato:
      formData.afiliado?.toLowerCase().replace("í", "i") === "si"
        ? "AFILIADO"
        : "NO AFILIADO",
    cuil: formData.cuil,
    fechaIngreso: formData.fechaIngreso,
    obraSocial: formData.obraSocial,
    periodoPago: formData.periodoPago,

    //LOGICA PARA CALCULAR VALORES REMUNERATIVOS
    diasPrimeraQuincenaUnidades: dias1QFinal.toFixed(2),
    brutoPrimeraQui: (dias1QFinal * valorHoraNormal).toFixed(2),

    diasSegundaQuincenaUnidades: dias2QFinal.toFixed(2),
    brutoSegundaQui: (dias2QFinal * valorHoraNormal).toFixed(2),

    bonificacion: bonificacionAdicional.toFixed(2),
    bonificado: (
      (dias1QFinal * valorHoraNormal + dias2QFinal * valorHoraNormal) *
      bonificacionAdicional
    ).toFixed(2),

    feriadoPrimeraQuincenaUnidades: feriadoPrimeraQuincenaUnidades.toFixed(2),
    brutoFeriadoPrimeraQui: (
      feriadoPrimeraQuincenaUnidades * valorHoraNormal
    ).toFixed(2),

    feriadoSegundaQuincenaUnidades: feriadoSegundaQuincenaUnidades.toFixed(2),
    brutoFeriadoSegundaQui: (
      feriadoSegundaQuincenaUnidades * valorHoraNormal
    ).toFixed(2),

    horaExtraPrimeraQuincena: formData.horaExtraPrimeraQuincena || "0.00",
    ExtraPrimeraQui: (
      parseFloat(formData.horaExtraPrimeraQuincena || "0") *
      (valorHoraNormal * 1.5)
    ).toFixed(2),

    horaExtraSegundaQuincena: formData.horaExtraSegundaQuincena || "0.00",
    ExtraSegundaQui: (
      parseFloat(formData.horaExtraSegundaQuincena || "0") *
      (valorHoraNormal * 1.5)
    ).toFixed(2),

    horaExtraAL100PrimeraQuincena:
      formData.horaExtraAL100PrimeraQuincena || "0.00",
    ExtraAL100PrimeraQui: (
      parseFloat(formData.horaExtraAL100PrimeraQuincena || "0") *
      (valorHoraNormal * 2)
    ).toFixed(2),

    horaExtraAL100SegundaQuincena:
      formData.horaExtraAL100SegundaQuincena || "0.00",
    ExtraAL100SegundaQui: (
      parseFloat(formData.horaExtraAL100SegundaQuincena || "0") *
      (valorHoraNormal * 2)
    ).toFixed(2),

    horaNocturnaPrimeraQuincena: formData.horaNocturnaPrimeraQuincena || "0.00",
    NocturnaPrimeraQui: (
      parseFloat(formData.horaNocturnaPrimeraQuincena || "0") *
      (valorHoraNormal * 1.133)
    ).toFixed(2),

    horaNocturnaSegundaQuincena: formData.horaNocturnaSegundaQuincena || "0.00",
    NocturnaSegundaQui: (
      parseFloat(formData.horaNocturnaSegundaQuincena || "0") *
      (valorHoraNormal * 1.133)
    ).toFixed(2),

    horaExtraNocturnaPrimeraQuincena:
      formData.horaExtraNocturnaPrimeraQuincena || "0.00",
    ExtraNocturnaPrimeraQui: (
      (valorHoraNormal * 1.5 * 0.133 + valorHoraNormal * 1.5) *
      parseFloat(formData.horaExtraNocturnaPrimeraQuincena || "0")
    ).toFixed(2),

    horaExtraNocturnaSegundaQuincena:
      formData.horaExtraNocturnaSegundaQuincena || "0.00",
    ExtraNocturnaSegundaQui: (
      (valorHoraNormal * 1.5 * 0.133 + valorHoraNormal * 1.5) *
      parseFloat(formData.horaExtraNocturnaSegundaQuincena || "0")
    ).toFixed(2),

    // VALORES NO REMUNERATIVOS - PRIMERA QUINCENA
    primeraQuincena: {
      brutoAsignacionNoRem: (
        (dias1QFinal + feriadoPrimeraQuincenaUnidades) * valorHoraNoRem * 1.11 +
        dias1QFinal * valorHoraNoRem * bonificacionAdicional
      ).toFixed(2),

      brutoHsNoRemunerativoExtra: (
        horasExtrasPrimeraQui *
        valorHoraNoRem *
        1.5 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoExtraAL100: (
        horasExtrasAL100Primera *
        valorHoraNoRem *
        2 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoNocturnas: (
        horasNocturnasPrimera *
        valorHoraNoRem *
        1.133 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoNocturnasExtras: (
        horasNocturnasExtrasPrimera *
        valorHoraNoRem *
        1.5 *
        1.133 *
        1.11
      ).toFixed(2),
    },

    // VALORES NO REMUNERATIVOS - SEGUNDA QUINCENA
    segundaQuincena: {
      brutoAsignacionNoRem: (
        (dias2QFinal + feriadoSegundaQuincenaUnidades) * valorHoraNoRem * 1.11 +
        dias2QFinal * valorHoraNoRem * bonificacionAdicional
      ).toFixed(2),

      brutoHsNoRemunerativoExtra: (
        horasExtrasSegundaQui *
        valorHoraNoRem *
        1.5 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoExtraAL100: (
        horasExtrasAL100Segunda *
        valorHoraNoRem *
        2 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoNocturnas: (
        horasNocturnasSegunda *
        valorHoraNoRem *
        1.133 *
        1.11
      ).toFixed(2),

      brutoHsNoRemunerativoNocturnasExtras: (
        horasNocturnasExtrasSegunda *
        valorHoraNoRem *
        1.5 *
        1.133 *
        1.11
      ).toFixed(2),
    },
  };
};

export function generarConceptos(empleado: Empleado): Concepto[] {
  const compensacion = 1674;

  const parse = (val: string | undefined): number => parseFloat(val || "0");

  const totalNOREMU = parseFloat(
    //PRIMERA QUINCENA
    (
      parse(empleado.primeraQuincena.brutoAsignacionNoRem) +
      parse(empleado.primeraQuincena.brutoHsNoRemunerativoExtra) +
      parse(empleado.primeraQuincena.brutoHsNoRemunerativoExtraAL100) +
      parse(empleado.primeraQuincena.brutoHsNoRemunerativoNocturnas) +
      parse(empleado.primeraQuincena.brutoHsNoRemunerativoNocturnasExtras) +
      parse(empleado.segundaQuincena.brutoAsignacionNoRem) +
      parse(empleado.segundaQuincena.brutoHsNoRemunerativoExtra) +
      parse(empleado.segundaQuincena.brutoHsNoRemunerativoExtraAL100) +
      parse(empleado.segundaQuincena.brutoHsNoRemunerativoNocturnas) +
      parse(empleado.segundaQuincena.brutoHsNoRemunerativoNocturnasExtras)
    ).toFixed(2)
  );

  const conceptos: Concepto[] = [
    {
      concepto: "DIAS 1° QUINCENA",
      codigo: "1101",
      unidades: parse(empleado.diasPrimeraQuincenaUnidades),
      remunerativo: parse(empleado.brutoPrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "DIAS 2° QUINCENA",
      codigo: "1102",
      unidades: parse(empleado.diasSegundaQuincenaUnidades),
      remunerativo: parse(empleado.brutoSegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "SUSPENSION 1° QUINCENA",
      codigo: "2200",
      unidades: parse(empleado.suspensionPrimeraQuincena),
      remunerativo: "",
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "SUSPENCION 2° QUINCENA",
      codigo: "2201",
      unidades: parse(empleado.suspensionSegundaQuincena),
      remunerativo: "",
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "FERIADOS 1° QUINCENA",
      codigo: "1103",
      unidades: parse(empleado.feriadoPrimeraQuincenaUnidades),
      remunerativo: parse(empleado.brutoFeriadoPrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "FERIADOS 2° QUINCENA",
      codigo: "1104",
      unidades: parse(empleado.feriadoSegundaQuincenaUnidades),
      remunerativo: parse(empleado.brutoFeriadoSegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA 1º QUINCENA",
      codigo: "1105",
      unidades: parse(empleado.horaExtraPrimeraQuincena),
      remunerativo: parse(empleado.ExtraPrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA 2º QUINCENA",
      codigo: "1106",
      unidades: parse(empleado.horaExtraSegundaQuincena),
      remunerativo: parse(empleado.ExtraSegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "BONIFICACION",
      codigo: "1107",
      unidades: parse(empleado.bonificacion),
      remunerativo: parse(empleado.bonificado),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA AL 100% 1º QUINCENA",
      codigo: "1107",
      unidades: parse(empleado.horaExtraAL100PrimeraQuincena),
      remunerativo: parse(empleado.ExtraAL100PrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA AL 100% 2º QUINCENA",
      codigo: "1108",
      unidades: parse(empleado.horaExtraAL100SegundaQuincena),
      remunerativo: parse(empleado.ExtraAL100SegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS NOCTURNA 1° QUINCENA",
      codigo: "1109",
      unidades: parse(empleado.horaNocturnaPrimeraQuincena),
      remunerativo: parse(empleado.NocturnaPrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS NOCTURNA 2° QUINCENA",
      codigo: "1110",
      unidades: parse(empleado.horaNocturnaSegundaQuincena),
      remunerativo: parse(empleado.NocturnaSegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA NOCTURNA 1° QUINCENA",
      codigo: "1111",
      unidades: parse(empleado.horaExtraNocturnaPrimeraQuincena),
      remunerativo: parse(empleado.ExtraNocturnaPrimeraQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "HORAS EXTRA NOCTURNA 2° QUINCENA",
      codigo: "1112",
      unidades: parse(empleado.horaExtraNocturnaSegundaQuincena),
      remunerativo: parse(empleado.ExtraNocturnaSegundaQui),
      noremunerativo: "",
      descuentos: "",
    },
    {
      concepto: "COMPENSACION MENSUAL",
      codigo: "1113",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: compensacion,
      descuentos: "",
    },
  ];

  // LOGICA PARA CALCULAR VALORES NO REMUNERATIVOS
  if (parse(empleado.primeraQuincena.brutoAsignacionNoRem) > 0) {
    conceptos.push({
      concepto: "ASIG NO REM ",
      codigo: "2101",
      unidades:
        parse(empleado.diasPrimeraQuincenaUnidades) +
        parse(empleado.feriadoPrimeraQuincenaUnidades) +
        parse(empleado.diasSegundaQuincenaUnidades) +
        parse(empleado.feriadoSegundaQuincenaUnidades),
      remunerativo: "",
      noremunerativo: totalNOREMU,
      descuentos: "",
    });
  }

  //PRESENTISMO PRIMERA QUINCENA
  const subtotalPrimera =
    parse(empleado.brutoPrimeraQui) +
    parse(empleado.brutoFeriadoPrimeraQui) +
    parse(empleado.ExtraPrimeraQui) +
    parse(empleado.ExtraAL100PrimeraQui) +
    parse(empleado.NocturnaPrimeraQui) +
    parse(empleado.ExtraNocturnaPrimeraQui);

  let PremioPrimeraQui = parseFloat((subtotalPrimera * 0.11).toFixed(2));

  const subtotalSegunda =
    parse(empleado.brutoSegundaQui) +
    parse(empleado.brutoFeriadoSegundaQui) +
    parse(empleado.ExtraSegundaQui) +
    parse(empleado.ExtraAL100SegundaQui) +
    parse(empleado.NocturnaSegundaQui) +
    parse(empleado.ExtraNocturnaSegundaQui);

  let PremioSegundaQui = parseFloat((subtotalSegunda * 0.11).toFixed(2));

  if (parse(empleado.suspensionPrimeraQuincena) >= 1) {
    const descuento = 8.8 * parseInt(empleado.suspensionPrimeraQuincena || "0");
    const dias1 = conceptos.find((c) => c.concepto === "DIAS 1° QUINCENA");
    if (dias1) dias1.unidades -= descuento;

    const bruto = parse(empleado.brutoPrimeraQui);
    const dias = parse(empleado.diasPrimeraQuincenaUnidades) || 1;
    const nuevoBruto = bruto - (bruto / dias) * descuento;
    empleado.brutoPrimeraQui = nuevoBruto.toFixed(2);
    PremioPrimeraQui = 0;
  }

  if (parse(empleado.suspensionSegundaQuincena) >= 1) {
    const descuento = 8.8 * parseInt(empleado.suspensionSegundaQuincena || "0");
    const dias2 = conceptos.find((c) => c.concepto === "DIAS 2° QUINCENA");
    if (dias2) dias2.unidades -= descuento;

    const bruto = parse(empleado.brutoSegundaQui);
    const dias = parse(empleado.diasSegundaQuincenaUnidades) || 1;
    const nuevoBruto = bruto - (bruto / dias) * descuento;
    empleado.brutoSegundaQui = nuevoBruto.toFixed(2);
    PremioSegundaQui = 0;
  }

  if (
    parse(empleado.suspensionPrimeraQuincena) > 0 ||
    parse(empleado.suspensionSegundaQuincena) > 0
  ) {
    const i = conceptos.findIndex((c) => c.concepto === "COMPENSACION MENSUAL");
    if (i !== -1) conceptos.splice(i, 1);
  }

  const indexDias2 = conceptos.findIndex(
    (c) => c.concepto === "DIAS 2° QUINCENA"
  );

  if (PremioPrimeraQui > 0) {
    conceptos.splice(indexDias2 + 1, 0, {
      concepto: "PREMIO Y ASIST. Y PUNT 1°",
      codigo: "9991",
      unidades: 1.0,
      remunerativo: PremioPrimeraQui,
      noremunerativo: "",
      descuentos: "",
    });
  }

  if (PremioSegundaQui > 0) {
    conceptos.splice(indexDias2 + 2, 0, {
      concepto: "PREMIO Y ASIST. Y PUNT 2°",
      codigo: "9991",
      unidades: 1.0,
      remunerativo: PremioSegundaQui,
      noremunerativo: "",
      descuentos: "",
    });
  }
  // Sumar todos los valores remunerativos correctamente
  const totalRemunerativo = conceptos.reduce((acc, concepto) => {
    const valor =
      typeof concepto.remunerativo === "number"
        ? concepto.remunerativo
        : parseFloat(concepto.remunerativo || "0");
    return acc + valor;
  }, 0);

  // Sumar todos los valores no remunerativos correctamente
  const totalNoRemunerativo = conceptos.reduce((acc, concepto) => {
    const valor =
      typeof concepto.noremunerativo === "number"
        ? concepto.noremunerativo
        : parseFloat(concepto.noremunerativo || "0");
    return acc + valor;
  }, 0);

  // Cálculos de descuentos
  const descuentoJubilacion = parseFloat((totalRemunerativo * 0.11).toFixed(2));
  const ley19032 = parseFloat((totalRemunerativo * 0.03).toFixed(2));
  const OsPersRuralyEstibado = parseFloat(
    (totalRemunerativo * 0.03).toFixed(2)
  );
  const ObraSocialNoRem = parseFloat(
    (
      totalNOREMU * 0.03 +
      (Number(empleado.diasPrimeraQuincenaUnidades) +
        Number(empleado.diasSegundaQuincenaUnidades)) *
        Number(empleado.valorHoraNoRem) *
        Number(empleado.bonificacion) *
        0.03
    ).toFixed(2)
  );

  // Federacion Gremial: 2% del total remunerativo + no remunerativo
  const FederacionGremial = parseFloat(
    ((totalRemunerativo + totalNOREMU) * 0.02).toFixed(2)
  );
  const esAfiliado =
    empleado.afiliado?.toLowerCase().replace("í", "i") === "si";

  // ...

  const cuotaSindical = esAfiliado
    ? parseFloat(((totalRemunerativo + totalNoRemunerativo) * 0.015).toFixed(2))
    : 0;

  const resolucion = esAfiliado
    ? parseFloat(((totalRemunerativo + totalNoRemunerativo) * 0.015).toFixed(2))
    : 0;

  // Agregar conceptos fijos
  conceptos.push(
    {
      concepto: "JUBILACION",
      codigo: "1114",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: descuentoJubilacion,
    },
    {
      concepto: "LEY 19032",
      codigo: "1115",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: ley19032,
    },
    {
      concepto: "O.S RURAL Y ESTIBADO",
      codigo: "1116",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: OsPersRuralyEstibado,
    }
  );

  // Solo agregar obra social no rem si tiene un valor mayor a 0
  if (ObraSocialNoRem > 0) {
    conceptos.push({
      concepto: "OBRA SOCIAL NO REM",
      codigo: "1117",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: ObraSocialNoRem,
    });
  }

  conceptos.push({
    concepto: "FEDERACION GREMIAL",
    codigo: "1118",
    unidades: 1.0,
    remunerativo: "",
    noremunerativo: "",
    descuentos: FederacionGremial,
  });

  // Agregar solo si está afiliado
  if (esAfiliado) {
    conceptos.push(
      {
        concepto: "CUOTA SINDICAL",
        codigo: "1119",
        unidades: 1.0,
        remunerativo: "",
        noremunerativo: "",
        descuentos: cuotaSindical,
      },
      {
        concepto: "RESOLUCION 11/16",
        codigo: "1120",
        unidades: 1.0,
        remunerativo: "",
        noremunerativo: "",
        descuentos: resolucion,
      }
    );
  }

  // Agregar sepelio siempre
  conceptos.push({
    concepto: "SEPELIO",
    codigo: "1120",
    unidades: 1.0,
    remunerativo: "",
    noremunerativo: "",
    descuentos: parse(empleado.sepelio),
  });

  // Agregar descuento de Comedor
  if (parse(empleado.comedor) > 0) {
    conceptos.push({
      concepto: "COMEDOR",
      codigo: "1121",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: parse(empleado.comedor),
    });
  }

  // Agregar descuento de Mercadería
  if (parse(empleado.mercaderia) > 0) {
    conceptos.push({
      concepto: "MERCADERIA",
      codigo: "1122",
      unidades: 1.0,
      remunerativo: "",
      noremunerativo: "",
      descuentos: parse(empleado.mercaderia),
    });
  }

  return conceptos;
}
