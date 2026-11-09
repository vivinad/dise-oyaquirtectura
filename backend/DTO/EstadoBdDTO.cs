using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Estado de la conexión: servidor, base de datos y cantidad de registros por tabla.
    /// </summary>
    public class EstadoBdDTO
    {
        public bool conectado { get; set; }
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
