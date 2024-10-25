import { socket, router } from '../routes.js';

export default function renderScreen1() {
	const app = document.getElementById('app');
	app.innerHTML = `
    <h1>Tabla de Puntuaciones</h1>
	<h4>Recuerda, el primer jugador en alcanzar 100 puntos gana la partida.</h4>
		<div id="container">
			<table id="scoresTable">
				<thead>
					<tr>
						<th>Puesto</th>
						<th>Jugador</th>
						<th>Puntos</th>
					</tr>
				</thead>
				<tbody id="players"></tbody>
			</table>
		</div>
  `;

	// Función para actualizar la tabla de jugadores
	const renderJugadores = (players) => {
		let listadoJugadores = '';

		players.forEach((player, index) => {
			listadoJugadores += `
				<tr>
					<td>${index + 1}</td>
					<td>${player.nickname}</td>
					<td>${player.score} pts</td>
				</tr>
			`;
		});

		document.getElementById('players').innerHTML = listadoJugadores;
	};

	// Este escucha las actualizaciones de puntuación
	socket.on('puntuaciones', (data) => {
		const { players } = data;
		renderJugadores(players); // Actualizar la tabla de jugadores
	});

	// Despues de escuchar renderiza los jugadores
	socket.on('userJoined', (db) => {
		console.log('userJoined', db);
		const { players } = db;
		renderJugadores(players); 
	});

	// Redirige la pantalla
	socket.on('ganadorpuntos', (data) => {
		console.log('ganador:', data.ganador);
		router.navigateTo('/screen2'); // Redirigir a la pantalla 2
	});
}
