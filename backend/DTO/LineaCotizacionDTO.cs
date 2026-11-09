using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Línea del detalle de la cotización.
    /// </summary>
    public class LineaCotizacionDTO
    {
        public long productoId { get; set; }
        public string nombre { get; set; }
        public string categoria { get; set; }
        public int cantidad { get; set; }
        public decimal precioUnitario { get; set; }
        public decimal subtotal { get; set; }
    }
}
