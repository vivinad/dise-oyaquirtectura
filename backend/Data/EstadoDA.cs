using Dapper;
using System.Data;
using System.Data.SqlClient;

namespace Data
{
    /// <summary>
    /// Comprueba la conexión con la base de datos y cuenta los registros de cada tabla.
    /// </summary>
    public class EstadoDA
    {
        private readonly string cnBD = "";
        private string sqlQuery = "";

        public EstadoDA(string cnBD)
        {
            this.cnBD = cnBD;
        }

        public Entity.EstadoBdBE obtener()
        {
            sqlQuery = "usp_estado_bd";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.QueryFirst<Entity.EstadoBdBE>(sqlQuery, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
