import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sismos, setSismos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="container">
      <h1>Registro de Sismos</h1>
      <div className="grid">
        {sismos.map((sismo) => (
          <div key={sismo.id} className="card">
            <h3>Mag: {sismo.properties.mag}</h3>
            <p>Lugar: {sismo.properties.place}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;