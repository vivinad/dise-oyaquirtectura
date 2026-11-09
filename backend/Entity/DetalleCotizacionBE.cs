using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Línea de una cotización: equipo o servicio elegido. Tabla detalle_cotizacion.
    /// </summary>
    public class DetalleCotizacionBE
    {
        public long productoId { get; set; }
        public string nombre { get; set; }
        public string categoria { get; set; }
        public int cantidad { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal subtotal { get; set; }
    }
}
