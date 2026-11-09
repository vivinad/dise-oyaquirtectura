using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Paso 1 del cotizador: INSTALACION, MANTENIMIENTO o REPARACION. Tabla tipo_servicio.
    /// </summary>
    public class TipoServicioBE
    {
        public long id { get; set; }
        public string codigo { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
    }
}
