export default {
	obtenerReporteInsumos: () => {
		// Verificamos que las consultas tengan datos antes de empezar
		const ventas = Query2.data || [];
		const stockActual = Query1.data || [];
		
		return stockActual.map(item => {
			// 1. Buscamos la venta coincidente
			// Usamos find y forzamos a String para evitar problemas de tipo de dato
			const ventaRelacionada = ventas.find(v => String(v.IdArticulo) === String(item.IdArticulo));
			
			// 2. Extraemos los valores usando los nombres exactos de tus columnas SQL
			const cantidadVendida = ventaRelacionada ? Number(ventaRelacionada.cant_vendida) : 0;
			// IMPORTANTE: Asegurate que en Query1 la columna se llame stock_inicial o Cantidad
			const stockIni = Number(item.stock_inicial) || Number(item.Cantidad) || 0;
			
			return {
				"ID": item.IdArticulo,
				"Stock Inicial": stockIni,
				"Vendido": cantidadVendida,
				"Stock Actual": stockIni - cantidadVendida
			};
		});
	}
}