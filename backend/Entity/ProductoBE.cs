using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Equipo o servicio del catálogo. Tabla productos.
    /// </summary>
    public class ProductoBE
    {
        public long id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public decimal precio { get; set; }
        public string categoria { get; set; }   // EQUIPO | SERVICIO
        public int? capacidadBtu { get; set; }
        public int? areaMaxM2 { get; set; }
        public string tipoServicio { get; set; } // código del tipo de servicio (solo servicios)
    }
}
