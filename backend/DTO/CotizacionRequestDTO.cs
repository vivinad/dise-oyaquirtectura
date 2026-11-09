using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Datos que envía la página para calcular (RF03) o guardar (RF04) una cotización. Sin datos personales.
    /// </summary>
    public class CotizacionRequestDTO
    {
        public string tipoServicio { get; set; }
        public string tipoCliente { get; set; }
        public long zonaId { get; set; }
        public decimal? areaM2 { get; set; }
        public List<ItemCotizacionDTO> items { get; set; }
    }
}
