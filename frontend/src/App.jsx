import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function App() {
  const [angle, setAngle] = useState('');
  const [velocity, setVelocity] = useState('');
  const [trajectory, setTrajectory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTrajectory([]);

    try {
      const response = await fetch('http://localhost:8000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          angle: parseFloat(angle),
          velocity: parseFloat(velocity),
        }),
      });

      const data = await response.json();
      setTrajectory(data.trajectory);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: trajectory.map((point) => point.x.toFixed(2)),
    datasets: [
      {
        label: 'Projectile Path',
        data: trajectory.map((point) => point.y),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Projectile Motion Simulator</h1>

      <form onSubmit={handleSimulate} style={{ marginBottom: '2rem' }}>
        <label>
          Angle (degrees):
          <input
            type="number"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            required
          />
        </label>

        <label style={{ marginLeft: '1rem' }}>
          Velocity (m/s):
          <input
            type="number"
            value={velocity}
            onChange={(e) => setVelocity(e.target.value)}
            required
          />
        </label>

        <button type="submit" style={{ marginLeft: '1rem' }}>
          Simulate
        </button>
      </form>

      {loading && <p>Calculating...</p>}

      {!loading && trajectory.length > 0 && (
        <div>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
