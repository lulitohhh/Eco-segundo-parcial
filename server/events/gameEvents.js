const db = require("../db");
const {
  joinGameHandler,
  startGameHandler,
  notifyMarcoHandler,
  notifyPoloHandler,
  onSelectPoloHandler,
  obtenerDatosGanador,

} = require("../event-handlers/gameHandlers");
const { assignRoles } = require("../utils/helpers");

const gameEvents = (socket, io) => {
  // Handle player joining the game
  socket.on("joinGame", joinGameHandler(socket, db, io));

  // Handle the start of the game
  socket.on("startGame", startGameHandler(socket, db, io));

  // Notify players when "Marco" is called
  socket.on("notifyMarco", notifyMarcoHandler(socket, db, io));

  // Notify players when "Polo" is called
  socket.on("notifyPolo", notifyPoloHandler(socket, db, io));

  // Handle the selection of "Polo" by "Marco"
  socket.on("onSelectPolo", onSelectPoloHandler(socket, db, io));

 
  socket.on('getWinnerData', obtenerDatosGanador(socket, db));


}

module.exports = { gameEvents };
