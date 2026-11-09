using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Resultado de usp_estado_bd: servidor, base de datos y cantidad de registros.
    /// </summary>
    public class EstadoBdBE
    {
        public string servidor { get; set; }
        public string baseDatos { get; set; }
        public int equipos { get; set; }
        public int servicios { get; set; }
        public int zonas { get; set; }
        public int cotizaciones { get; set; }
        public int serviciosWeb { get; set; }
        public int trabajos { get; set; }
        public int itemsMantenimiento { get; set; }
    }
}
