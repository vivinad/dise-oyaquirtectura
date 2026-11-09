using AutoMapper;

namespace Service
{
    /// <summary>
    /// Informa si la API está conectada a la base de datos y cuántos registros tiene cada tabla.
    /// </summary>
    public class EstadoSER
    {
        private Data.EstadoDA objData;
        private readonly string cnBD = "";
        private readonly IMapper mapper;

        public EstadoSER(string cnBD, IMapper mapper)
        {
            this.cnBD = cnBD;
            this.mapper = mapper;
        }

        public DTO.EstadoBdDTO obtener()
        {
            objData = new Data.EstadoDA(this.cnBD);
            DTO.EstadoBdDTO estado = mapper.Map<DTO.EstadoBdDTO>(objData.obtener());
            estado.conectado = true;
            return estado;
        }
    }
}
