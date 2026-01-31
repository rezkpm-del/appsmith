export default {
	obtenerReporteInsumos: () => {
		const ventas = Query2.data || [];
		const stockActual = Query_Stock.data || [];
		const nombres = get_nombres_articulos.data || [];
		
		return stockActual.map(item => {
			// 1. Buscamos el nombre del insumo en la otra base de datos
			const infoArticulo = nombres.find(n => String(n.IdArticulo) === String(item.IdArticulo));
			const nombreReal = infoArticulo ? infoArticulo.Descripcion : "Desconocido (" + item.IdArticulo + ")";
			
			// 2. Buscamos la venta relacionada
			const ventaRelacionada = ventas.find(v => String(v.IdArticulo) === String(item.IdArticulo));
			const cantidadVendida = ventaRelacionada ? parseFloat(ventaRelacionada.cant_vendida) : 0;
			
			const stockIni = parseFloat(item.stock_inicial) || 0;
			
			return {
				"Insumo": nombreReal,
				"Stock_Inicial": stockIni,
				"Vendido": cantidadVendida,
				"Stock_Actual": stockIni - cantidadVendida
			};
		});
	}
}