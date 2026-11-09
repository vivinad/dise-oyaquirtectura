using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Datos iniciales del cotizador: tipos de servicio y de cliente, zonas y equipos.
    /// </summary>
    public class CatalogoCotizadorDTO
    {
        public List<OpcionCotizadorDTO> tiposServicio { get; set; }
        public List<OpcionCotizadorDTO> tiposCliente { get; set; }
        public List<ZonaDTO> zonas { get; set; }
        public List<ProductoCotizadorDTO> equipos { get; set; }
    }
}
