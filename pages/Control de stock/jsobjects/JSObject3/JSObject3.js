export default {
  obtenerReporteInsumos: () => {
    // 1. Obtenemos los datos de las tres consultas. Si alguna falla, usamos un array vacío.
    const articulos = Array.isArray(get_nombres_articulos.data) ? get_nombres_articulos.data : [];
const ventas = Array.isArray(Query2.data) ? Query2.data : [];
const stock = Array.isArray(Query_Stock.data) ? Query_Stock.data : [];

    // 2. Creamos un "Diccionario" (Map) de nombres para que la búsqueda sea súper rápida
    // Usamos toString() por si las IDs vienen como número de un lado y como texto del otro.
    const mapaNombres = {};
    articulos.forEach(art => {
      // Acá está la clave de tu problema: ahora usamos .value y .label
      mapaNombres[art.value.toString()] = art.label; 
    });

    // 3. Unificamos todo en un objeto usando el IdArticulo como llave
    const reporte = {};

    // Primero metemos el stock inicial
    stock.forEach(item => {
      const idStr = item.IdArticulo.toString();
      reporte[idStr] = {
        IdArticulo: item.IdArticulo,
        Insumo: mapaNombres[idStr] || `Desconocido (${idStr})`,
        Stock_Inicial: Number(item.stock_inicial) || 0,
        Vendido: 0,
        Stock_Actual: Number(item.stock_inicial) || 0
      };
    });

    // Luego le restamos las ventas
    ventas.forEach(item => {
      const idStr = item.IdArticulo.toString();
      
      // Si se vendió algo que por algún motivo no estaba en la tabla de stock inicial, lo creamos
      if (!reporte[idStr]) {
        reporte[idStr] = {
          IdArticulo: item.IdArticulo,
          Insumo: mapaNombres[idStr] || `Desconocido (${idStr})`,
          Stock_Inicial: 0,
          Vendido: 0,
          Stock_Actual: 0
        };
      }
      
// Actualizamos las cantidades
 const consumo = Math.abs(Number(item.cant_vendida) || 0); 
reporte[idStr].Vendido = consumo;
reporte[idStr].Stock_Actual = reporte[idStr].Stock_Inicial - consumo;
    });

    // 4. Convertimos el objeto final en un array para que la tabla lo pueda leer
    return Object.values(reporte);
  }
}