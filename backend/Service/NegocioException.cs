using System;

namespace Service
{
    /// <summary>
    /// Error de una regla de negocio o de un dato inválido enviado por la página.
    /// El controlador lo devuelve como HTTP 400 (o 404 si noEncontrado es true) con el mensaje para el usuario.
    /// </summary>
    public class NegocioException : Exception
    {
        public bool noEncontrado { get; }

        public NegocioException(string mensaje, bool noEncontrado = false) : base(mensaje)
        {
            this.noEncontrado = noEncontrado;
        }
    }
}
