using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Resultado de la cotización (RF03). codigo y fecha solo vienen cuando se guardó (RF04).
    /// </summary>
    public class CotizacionResponseDTO
    {
        public string codigo { get; set; }
        public DateTime? fecha { get; set; }
        public string tipoServicio { get; set; }
        public string tipoCliente { get; set; }
        public decimal factorPrecio { get; set; }
        public string zona { get; set; }
        public decimal? areaM2 { get; set; }
        public int? btuRecomendado { get; set; }
        public List<LineaCotizacionDTO> lineas { get; set; }
        public decimal subtotalEquipos { get; set; }
        public decimal subtotalManoObra { get; set; }
        public decimal costoTraslado { get; set; }
        public decimal total { get; set; }
    }
}
