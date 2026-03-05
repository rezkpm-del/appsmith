export default {
  obtenerReporteInsumos: () => {
    // 1. Obtenemos datos de forma segura
    const articulos = Array.isArray(get_nombres_articulos.data) ? get_nombres_articulos.data : [];
    const ventas = Array.isArray(Query2.data) ? Query2.data : [];
    const stock = Array.isArray(Query_Stock.data) ? Query_Stock.data : [];
    const compras = Array.isArray(Query_Compras.data) ? Query_Compras.data : []; // Nueva línea!

    // 2. Diccionario de nombres
    const mapaNombres = {};
    articulos.forEach(art => {
      mapaNombres[art.value.toString()] = art.label; 
    });

    // 3. Unificamos todo
    const reporte = {};

    // Stock inicial
    stock.forEach(item => {
      const idStr = item.IdArticulo.toString();
      reporte[idStr] = {
        IdArticulo: item.IdArticulo,
        Insumo: mapaNombres[idStr] || `Desconocido (${idStr})`,
        Stock_Inicial: Number(item.stock_inicial) || 0,
        Vendido: 0,
        Comprado: 0,       // Agregamos Comprado
        Costo_Total: 0,    // Agregamos Costo
        Stock_Actual: Number(item.stock_inicial) || 0
      };
    });

    // Ventas
    ventas.forEach(item => {
      const idStr = item.IdArticulo.toString();
      if (!reporte[idStr]) {
        reporte[idStr] = { IdArticulo: item.IdArticulo, Insumo: mapaNombres[idStr] || `Desconocido (${idStr})`, Stock_Inicial: 0, Vendido: 0, Comprado: 0, Costo_Total: 0, Stock_Actual: 0 };
      }
      const consumo = Math.abs(Number(item.cant_vendida) || 0); 
      reporte[idStr].Vendido = consumo;
      reporte[idStr].Stock_Actual -= consumo; // Restamos el consumo
    });

    // Compras (Agregamos este bloque nuevo)
    compras.forEach(item => {
      const idStr = item.IdArticulo.toString();
      if (!reporte[idStr]) {
        reporte[idStr] = { IdArticulo: item.IdArticulo, Insumo: mapaNombres[idStr] || `Desconocido (${idStr})`, Stock_Inicial: 0, Vendido: 0, Comprado: 0, Costo_Total: 0, Stock_Actual: 0 };
      }
      const cantComprada = Number(item.cant_comprada) || 0;
      reporte[idStr].Comprado = cantComprada;
      reporte[idStr].Costo_Total = Number(item.costo_total) || 0;
      
   
      reporte[idStr].Stock_Actual += cantComprada; 
    });

    return Object.values(reporte);
  }
}