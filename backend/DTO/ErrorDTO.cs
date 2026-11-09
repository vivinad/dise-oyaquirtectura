using System;
using System.Collections.Generic;

namespace DTO
{
    /// <summary>
    /// Respuesta de error. El frontend muestra el campo message.
    /// </summary>
    public class ErrorDTO
    {
        public int status { get; set; }
        public string message { get; set; }
    }
}
