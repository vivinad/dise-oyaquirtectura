using System;
using System.Collections.Generic;

namespace Entity
{
    /// <summary>
    /// Paso 2 del cotizador: HOGAR, NEGOCIO o EMPRESA. Tabla tipo_cliente.
    /// </summary>
    public class TipoClienteBE
    {
        public long id { get; set; }
        public string codigo { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public decimal factorPrecio { get; set; }
    }
}
