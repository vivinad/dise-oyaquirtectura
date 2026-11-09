using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Foto de la galería de Trabajos. Tabla trabajo.
    /// </summary>
    public class TrabajoBE
    {
        public long id { get; set; }
        public string pie { get; set; }
        public string imagen { get; set; }
        public string textoAlternativo { get; set; }
        public int orden { get; set; }
    }
}
