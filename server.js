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
        "Carrera", "Robleis", "Markito Navaja", "Pellah", "Santutu"
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

let rooms = {};
const GAME_DURATION = 300;

function broadcastRoomList() {
    const publicRooms = [];
    for (const [code, room] of Object.entries(rooms)) {
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
    broadcastRoomList();

    // 1. UNIRSE A SALA
    socket.on('joinRoom', ({ roomCode, username, category, withJester }) => {
        if (!username || !username.trim() || username.trim().length > 20) {
            socket.emit('errorMsg', 'Nombre de usuario inválido (máximo 20 caracteres).');
            return;
        }
        const cleanName = username.trim();

        if (rooms[roomCode] && rooms[roomCode].status !== 'lobby') {
            socket.emit('errorMsg', '¡La partida ya comenzó!');
            return;
        }

        if (rooms[roomCode]) {
            const alreadyIn = rooms[roomCode].players.some(
                p => p.id === socket.id || p.name === cleanName
            );
            if (alreadyIn) {
                socket.emit('errorMsg', 'Ya estás en la sala o ese nombre ya está en uso.');
                return;
            }
        }

        socket.join(roomCode);

        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                status: 'lobby',
                category: wordPacks[category] ? category : 'cosas',
                deck: [...(wordPacks[category] || wordPacks['cosas'])],
                impostorId: null,
                jesterId: null,
                jesterActive: withJester,
                secretWord: null,
                hostId: socket.id,
                timer: null,
                timeLeft: GAME_DURATION,
                votes: {},
                votedPlayers: new Set()
            };
        } else {
            if (socket.id === rooms[roomCode].hostId) {
                if (category && wordPacks[category]) {
                    rooms[roomCode].category = category;
                    rooms[roomCode].deck = [...wordPacks[category]];
                    io.to(roomCode).emit('categoryChanged', category);
                }
                if (withJester !== undefined) {
                    rooms[roomCode].jesterActive = withJester;
                }
            }
        }

        rooms[roomCode].players.push({ id: socket.id, name: cleanName });

        // FIX: enviar hostId para que el cliente sepa quién es host
        io.to(roomCode).emit('updatePlayerList', {
            players: rooms[roomCode].players,
            jesterActive: rooms[roomCode].jesterActive,
            hostId: rooms[roomCode].hostId
        });

        broadcastRoomList();
    });

    // 2. INICIAR JUEGO
    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3) return;

        if (room.hostId !== socket.id) {
            socket.emit('errorMsg', 'Solo el host puede iniciar la partida.');
            return;
        }

        room.status = 'playing';

        const words = room.deck.length > 0 ? room.deck : [...wordPacks[room.category]];
        const secretWord = words[Math.floor(Math.random() * words.length)];
        room.secretWord = secretWord;

        const playerIds = room.players.map(p => p.id);
        const impostorIndex = Math.floor(Math.random() * playerIds.length);
        room.impostorId = playerIds[impostorIndex];

        room.jesterId = null;
        if (room.jesterActive && playerIds.length >= 4) {
            let jesterIndex;
            do {
                jesterIndex = Math.floor(Math.random() * playerIds.length);
            } while (jesterIndex === impostorIndex);
            room.jesterId = playerIds[jesterIndex];
        }

        const turnOrder = [...room.players].sort(() => Math.random() - 0.5).map(p => p.name);

        room.players.forEach(player => {
            let role = 'crew';
            let wordToSend = secretWord;

            if (player.id === room.impostorId) {
                role = 'impostor';
                wordToSend = '???';
            } else if (player.id === room.jesterId) {
                role = 'jester';
                wordToSend = secretWord;
            }

            io.to(player.id).emit('gameStarted', {
                role: role,
                word: wordToSend,
                order: turnOrder,
                hostId: room.hostId  // FIX: enviar hostId al iniciar juego
            });
        });

        broadcastRoomList();

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
    socket.on('forceVote', (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;
        if (room.hostId !== socket.id) {
            socket.emit('errorMsg', 'Solo el host puede forzar la votación.');
            return;
        }
        startVotingPhase(roomCode);
    });

    socket.on('submitVote', ({ roomCode, targetId }) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'voting') return;

        if (room.votedPlayers.has(socket.id)) return;

        const isPlayer = room.players.some(p => p.id === socket.id);
        if (!isPlayer) return;

        room.votedPlayers.add(socket.id);

        if (!room.votes[targetId]) room.votes[targetId] = 0;
        room.votes[targetId]++;

        const totalVotes = Object.values(room.votes).reduce((a, b) => a + b, 0);
        io.to(roomCode).emit('voteProgress', { totalVotes, totalPlayers: room.players.length });

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
                const wasHost = room.hostId === socket.id;
                room.players.splice(idx, 1);

                if (wasHost && room.players.length > 0) {
                    room.hostId = room.players[0].id;
                    io.to(room.hostId).emit('youAreHost');
                }

                // FIX: incluir hostId en el evento de actualización
                io.to(code).emit('updatePlayerList', {
                    players: room.players,
                    jesterActive: room.jesterActive,
                    hostId: room.hostId
                });

                if (room.players.length === 0) {
                    clearInterval(room.timer);
                    delete rooms[code];
                } else if ((room.status === 'playing' || room.status === 'voting') && room.players.length < 3) {
                    clearInterval(room.timer);
                    room.status = 'lobby';
                    room.votes = {};
                    room.votedPlayers = new Set();
                    io.to(code).emit('errorMsg', 'Jugadores insuficientes. Volviendo al lobby.');
                    io.to(code).emit('resetToLobby');
                }

                broadcastRoomList();
                break;
            }
        }
    });
});

function startVotingPhase(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    clearInterval(room.timer);
    room.status = 'voting';
    room.votes = {};
    room.votedPlayers = new Set();
    io.to(roomCode).emit('startVoting', room.players);
}

function finishGame(roomCode) {
    const room = rooms[roomCode];
    if (!room) return;

    let maxVotes = -1;
    let ejectedId = null;
    let isTie = false;

    for (const [pid, count] of Object.entries(room.votes)) {
        if (count > maxVotes) {
            maxVotes = count;
            ejectedId = pid;
            isTie = false;
        } else if (count === maxVotes) {
            isTie = true;
        }
    }

    let winnerKey = 'impostor';
    const impostorName = room.players.find(p => p.id === room.impostorId)?.name || '???';
    const ejectedName = room.players.find(p => p.id === ejectedId)?.name || 'Nadie';
    const secretWord = room.secretWord || '???';
    let message = `Empate. Nadie fue expulsado. El impostor era ${impostorName}. La palabra era: "${secretWord}".`;

    if (!isTie && ejectedId) {
        if (ejectedId === room.jesterId) {
            winnerKey = 'jester';
            message = `¡GANA EL BUFÓN! (${ejectedName}) logró ser expulsado. La palabra era: "${secretWord}".`;
        } else if (ejectedId === room.impostorId) {
            winnerKey = 'crew';
            message = `¡VICTORIA! El impostor (${impostorName}) fue eliminado. La palabra era: "${secretWord}".`;
        } else {
            winnerKey = 'impostor';
            message = `¡ERROR! Expulsaron a un inocente (${ejectedName}). El impostor era ${impostorName}. La palabra era: "${secretWord}".`;
        }
    }

    io.to(roomCode).emit('gameEnded', { winnerKey, message, impostorName, secretWord });

    room.status = 'lobby';
    room.votes = {};
    room.votedPlayers = new Set();
    room.secretWord = null;
    room.impostorId = null;
    room.jesterId = null;
    room.deck = [...wordPacks[room.category]];

    broadcastRoomList();
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});