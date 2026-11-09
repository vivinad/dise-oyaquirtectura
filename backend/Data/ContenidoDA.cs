using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Data
{
    /// <summary>
    /// Acceso a datos del contenido de la página de inicio (Servicios, Trabajos y Mantenimiento).
    /// </summary>
    public class ContenidoDA
    {
        private readonly string cnBD = "";
        private string sqlQuery = "";

        public ContenidoDA(string cnBD)
        {
            this.cnBD = cnBD;
        }

        public List<Entity.ServicioWebBE> listarServicios()
        {
            sqlQuery = "usp_servicio_web_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ServicioWebBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public List<Entity.TrabajoBE> listarTrabajos()
        {
            sqlQuery = "usp_trabajo_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.TrabajoBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public List<Entity.ItemMantenimientoBE> listarItemsMantenimiento()
        {
            sqlQuery = "usp_item_mantenimiento_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ItemMantenimientoBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }
    }
}
