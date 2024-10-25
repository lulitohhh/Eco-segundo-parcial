// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
    return (user) => {
        db.players.push({ id: socket.id, ...user, score: 0 });
        console.log(db.players);
        io.emit('userJoined', db); 
    };
};

const startGameHandler = (socket, db, io) => {
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});
		});
	};
};


let pasarganador = null; 

// En esta funcion organizo los datos que se van a obtener más adelante
const buildWinnerData = (winner, players) => {
    return {
        ganador: winner.nickname,
        players: players.map((player) => ({
            name: player.nickname,
            score: player.score,
        })),
    };
};

// Handler para obtener datos del ganador
const obtenerDatosGanador = (socket, db) => {
    return () => {
        if (pasarganador) {
            const winnerData = buildWinnerData(pasarganador, db.players);
            socket.emit('ganadorpuntos', winnerData);
        }
    };
};

// Aquí se ajusta la logica de los puntajes del juego
const adjustScores = (marcoPlayer, poloSelected, poloEspecial) => {
    if (poloSelected.role === 'polo-especial') {
        marcoPlayer.score += 50; // Marco atrapa al Polo Especial
        poloSelected.score -= 10; // Resta puntos al Polo Especial
    } else {
        marcoPlayer.score -= 10; // Marco no atrapa al Polo Especial
        if (poloEspecial) {
            poloEspecial.score += 10; // El Polo Especial gana puntos
        }
    }
};

// NOTIFICA EL RESULTADO DEL JUEGO :D (Por fin funciona)
const notifyGameOver = (io, marcoPlayer, poloSelected, isWinner) => {
    const message = isWinner
        ? `El marco ${marcoPlayer.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`
        : `El marco ${marcoPlayer.nickname} ha perdido`;
    
    io.emit('notifyGameOver', { message });
};

// Handler para seleccionar un Polo
const onSelectPoloHandler = (socket, db, io) => {
    return (userID) => {
        const marcoPlayer = db.players.find((user) => user.id === socket.id);
        const poloSelected = db.players.find((user) => user.id === userID);
        const poloEspecial = db.players.find((user) => user.role === 'polo-especial');

        // Ajustar puntajes según la selección del Polo
        adjustScores(marcoPlayer, poloSelected, poloEspecial);

        // ESTO ES PARA DETERMINAR SI HAY GANADOR
        const isWinner = poloSelected.role === 'polo-especial';
        notifyGameOver(io, marcoPlayer, poloSelected, isWinner);

        // Emitir el evento para actualizar las puntuaciones
        emitScores(io, db);

        // Y ESTO COMPRUEBA DE QUE SI EXISTA
        const ganador = db.players.find((player) => player.score >= 100);
        if (ganador) {
            pasarganador = ganador;
            console.log('Winner:', ganador);
            io.emit('ganadorpuntos', {
                ganador: ganador.nickname,
                players: db.players.map((player) => ({
                    name: player.nickname,
                    score: player.score,
                })),
            });
        }
    };
};

//Y CON ESTO PUEDO EMITIR LA LISTA DE PUNTUACIONES
const emitScores = (io, db) => {
	io.emit('puntuaciones', {
        players: db.players.map((player) => ({
            nickname: player.nickname,  // Asegúrate de que esto se llame "nickname" y no "name"
            score: player.score,
        })),
	});
};


module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
	obtenerDatosGanador,
};