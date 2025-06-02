package com.example.apilibrary.controller;

import com.example.apilibrary.dto.InventarioReporteDTO;
import com.example.apilibrary.dto.VentaDTO;
import com.example.apilibrary.service.ReporteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reportes")
@PreAuthorize("hasRole('ADMIN')") // All report endpoints are admin-only
public class ReporteController {

    private final ReporteService reporteService;

    @Autowired
    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    // Helper method to simulate file download response
    private <T> ResponseEntity<List<T>> simulateFileResponse(List<T> data, String fileType, String fileNamePrefix) {
        if (data == null || data.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Simulate file generation by returning JSON data with a message.
        // In a real app, you'd use a library to generate PDF/Excel and set appropriate Content-Type.
        // For PDF: MediaType.APPLICATION_PDF
        // For Excel: new MediaType("application", "vnd.openxmlformats-officedocument.spreadsheetml.sheet")

        String simulatedContent = "Simulación de reporte " + fileType + ". Contenido:
" +
                                  data.stream().map(Object::toString).collect(Collectors.joining("
"));
        
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileNamePrefix + "_" + LocalDate.now() + (fileType.equalsIgnoreCase("pdf") ? ".pdf" : ".xlsx"));
        headers.add("X-Simulated-Report", "true"); // Custom header to indicate simulation

        // Returning data as JSON for now, actual file streaming is more complex.
        // For actual file download, the body would be byte[] or InputStreamResource
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON) // Simulate with JSON, actual would be PDF/Excel
                .headers(headers)
                .body(data); // Return the actual data as JSON for inspection
    }
    
    private <T> ResponseEntity<String> simulateFileResponseWithStringMessage(List<T> data, String fileType, String fileNamePrefix) {
        if (data == null || data.isEmpty()) {
             return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body("No hay datos para generar el reporte " + fileType + " " + fileNamePrefix);
        }

        String simulatedMessage = "Este es un reporte " + fileType + " simulado para: " + fileNamePrefix + 
                                  ". En una aplicación real, aquí se generaría y devolvería un archivo " + fileType + ". " +
                                  "Número de registros: " + data.size();
        
        HttpHeaders headers = new HttpHeaders();
        // For PDF: headers.setContentType(MediaType.APPLICATION_PDF);
        // For Excel: headers.setContentType(new MediaType("application", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentType(MediaType.TEXT_PLAIN); // For simulation with text message
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileNamePrefix + "_" + LocalDate.now() + (fileType.equalsIgnoreCase("pdf") ? ".pdf" : ".txt"));
        headers.add("X-Simulated-Report", "true");

        return ResponseEntity.ok()
                .headers(headers)
                .body(simulatedMessage);
    }


    @GetMapping("/ventas-pdf")
    public ResponseEntity<String> generarReporteVentasPdf(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<VentaDTO> datosVentas = reporteService.generarDatosReporteVentas(fechaInicio, fechaFin);
        // Actual PDF generation logic would go here.
        // For simulation, we return a message or the data as JSON with PDF headers.
        return simulateFileResponseWithStringMessage(datosVentas, "PDF", "ventas");
    }

    @GetMapping("/ventas-excel")
    public ResponseEntity<String> generarReporteVentasExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        List<VentaDTO> datosVentas = reporteService.generarDatosReporteVentas(fechaInicio, fechaFin);
        // Actual Excel generation logic would go here.
        return simulateFileResponseWithStringMessage(datosVentas, "Excel", "ventas");
    }

    @GetMapping("/inventario-pdf")
    public ResponseEntity<String> generarReporteInventarioPdf() {
        List<InventarioReporteDTO> datosInventario = reporteService.generarDatosReporteInventario();
        return simulateFileResponseWithStringMessage(datosInventario, "PDF", "inventario");
    }

    @GetMapping("/inventario-excel")
    public ResponseEntity<String> generarReporteInventarioExcel() {
        List<InventarioReporteDTO> datosInventario = reporteService.generarDatosReporteInventario();
        return simulateFileResponseWithStringMessage(datosInventario, "Excel", "inventario");
    }
}
