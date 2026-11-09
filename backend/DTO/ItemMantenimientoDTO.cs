using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Elemento de la sección Mantenimiento (modelo ItemMantenimiento del frontend).
    /// </summary>
    public class ItemMantenimientoDTO
    {
        public long id { get; set; }
        public string titulo { get; set; }
        public string texto { get; set; }
    }
}
