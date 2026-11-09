using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Foto de la galería de Trabajos (modelo Trabajo del frontend).
    /// </summary>
    public class TrabajoDTO
    {
        public long id { get; set; }
        public string imagen { get; set; }
        public string alt { get; set; }
        public string pie { get; set; }
    }
}
