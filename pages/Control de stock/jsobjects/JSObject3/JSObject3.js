export default {
	obtenerReporteInsumos: () => {
		const ventas = Query2.data || [];
		const stockActual = Query_Stock.data || [];
		const nombres = get_nombres_articulos.data || [];
		
		// 1. Unimos y preparamos la lista completa
		const listaExtendida = stockActual.map(item => {
			const infoArticulo = nombres.find(n => String(n.IdArticulo) === String(item.IdArticulo));
			const nombreReal = infoArticulo ? infoArticulo.Descripcion : "Desconocido (" + item.IdArticulo + ")";
			
			const ventaRelacionada = ventas.find(v => String(v.IdArticulo) === String(item.IdArticulo));
			const cantidadVendida = ventaRelacionada ? parseFloat(ventaRelacionada.cant_vendida) : 0;
			
			return {
				insumo: nombreReal,
				stockIni: parseFloat(item.stock_inicial) || 0,
				vendido: cantidadVendida
			};
		});

		// 2. Agrupamos por nombre de insumo sumando los valores
		const agrupado = listaExtendida.reduce((acc, current) => {
			if (!acc[current.insumo]) {
				acc[current.insumo] = { 
					"Insumo": current.insumo, 
					"Stock_Inicial": 0, 
					"Vendido": 0 
				};
			}
			acc[current.insumo].Stock_Inicial += current.stockIni;
			acc[current.insumo].Vendido += current.vendido;
			return acc;
		}, {});

		// 3. Convertimos el objeto de nuevo a una lista y calculamos el stock actual
		return Object.values(agrupado).map(item => ({
			...item,
			"Stock_Actual": item.Stock_Inicial - item.Vendido
		})).sort((a, b) => a.Insumo.localeCompare(b.Insumo)); // Ordenado alfabéticamente
	}
}