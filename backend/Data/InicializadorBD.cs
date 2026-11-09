using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

namespace Data
{
    /// <summary>
    /// Crea la base de datos al iniciar la API si todavía no existe, ejecutando database/BD_GLOBALFRIO.sql.
    /// Así quien pruebe el proyecto no tiene que abrir SSMS. Si la base ya existe, no toca nada.
    /// </summary>
    public class InicializadorBD
    {
        private readonly string cnBD = "";

        public InicializadorBD(string cnBD)
        {
            this.cnBD = cnBD;
        }

        /// <returns>true si creó la base de datos; false si ya existía.</returns>
        public bool crearSiNoExiste(string rutaScript)
        {
            var datos = new SqlConnectionStringBuilder(this.cnBD);
            string baseDatos = datos.InitialCatalog;
            datos.InitialCatalog = "master";

            using (SqlConnection sqlCn = new SqlConnection(datos.ConnectionString))
            {
                sqlCn.Open();

                using (var consulta = new SqlCommand("SELECT DB_ID(@nombre)", sqlCn))
                {
                    consulta.Parameters.AddWithValue("@nombre", baseDatos);
                    if (consulta.ExecuteScalar() != DBNull.Value)
                    {
                        return false;
                    }
                }

                if (!File.Exists(rutaScript))
                {
                    throw new FileNotFoundException("No se encontró el script de la base de datos", rutaScript);
                }

                foreach (string bloque in separarPorGo(File.ReadAllText(rutaScript, Encoding.UTF8)))
                {
                    using (var comando = new SqlCommand(bloque, sqlCn))
                    {
                        comando.CommandTimeout = 120;
                        comando.ExecuteNonQuery();
                    }
                }
            }
            return true;
        }

        /// <summary>
        /// SSMS separa los bloques del script con la palabra GO; SQL Server no la entiende, así que se ejecuta bloque por bloque.
        /// </summary>
        private static IEnumerable<string> separarPorGo(string script)
        {
            foreach (string bloque in Regex.Split(script, @"^\s*GO\s*$", RegexOptions.Multiline | RegexOptions.IgnoreCase))
            {
                if (!string.IsNullOrWhiteSpace(bloque))
                {
                    yield return bloque;
                }
            }
        }
    }
}
