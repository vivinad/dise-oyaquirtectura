using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Zona de atención con su costo de traslado. Tabla zona.
    /// </summary>
    public class ZonaBE
    {
        public long id { get; set; }
        public string nombre { get; set; }
        public string distritos { get; set; }
        public decimal costoTraslado { get; set; }
    }
}
