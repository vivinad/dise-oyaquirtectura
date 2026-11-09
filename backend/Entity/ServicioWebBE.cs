using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Tarjeta de la sección Servicios. Tabla servicio_web.
    /// </summary>
    public class ServicioWebBE
    {
        public long id { get; set; }
        public string titulo { get; set; }
        public string descripcion { get; set; }
        public string icono { get; set; }
        public int orden { get; set; }
    }
}
