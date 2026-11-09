using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// RF02: equipo sugerido para el área. equipo es null si el área supera el catálogo.
    /// </summary>
    public class RecomendacionEquipoDTO
    {
        public decimal areaM2 { get; set; }
        public ProductoCotizadorDTO equipo { get; set; }
        public string mensaje { get; set; }
    }
}
