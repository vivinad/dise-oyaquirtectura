using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Lo que incluye el mantenimiento. Tabla item_mantenimiento.
    /// </summary>
    public class ItemMantenimientoBE
    {
        public long id { get; set; }
        public string titulo { get; set; }
        public string descripcion { get; set; }
        public int orden { get; set; }
    }
}
