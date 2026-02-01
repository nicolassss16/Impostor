const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DE CATEGORÍAS (MODO BESTIA) ---
const wordPacks = {
    lol: [
        "Teemo", "Yasuo", "Yone", "Zed", "Katarina", "Akali", "Ahri", "Lux", 
        "Garen", "Darius", "Mordekaiser", "Sett", "Lee Sin", "Master Yi", "Viego", 
        "Kayn", "Jinx", "Caitlyn", "Ezreal", "Jhin", "Miss Fortune", "Vayne", 
        "Kai'Sa", "Thresh", "Blitzcrank", "Nautilus", "Pyke", "Leona", "Morgana", 
        "Lulu", "Yuumi", "Soraka", "Sona", "Seraphine", "Ekko", "Sylas", 
        "Irelia", "Riven", "Fiora", "Camille", "Jax", "Tryndamere", "Nasus", 
        "Renekton", "Aatrox", "Urgot", "Sion", "Ornn", "Malphite", "Cho'Gath", 
        "Warwick", "Volibear", "Fiddlesticks", "Shaco", "Evelynn", "Kha'Zix", 
        "Rengar", "Graves", "Kindred", "Heimerdinger", "Veigar", "Syndra", 
        "Orianna", "Viktor", "Azir", "Twisted Fate", "Draven", "Samira", "Lucian"
    ],
    futbol: [
        "Lionel Messi", "Cristiano Ronaldo", "Kylian Mbappé", "Erling Haaland", 
        "Neymar Jr", "Vinícius Jr", "Julián Álvarez", "Dibu Martínez", "Enzo Fernández", 
        "Alexis Mac Allister", "Rodrigo De Paul", "Ángel Di María", "Lautaro Martínez", 
        "Cuti Romero", "Otamendi", "Paulo Dybala", "Lewandowski", "Karim Benzema", 
        "Luka Modrić", "Kevin De Bruyne", "Mohamed Salah", "Harry Kane", "Jude Bellingham", 
        "Antoine Griezmann", "Thibaut Courtois", "Ter Stegen", "Virgil van Dijk", 
        "Sergio Ramos", "Luis Suárez", "Edinson Cavani", "Diego Maradona", "Pelé", 
        "Ronaldinho", "Zinedine Zidane", "Riquelme", "Kun Agüero", "Carlos Tevez", 
        "Zlatan Ibrahimović", "Gareth Bale", "Andrés Iniesta", "Xavi Hernández"
    ],
    comida: [
        "Pizza", "Hamburguesa", "Sushi", "Asado", "Empanadas", "Helado",
        "Chocolate", "Tacos", "Ensalada", "Milanesa con Puré", "Pancho", "Mate",
        "Fernet", "Dulce de Leche", "Alfajor", "Choripán", "Polenta", 
        "Guiso de Lentejas", "Vitel Toné", "Mandarina", "Café", "Tostado",
        "Ñoquis", "Flan con Crema", "Tortilla de Papas", "Facturas", "Chipá",
        "Papas Fritas", "Fideos con Tuco", "Sanguche de Miga", "Ravioles", "Locro"
    ],
    paises: [
        "Argentina", "Brasil", "España", "Japón", "Estados Unidos", "Francia",
        "Italia", "China", "Rusia", "México", "Alemania", "Qatar", "Inglaterra",
        "Uruguay", "Chile", "Colombia", "Perú", "Australia", "Egipto", "Corea del Sur", 
        "Canadá", "India", "Sudáfrica", "Ucrania", "Portugal", "Suiza", "Grecia"
    ],
    streamers: [
        "Ibai", "AuronPlay", "Rubius", "Spreen", "Davoo Xeneize", "Coscu",
        "Momo", "Kun Agüero", "TheGrefg", "ElMariana", "Rivers", "Bananirou",
        "Unicornio", "Mazzat", "Luquitas Rodriguez", "Hasbulla", "MrBeast", 
        "Vegetta777", "Willyrex", "Frankkaster", "La Cobra", "Gastón Edul",
        "Carrera", "Robleis", "Markito Navaja", "Pellah", "Santutu", "Momo"
    ],
    cine: [
        "Harry Potter", "Star Wars", "El Señor de los Anillos", "Avengers", "Spiderman",
        "Batman", "Joker", "Titanic", "Shrek", "Toy Story", "Los Simpsons",
        "Breaking Bad", "Game of Thrones", "El Juego del Calamar", "Casados con Hijos",
        "Esperando la Carroza", "Los Simuladores", "Relatos Salvajes", "Frozen",
        "El Padrino", "Matrix", "Stranger Things", "Merlina", "Peaky Blinders"
    ],
    marcas: [
        "Nike", "Adidas", "Apple", "Samsung", "McDonalds", "Burger King",
        "Coca Cola", "Pepsi", "Manaos", "Marolio", "Ford", "Ferrari",
        "PlayStation", "Xbox", "Nintendo", "Mercado Libre", "Google", "YouTube",
        "Netflix", "Instagram", "TikTok", "Twitter (X)", "Discord", "Twitch"
    ],
    animales: [
        "Perro", "Gato", "León", "Tigre", "Elefante", "Jirafa",
        "Mono", "Carpincho", "Hornero", "Vaca", "Caballo", "Cerdo",
        "Gallina", "Pato", "Águila", "Tiburón", "Ballena", "Delfín",
        "Pingüino", "Oso Polar", "Canguro", "Koala", "Serpiente", "Araña",
        "Mosquito", "Cucaracha", "Ratón", "Dinosaurio", "Dragón"
    ],
    lugares: [
        "Escuela", "Hospital", "Comisaría", "Supermercado", "Kiosco",
        "Plaza", "Playa", "Montaña", "Cine", "Shopping", "Gimnasio",
        "Boliche", "Estadio de Fútbol", "Aeropuerto", "Baño", "Cocina",
        "Cementerio", "Iglesia", "McDonalds", "Cárcel", "Zoologico"
    ],
    cosas: [
        "Silla Gamer", "Mesa", "PC Gamer", "iPhone", "Cama", "Inodoro",
        "Papel Higiénico", "Espejo", "Ventana", "Puerta", "Televisor",
        "Auriculares", "Mouse", "Teclado Mecánico", "Zapatillas", "Billetera",
        "Dólar Blue", "Sube", "Llaves", "Mochila", "Aire Acondicionado", 
        "Ventilador", "Microondas", "Heladera", "Guitarra", "Pelota de Tenis"
    ]
};

// Estado del servidor
let rooms = {};
const GAME_DURATION = 300; // 5 minutos en segundos

// Función para enviar la lista de salas disponibles a todos
function broadcastRoomList() {
    const publicRooms = [];
    for (const [code, room] of Object.entries(rooms)) {
        // Solo mostramos salas en 'lobby'
        if (room.status === 'lobby') {
            publicRooms.push({
                code: code,
                category: room.category,
                count: room.players.length,
                jester: room.jesterActive
            });
        }
    }
    io.emit('roomsUpdate', publicRooms);
}

io.on('connection', (socket) => {
    // Enviar lista de salas al conectar
    broadcastRoomList();

    // 1. UNIRSE A SALA
    socket.on('joinRoom', ({ roomCode, username, category, withJester }) => {
        // Evitar unirse a partidas iniciadas
        if (rooms[roomCode] && rooms[roomCode].status === 'playing') {
            socket.emit('errorMsg', '¡La partida ya comenzó!');
            return;
        }

        socket.join(roomCode);
        
        // Crear sala si no existe
        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                status: 'lobby',
                category: wordPacks[category] ? category : 'cosas',
                deck: [...(wordPacks[category] || wordPacks['cosas'])],
                impostorId: null,
                jesterId: null,
                jesterActive: withJester, // Toggle del bufón
                timer: null,
                timeLeft: GAME_DURATION,
                votes: {}
            };
        } else {
            // Si el creador cambia ajustes
            if (category && wordPacks[category]) {
                rooms[roomCode].category = category;
                rooms[roomCode].deck = [...wordPacks[category]];
            }
            if (withJester !== undefined) rooms[roomCode].jesterActive = withJester;
        }

        // Añadir jugador
        rooms[roomCode].players.push({ id: socket.id, name: username });

        // Notificar a la sala
        io.to(roomCode).emit('updatePlayerList', {
            players: rooms[roomCode].players,
            jesterActive: rooms[roomCode].jesterActive
        });

        // Actualizar lista pública
        broadcastRoomList();
    });

    // 2. INICIAR JUEGO
    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3) return; // Mínimo 3 jugadores

        room.status = 'playing';
        
        // Elegir palabra
        const words = room.deck;
        const secretWord = words[Math.floor(Math.random() * words.length)];

        // Asignar Roles
        const playerIds = room.players.map(p => p.id);
        const impostorIndex = Math.floor(Math.random() * playerIds.length);
        room.impostorId = playerIds[impostorIndex];

        // Asignar Bufón (Solo si hay +4 jugadores y está activado)
        room.jesterId = null;
        if (room.jesterActive && playerIds.length >= 4) {
            let jesterIndex;
            do {
                jesterIndex = Math.floor(Math.random() * playerIds.length);
            } while (jesterIndex === impostorIndex);
            room.jesterId = playerIds[jesterIndex];
        }

        // Orden de turnos aleatorio
        const turnOrder = [...room.players].sort(() => Math.random() - 0.5).map(p => p.name);

        // Enviar roles individuales
        room.players.forEach(player => {
            let role = 'crew';
            let wordToSend = secretWord;

            if (player.id === room.impostorId) {
                role = 'impostor';
                wordToSend = '???';
            } else if (player.id === room.jesterId) {
                role = 'jester';
                wordToSend = secretWord; // El bufón sabe la palabra
            }

            io.to(player.id).emit('gameStarted', {
                role: role,
                word: wordToSend,
                order: turnOrder
            });
        });

        // Actualizar lista pública (quitar sala del lobby)
        broadcastRoomList();

        // Timer
        clearInterval(room.timer);
        room.timeLeft = GAME_DURATION;
        room.timer = setInterval(() => {
            room.timeLeft--;
            io.to(roomCode).emit('timerUpdate', room.timeLeft);

            if (room.timeLeft <= 0) {
                clearInterval(room.timer);
                startVotingPhase(roomCode);
            }
        }, 1000);
    });

    // 3. VOTACIÓN
    socket.on('forceVote', (roomCode) => startVotingPhase(roomCode));

    socket.on('submitVote', ({ roomCode, targetId }) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'voting') return;

        if (!room.votes[targetId]) room.votes[targetId] = 0;
        room.votes[targetId]++;

        // Si votaron todos (o la mayoría)
        const totalVotes = Object.values(room.votes).reduce((a, b) => a + b, 0);
        if (totalVotes >= room.players.length) {
            finishGame(roomCode);
        }
    });

    // 4. DESCONEXIÓN
    socket.on('disconnect', () => {
        for (const code in rooms) {
            const room = rooms[code];
            const idx = room.players.findIndex(p => p.id === socket.id);
            
            if (idx !== -1) {
                room.players.splice(idx, 1);
                io.to(code).emit('updatePlayerList', { 
                    players: room.players, 
                    jesterActive: room.jesterActive 
                });

                // Si queda vacía, borrar sala
                if (room.players.length === 0) {
                    clearInterval(room.timer);
                    delete rooms[code];
                }
                // Si están jugando y quedan menos de 3, abortar
                else if (room.status === 'playing' && room.players.length < 3) {
                    clearInterval(room.timer);
                    room.status = 'lobby';
                    io.to(code).emit('errorMsg', 'Jugadores insuficientes. Volviendo al lobby.');
                    io.to(code).emit('resetToLobby');
                }
                
                // Actualizar lista pública
                broadcastRoomList();
                break;
            }
        }
    });
});

// --- FUNCIONES AUXILIARES ---

function startVotingPhase(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;
    
    clearInterval(room.timer);
    room.status = 'voting';
    room.votes = {};
    io.to(roomCode).emit('startVoting', room.players);
}

function finishGame(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    let maxVotes = -1;
    let ejectedId = null;
    let isTie = false;

    // Contar votos
    for (const [pid, count] of Object.entries(room.votes)) {
        if (count > maxVotes) {
            maxVotes = count;
            ejectedId = pid;
            isTie = false;
        } else if (count === maxVotes) {
            isTie = true;
        }
    }

    // Lógica de Ganador
    let winnerKey = 'impostor';
    let message = 'Empate. Nadie fue expulsado.';
    const impostorName = room.players.find(p => p.id === room.impostorId)?.name || '???';
    const ejectedName = room.players.find(p => p.id === ejectedId)?.name || 'Nadie';

    if (!isTie && ejectedId) {
        if (ejectedId === room.jesterId) {
            winnerKey = 'jester';
            message = `¡GANA EL BUFÓN! (${ejectedName}) logró ser expulsado.`;
        } else if (ejectedId === room.impostorId) {
            winnerKey = 'crew';
            message = `¡VICTORIA! El impostor (${impostorName}) fue eliminado.`;
        } else {
            winnerKey = 'impostor';
            message = `¡ERROR! Expulsaron a un inocente (${ejectedName}).`;
        }
    }

    io.to(roomCode).emit('gameEnded', { winnerKey, message, impostorName });
    
    // Resetear sala a lobby
    room.status = 'lobby';
    room.votes = {};
    broadcastRoomList(); // Sala vuelve a estar disponible
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});
