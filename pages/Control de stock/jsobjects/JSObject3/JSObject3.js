export default {
	obtenerReporteInsumos: () => {
		const ventas = Query2.data || [];
		const stockActual = Query_Stock.data || []; // CAMBIADO A Query_Stock
		
		return stockActual.map(item => {
			const ventaRelacionada = ventas.find(v => 
				String(v.IdArticulo).trim() === String(item.IdArticulo).trim()
			);
			
			const cantidadVendida = ventaRelacionada ? parseFloat(ventaRelacionada.cant_vendida) : 0;
			const stockIni = parseFloat(item.stock_inicial) || 0;
			
			return {
				"ID": item.IdArticulo,
				"Stock_Inicial": stockIni,
				"Vendido": cantidadVendida,
				"Stock_Actual": stockIni - cantidadVendida
			};
		});
	}
}