using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Zona de atención con su costo de traslado.
    /// </summary>
    public class ZonaDTO
    {
        public long id { get; set; }
        public string nombre { get; set; }
        public string distritos { get; set; }
        public decimal costoTraslado { get; set; }
    }
}
