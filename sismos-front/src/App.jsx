import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 1. Nuevo estado para controlar el buscador
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchSismos = async () => {
      try {
        // URL actualizada hacia tu backend en la nube
        const response = await fetch('https://sismos-backend-production.up.railway.app/api/sismos');
        if (!response.ok) throw new Error('Error al conectar');
        const data = await response.json();
        setSismos(data.features || []);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar datos. Asegúrate de que el backend esté activo.');
        setLoading(false);
      }
    };
    fetchSismos();
  }, []);

  if (loading) return <div className="container"><h2>Cargando sismos...</h2></div>;
  if (error) return <div className="container error">{error}</div>;

  // 2. Filtramos el arreglo antes de imprimirlo
  const sismosFiltrados = sismos.filter((sismo) => {
    // Verificamos que place exista y lo comparamos en minúsculas
    return sismo.properties.place 
      ? sismo.properties.place.toLowerCase().includes(busqueda.toLowerCase())
      : false;
  });

  return (
    <div className="container">
      <h1>Registro de Sismos</h1>
      
      {/* 3. Agregamos el input del buscador */}
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="Buscar por estado o ciudad (ej. Chiapas)..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ 
            padding: '10px 15px', 
            width: '100%', 
            maxWidth: '400px', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      <div className="grid">
        {/* 4. Cambiamos sismos.map por sismosFiltrados.map */}
        {sismosFiltrados.map((sismo) => (
          <div key={sismo.id} className="card">
            <h3>Mag: {sismo.properties.mag}</h3>
            <p>Lugar: {sismo.properties.place}</p>
          </div>
        ))}
      </div>
      
      {/* Mensaje amigable por si la búsqueda no coincide con nada */}
      {sismosFiltrados.length === 0 && (
        <h3 style={{ textAlign: 'center', width: '100%' }}>No se encontraron sismos en ese lugar.</h3>
      )}
    </div>
  );
}

export default App;