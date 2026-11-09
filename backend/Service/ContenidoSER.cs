using AutoMapper;
using System.Collections.Generic;

namespace Service
{
    /// <summary>
    /// Contenido de la página de inicio que se guarda en la base de datos.
    /// </summary>
    public class ContenidoSER
    {
        private Data.ContenidoDA objData;
        private readonly string cnBD = "";
        private readonly IMapper mapper;

        public ContenidoSER(string cnBD, IMapper mapper)
        {
            this.cnBD = cnBD;
            this.mapper = mapper;
        }

        public List<DTO.ServicioWebDTO> listarServicios()
        {
            objData = new Data.ContenidoDA(this.cnBD);
            List<Entity.ServicioWebBE> lista = objData.listarServicios();
            return mapper.Map<List<DTO.ServicioWebDTO>>(lista);
        }

        public List<DTO.TrabajoDTO> listarTrabajos()
        {
            objData = new Data.ContenidoDA(this.cnBD);
            List<Entity.TrabajoBE> lista = objData.listarTrabajos();
            return mapper.Map<List<DTO.TrabajoDTO>>(lista);
        }

        public List<DTO.ItemMantenimientoDTO> listarItemsMantenimiento()
        {
            objData = new Data.ContenidoDA(this.cnBD);
            List<Entity.ItemMantenimientoBE> lista = objData.listarItemsMantenimiento();
            return mapper.Map<List<DTO.ItemMantenimientoDTO>>(lista);
        }
    }
}
