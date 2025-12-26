const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// --- CONFIGURACIÓN DE CATEGORÍAS ---
// --- CONFIGURACIÓN DE CATEGORÍAS (MODO BESTIA) ---
// --- CONFIGURACIÓN DE CATEGORÍAS (CORREGIDO: SOLO PERSONAJES) ---
const wordPacks = {
    lol: [
        // SOLO CAMPEONES
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
        // SOLO JUGADORES
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
        // SOLO COMIDA (Esto ya te había gustado)
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
        // SOLO PERSONAS
        "Ibai", "AuronPlay", "Rubius", "Spreen", "Davoo Xeneize", "Coscu",
        "Momo", "Kun Agüero", "TheGrefg", "ElMariana", "Rivers", "Bananirou",
        "Unicornio", "Mazzat", "Luquitas Rodriguez", "Hasbulla", "MrBeast", 
        "Vegetta777", "Willyrex", "Frankkaster", "La Cobra", "Gastón Edul",
        "Carrera", "Robleis", "Markito Navaja", "Pellah", "Santutu", "Momo"
    ],
    cine: [
        // PELICULAS Y SERIES
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

io.on('connection', (socket) => {
    // Al unirse, recibimos si quieren modo Bufón
    socket.on('joinRoom', ({ roomCode, username, category, withJester }) => {
        socket.join(roomCode);
        
        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                category: wordPacks[category] ? category : 'cosas',
                deck: [...(wordPacks[category] || wordPacks['cosas'])],
                gameActive: false,
                roles: {}, // Guardamos { socketId: 'impostor' | 'crew' | 'jester' }
                timerInterval: null,
                votes: {},
                votingOpen: false,
                settings: {
                    jester: withJester || false // Guardamos la configuración de la sala
                }
            };
        }
        
        const room = rooms[roomCode];
        if (!room.players.find(p => p.id === socket.id)) {
            room.players.push({ id: socket.id, name: username });
        }
        
        io.to(roomCode).emit('updatePlayerList', { 
            players: room.players, 
            category: room.category,
            jesterActive: room.settings.jester 
        });
    });

    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3 || room.gameActive) return;

        room.gameActive = true;
        room.votes = {};
        room.roles = {};

        const playerCount = room.players.length;
        
        // --- ASIGNACIÓN DE ROLES ---
        let availableRoles = [];
        
        // 1. Calcular cuántos impostores (2 si hay 7 o más jugadores)
        const impostorCount = playerCount >= 7 ? 2 : 1;
        for(let i=0; i<impostorCount; i++) availableRoles.push('impostor');

        // 2. Agregar Bufón si está activado (y hay al menos 4 jugadores)
        if (room.settings.jester && playerCount >= 4) {
            availableRoles.push('jester');
        }

        // 3. Rellenar con Tripulantes
        while (availableRoles.length < playerCount) {
            availableRoles.push('crew');
        }

        // 4. Mezclar roles (Fisher-Yates Shuffle)
        for (let i = availableRoles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableRoles[i], availableRoles[j]] = [availableRoles[j], availableRoles[i]];
        }

        // 5. Asignar roles a jugadores
        room.players.forEach((player, index) => {
            room.roles[player.id] = availableRoles[index];
        });

        // --- PALABRA SECRETA ---
        if (room.deck.length === 0) room.deck = [...wordPacks[room.category]];
        const cardIndex = Math.floor(Math.random() * room.deck.length);
        const secretWord = room.deck[cardIndex];
        room.deck.splice(cardIndex, 1);

        // --- ORDEN DE HABLA ---
        let speakingOrder = [...room.players];
        speakingOrder.sort(() => Math.random() - 0.5);

        // --- ENVIAR DATOS A CADA JUGADOR ---
        // Identificar impostores para que se conozcan entre ellos
        const impostorNames = room.players
            .filter(p => room.roles[p.id] === 'impostor')
            .map(p => p.name);

        room.players.forEach((player) => {
            const myRole = room.roles[player.id];
            
            io.to(player.id).emit('gameStarted', {
                role: myRole,
                word: (myRole === 'impostor') ? '???' : secretWord,
                order: speakingOrder.map(p => p.name),
                category: room.category,
                // Si soy impostor y hay más de uno, envío quién es mi compañero
                teammates: (myRole === 'impostor' && impostorCount > 1) ? impostorNames.filter(n => n !== player.name) : []
            });
        });

        // --- TIMER ---
        let timeLeft = 300; 
        io.to(roomCode).emit('timerUpdate', timeLeft);
        if(room.timerInterval) clearInterval(room.timerInterval);
        
        room.timerInterval = setInterval(() => {
            timeLeft--;
            if(timeLeft >= 0) io.to(roomCode).emit('timerUpdate', timeLeft);
            else startVotingPhase(roomCode);
        }, 1000);
    });

    socket.on('forceVote', (roomCode) => startVotingPhase(roomCode));

    socket.on('submitVote', ({ roomCode, targetId }) => {
        const room = rooms[roomCode];
        if(!room || !room.votingOpen) return;
        room.votes[socket.id] = targetId;
        if(Object.keys(room.votes).length === room.players.length) calculateWinner(roomCode);
    });

    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const pIndex = room.players.findIndex(p => p.id === socket.id);
            if (pIndex !== -1) {
                room.players.splice(pIndex, 1);
                if (room.players.length === 0) {
                    if(room.timerInterval) clearInterval(room.timerInterval);
                    delete rooms[roomCode];
                } else {
                    io.to(roomCode).emit('updatePlayerList', { 
                        players: room.players, 
                        category: room.category,
                        jesterActive: room.settings.jester
                    });
                }
                break;
            }
        }
    });
});

function startVotingPhase(roomCode) {
    const room = rooms[roomCode];
    if(!room) return;
    if(room.timerInterval) clearInterval(room.timerInterval);
    room.votingOpen = true;
    io.to(roomCode).emit('startVoting', room.players);
}

function calculateWinner(roomCode) {
    const room = rooms[roomCode];
    if(!room) return;
    room.gameActive = false;
    room.votingOpen = false;

    // Contar votos
    let voteCounts = {};
    for(let voterId in room.votes) {
        let target = room.votes[voterId];
        voteCounts[target] = (voteCounts[target] || 0) + 1;
    }

    // Encontrar al más votado
    let maxVotes = -1;
    let mostVotedId = null;
    for(let targetId in voteCounts) {
        if(voteCounts[targetId] > maxVotes) {
            maxVotes = voteCounts[targetId];
            mostVotedId = targetId;
        }
    }

    // --- LÓGICA DE VICTORIA (Nueva) ---
    const votedRole = room.roles[mostVotedId];
    const votedPlayerName = room.players.find(p => p.id === mostVotedId)?.name || 'Nadie';

    // Obtener nombres de los impostores para revelarlos
    const impostorsList = room.players
        .filter(p => room.roles[p.id] === 'impostor')
        .map(p => p.name)
        .join(' y ');

    let winner = '';
    let message = '';
    let mainColor = ''; // Para el frontend

    if (votedRole === 'jester') {
        // CASO 1: Votaron al Bufón -> Gana el Bufón
        winner = 'jester';
        message = `¡JA JA JA! Votaron al Bufón. ${votedPlayerName} gana solo.`;
        mainColor = 'jester';
    } else if (votedRole === 'impostor') {
        // CASO 2: Votaron al Impostor -> Ganan Tripulantes
        winner = 'crew';
        message = `¡Bien hecho! ${votedPlayerName} era el Impostor.`;
        mainColor = 'crew';
    } else {
        // CASO 3: Votaron a un Inocente -> Gana el Impostor
        winner = 'impostor';
        message = `¡Error! ${votedPlayerName} era inocente. Ganan los Impostores.`;
        mainColor = 'impostor';
    }

    io.to(roomCode).emit('gameEnded', {
        winnerKey: winner, // crew, impostor, jester
        message,
        impostorName: impostorsList,
        colorType: mainColor
    });
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log(`Server v3.0 (Bufón + Doble Imp) listo en puerto ${PORT}`); });
