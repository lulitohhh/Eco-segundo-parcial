const assignRoles = (players) => {
  // Verifica si hay al menos dos jugadores
  if (players.length < 2) {
    console.log("Se requieren al menos dos jugadores para asignar roles.");
    return players; // Devuelve la lista original sin cambios
  }

  // Mezcla los jugadores
  let shuffled = players.sort(() => 0.5 - Math.random());

  // Asigna el rol de "marco" al primer jugador
  shuffled[0].role = "marco";

  // Asigna el rol de "polo-especial" al segundo jugador
  shuffled[1].role = "polo-especial";

  // Asigna el rol de "polo" a los demás jugadores
  for (let i = 2; i < shuffled.length; i++) {
    shuffled[i].role = "polo";
  }

  return shuffled;
};

module.exports = { assignRoles };
