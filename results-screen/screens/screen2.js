import { socket, router } from '../routes.js';

export default function renderScreen2() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>¡Un jugador ha alcanzado la gloria!</h1>
    <p id="MensajeParaElGanador"></p>
		<div id="container">
    <h2>Clasificación Final</h2>
    <table id="finalScoresTable">
        <thead>
            <tr>
                <th>Puesto</th>
                <th>Jugador</th>
                <th>Puntos</th>
            </tr>
        </thead>
        <tbody id="finalPlayers"></tbody>
    </table>
    <button id="sortAlphabeticallyBtn">Ordenar Alfabéticamente</button>
		</div>
  `;

	// Solicitar datos del ganador y los jugadores al servidor
	socket.emit('getWinnerData');

	socket.on('ganadorpuntos', (data) => {
		const { ganador, players } = data;

		// Mostrar el mensaje del ganador en la pantalla
		document.getElementById('MensajeParaElGanador').textContent = `Después de un emocionante juego, ${ganador.toUpperCase()} ha alcanzado los 100 puntos y se lleva la victoria.`;

		// Renderizar los jugadores
		renderPlayers(players);
	});

	// Función para renderizar la lista de jugadores
	function renderPlayers(players) {
		// Ordenar por puntuación de mayor a menor
		players.sort((a, b) => b.score - a.score);

		// Crear la lista de posiciones con los jugadores
		let listadojugadores = '';
		players.forEach((player, index) => {
			listadojugadores += `
				<tr>
					<td>${index + 1}</td>
					<td>${player.name}</td>
					<td>${player.score} pts</td>
				</tr>
			`;
		});

		// Renderizar la lista de jugadores en el HTML
		document.getElementById('finalPlayers').innerHTML = listadojugadores;
	}

	// Agregar evento para el botón "Ordenar alfabéticamente"
	document.getElementById('sortAlphabeticallyBtn').addEventListener('click', () => {
		// Obtener la lista actual de jugadores
		const listadojugadoresElement = document.getElementById('finalPlayers');
		const playersItems = Array.from(listadojugadoresElement.getElementsByTagName('tr'));

		// Ordenar alfabéticamente
		playersItems.sort((a, b) => {
			const playerNameA = a.cells[1].textContent; // Obtener el nombre
			const playerNameB = b.cells[1].textContent; // Obtener el nombre
			return playerNameA.localeCompare(playerNameB); // Comparar alfabéticamente
		});
		
		// Limpiar la lista y agregar los elementos ordenados
		listadojugadoresElement.innerHTML = '';
		playersItems.forEach((item) => listadojugadoresElement.appendChild(item));
		});
		
	socket.on('gameRestarted', (data) => {
		console.log(data.message);
		router.navigateTo('/'); // Navegar a la pantalla principal o lobby
	});
}
