using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Data
{
    /// <summary>
    /// Acceso a datos de los catálogos del cotizador: tipos de servicio y de cliente, zonas, equipos y servicios.
    /// </summary>
    public class CotizadorDA
    {
        private readonly string cnBD = "";
        private string sqlQuery = "";

        public CotizadorDA(string cnBD)
        {
            this.cnBD = cnBD;
        }

        public List<Entity.TipoServicioBE> listarTiposServicio()
        {
            sqlQuery = "usp_tipo_servicio_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.TipoServicioBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public Entity.TipoServicioBE obtenerTipoServicio(string codigo)
        {
            sqlQuery = "usp_tipo_servicio_get";

            var p = new DynamicParameters();
            p.Add("codigo", codigo);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.QueryFirstOrDefault<Entity.TipoServicioBE>(sqlQuery, p, commandType: CommandType.StoredProcedure);
            }
        }

        public List<Entity.TipoClienteBE> listarTiposCliente()
        {
            sqlQuery = "usp_tipo_cliente_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.TipoClienteBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public Entity.TipoClienteBE obtenerTipoCliente(string codigo)
        {
            sqlQuery = "usp_tipo_cliente_get";

            var p = new DynamicParameters();
            p.Add("codigo", codigo);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.QueryFirstOrDefault<Entity.TipoClienteBE>(sqlQuery, p, commandType: CommandType.StoredProcedure);
            }
        }

        public List<Entity.ZonaBE> listarZonas()
        {
            sqlQuery = "usp_zona_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ZonaBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public Entity.ZonaBE obtenerZona(long id)
        {
            sqlQuery = "usp_zona_get";

            var p = new DynamicParameters();
            p.Add("id", id);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.QueryFirstOrDefault<Entity.ZonaBE>(sqlQuery, p, commandType: CommandType.StoredProcedure);
            }
        }

        public List<Entity.ProductoBE> listarEquipos()
        {
            sqlQuery = "usp_equipo_list";

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ProductoBE>(sqlQuery, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public List<Entity.ProductoBE> listarEquiposParaArea(int area)
        {
            sqlQuery = "usp_equipo_para_area";

            var p = new DynamicParameters();
            p.Add("area", area);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ProductoBE>(sqlQuery, p, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public List<Entity.ProductoBE> listarServicios(string codigo, int? btu)
        {
            sqlQuery = "usp_servicio_list";

            var p = new DynamicParameters();
            p.Add("codigo", codigo);
            p.Add("btu", btu);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.Query<Entity.ProductoBE>(sqlQuery, p, commandType: CommandType.StoredProcedure).ToList();
            }
        }

        public Entity.ProductoBE obtenerProducto(long id)
        {
            sqlQuery = "usp_producto_get";

            var p = new DynamicParameters();
            p.Add("id", id);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                return sqlCn.QueryFirstOrDefault<Entity.ProductoBE>(sqlQuery, p, commandType: CommandType.StoredProcedure);
            }
        }
    }
}
