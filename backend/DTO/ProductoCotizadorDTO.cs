using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Equipo o servicio tal como lo ve el cotizador (RF01).
    /// </summary>
    public class ProductoCotizadorDTO
    {
        public long id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public decimal precio { get; set; }
        public string categoria { get; set; }
        public int? capacidadBtu { get; set; }
        public int? areaMaxM2 { get; set; }
        public string tipoServicio { get; set; }
    }
}
