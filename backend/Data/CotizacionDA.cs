using Dapper;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Data
{
    /// <summary>
    /// Acceso a datos de las cotizaciones: registrar (RF04) y consultar (RF05).
    /// </summary>
    public class CotizacionDA
    {
        private readonly string cnBD = "";
        private string sqlQuery = "";

        public CotizacionDA(string cnBD)
        {
            this.cnBD = cnBD;
        }

        /// <summary>
        /// Guarda la cabecera y sus líneas en una sola transacción: si algo falla, no se guarda nada.
        /// Devuelve la cotización con el id, código y fecha que asignó la base de datos.
        /// </summary>
        public Entity.CotizacionBE registrar(Entity.CotizacionBE cotizacion)
        {
            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            {
                sqlCn.Open();
                using (SqlTransaction tx = sqlCn.BeginTransaction())
                {
                    sqlQuery = "usp_cotizacion_insert";

                    var p = new DynamicParameters();
                    p.Add("tipo_servicio_id", cotizacion.tipoServicioId);
                    p.Add("tipo_cliente_id", cotizacion.tipoClienteId);
                    p.Add("zona_id", cotizacion.zonaId);
                    p.Add("area_m2", cotizacion.areaM2);
                    p.Add("btu_recomendado", cotizacion.btuRecomendado);
                    p.Add("subtotal_equipos", cotizacion.subtotalEquipos);
                    p.Add("subtotal_mano_obra", cotizacion.subtotalManoObra);
                    p.Add("costo_traslado", cotizacion.costoTraslado);
                    p.Add("total", cotizacion.total);

                    var registrada = sqlCn.QueryFirst<Entity.CotizacionBE>(sqlQuery, p, tx, commandType: CommandType.StoredProcedure);
                    cotizacion.id = registrada.id;
                    cotizacion.codigo = registrada.codigo;
                    cotizacion.fecha = registrada.fecha;

                    sqlQuery = "usp_detalle_cotizacion_insert";
                    foreach (var detalle in cotizacion.detalles)
                    {
                        var pd = new DynamicParameters();
                        pd.Add("cotizacion_id", cotizacion.id);
                        pd.Add("producto_id", detalle.productoId);
                        pd.Add("cantidad", detalle.cantidad);
                        pd.Add("precio_unitario", detalle.precioUnitario);
                        pd.Add("subtotal", detalle.subtotal);
                        sqlCn.Execute(sqlQuery, pd, tx, commandType: CommandType.StoredProcedure);
                    }

                    tx.Commit();
                }
            }
            return cotizacion;
        }

        /// <summary>
        /// Busca una cotización por su código, con sus líneas. Devuelve null si no existe.
        /// </summary>
        public Entity.CotizacionBE obtenerPorCodigo(string codigo)
        {
            sqlQuery = "usp_cotizacion_get";

            var p = new DynamicParameters();
            p.Add("codigo", codigo);

            using (SqlConnection sqlCn = new SqlConnection(this.cnBD))
            using (var resultado = sqlCn.QueryMultiple(sqlQuery, p, commandType: CommandType.StoredProcedure))
            {
                var cotizacion = resultado.ReadFirstOrDefault<Entity.CotizacionBE>();
                if (cotizacion == null)
                {
                    return null;
                }
                cotizacion.detalles = resultado.Read<Entity.DetalleCotizacionBE>().ToList();
                return cotizacion;
            }
        }
    }
}
