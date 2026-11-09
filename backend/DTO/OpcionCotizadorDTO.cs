using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Opción de los pasos 1 y 2 del cotizador. factorPrecio solo aplica al tipo de cliente.
    /// </summary>
    public class OpcionCotizadorDTO
    {
        public string codigo { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public decimal? factorPrecio { get; set; }
    }
}
