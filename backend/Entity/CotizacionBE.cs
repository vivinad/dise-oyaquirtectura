using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Cabecera de una cotización. Tabla cotizacion.
    /// </summary>
    public class CotizacionBE
    {
        public long id { get; set; }
        public string codigo { get; set; }
        public DateTime? fecha { get; set; }
        public long tipoServicioId { get; set; }
        public long tipoClienteId { get; set; }
        public long zonaId { get; set; }
        public string tipoServicio { get; set; }  // nombre, para mostrar
        public string tipoCliente { get; set; }   // nombre, para mostrar
        public decimal factorPrecio { get; set; }
        public string zona { get; set; }          // nombre, para mostrar
        public decimal? areaM2 { get; set; }
        public int? btuRecomendado { get; set; }
        public decimal subtotalEquipos { get; set; }
        public decimal subtotalManoObra { get; set; }
        public decimal costoTraslado { get; set; }
        public decimal total { get; set; }
        public List<DetalleCotizacionBE> detalles { get; set; } = new List<DetalleCotizacionBE>();
    }
}
