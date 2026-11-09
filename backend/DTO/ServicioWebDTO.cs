using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Tarjeta de la sección Servicios (modelo Servicio del frontend).
    /// </summary>
    public class ServicioWebDTO
    {
        public long id { get; set; }
        public string titulo { get; set; }
        public string texto { get; set; }
        public string icono { get; set; }
    }
}
