package pe.upn.globalfrio.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Cabecera de una cotización generada en la web (RF04).
 * total = subtotalEquipos + subtotalManoObra + costoTraslado (RF03). Tabla cotizacion.
 */
@Entity
@Table(name = "cotizacion")
@Getter
@Setter
@NoArgsConstructor
public class Cotizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20, unique = true)
    private String codigo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_servicio_id", nullable = false)
    private TipoServicio tipoServicio;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tipo_cliente_id", nullable = false)
    private TipoCliente tipoCliente;

    @ManyToOne(optional = false)
    @JoinColumn(name = "zona_id", nullable = false)
    private Zona zona;

    @Column(name = "area_m2", precision = 6, scale = 2)
    private BigDecimal areaM2;

    @Column(name = "btu_recomendado")
    private Integer btuRecomendado;

    @Column(name = "subtotal_equipos", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotalEquipos = BigDecimal.ZERO;

    @Column(name = "subtotal_mano_obra", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotalManoObra = BigDecimal.ZERO;

    @Column(name = "costo_traslado", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoTraslado = BigDecimal.ZERO;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(nullable = false, length = 15)
    private String estado = "GENERADA";

    @OneToMany(mappedBy = "cotizacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleCotizacion> detalles = new ArrayList<>();

    public void agregarDetalle(DetalleCotizacion detalle) {
        detalle.setCotizacion(this);
        detalles.add(detalle);
    }

    @PrePersist
    void antesDeGuardar() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }
}
