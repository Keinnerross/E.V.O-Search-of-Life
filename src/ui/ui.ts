import { Planeta } from '../core/planeta';

// Crea el contenedor de UI en el DOM
export function crearUI(): void {
  const statsDiv = document.createElement('div');
  statsDiv.id = 'stats';
  statsDiv.style.position = 'absolute';
  statsDiv.style.top = '10px';
  statsDiv.style.left = '10px';
  statsDiv.style.background = 'rgba(0, 0, 0, 0.6)';
  statsDiv.style.padding = '10px';
  statsDiv.style.borderRadius = '8px';
  statsDiv.style.color = 'white';
  statsDiv.style.fontFamily = 'monospace';
  statsDiv.style.zIndex = '10';

  statsDiv.innerHTML = `
    <div>⏳ Tiempo: <span id="ui-tiempo">0</span></div>
    <div>🌡️ Temperatura: <span id="ui-temp">0</span> °C</div>
    <div>🌡️ Estacion: <span id="ui-estacion"></span></div>
    <div>🌡️ Hora: <span id="ui-horaDelDia"></span></div>
    <div>🌡️ humedad: <span id="ui-humedad"></span></div>

    <div>🌡️ nubes: <span id="ui-nubes"></span></div>

  `;
  // <div>🌬️ Aire: <span id="ui-aire">0</span></div>
  // <div>💧 Agua: <span id="ui-agua">0</span></div>
  // <div>🪨 Tierra: <span id="ui-tierra">0</span></div>






  document.body.appendChild(statsDiv);
}

// Actualiza la UI con los datos actuales del planeta
export function actualizarUI(planeta: Planeta): void {
  (document.getElementById('ui-tiempo') as HTMLElement).textContent = planeta.tiempo.toString();
  (document.getElementById('ui-temp') as HTMLElement).textContent = planeta.temperatura.toFixed(1);
  (document.getElementById('ui-estacion') as HTMLElement).textContent = planeta.estacion.toString();
  (document.getElementById('ui-horaDelDia') as HTMLElement).textContent = planeta.horaDelDia.toString().padStart(2, '0') + ":00";
  // (document.getElementById('ui-aguaLíquida') as HTMLElement).textContent = planeta.aguaLíquida.toFixed(1);
  (document.getElementById('ui-nubes') as HTMLElement).textContent = planeta.nubes.toFixed(1);
  (document.getElementById('ui-humedad') as HTMLElement).textContent = planeta.humedad.toFixed(1);



  // (document.getElementById('ui-aire') as HTMLElement).textContent = planeta.aire.toString();
  // (document.getElementById('ui-agua') as HTMLElement).textContent = planeta.agua.toString();
  // (document.getElementById('ui-tierra') as HTMLElement).textContent = planeta.tierra.toString();
}
