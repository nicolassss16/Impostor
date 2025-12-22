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
    
    socket.on('joinRoom', ({ roomCode, username, category }) => {
        socket.join(roomCode);
        
        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                players: [],
                category: wordPacks[category] ? category : 'cosas',
                deck: [...(wordPacks[category] || wordPacks['cosas'])],
                gameActive: false,
                impostorId: null,
                timerInterval: null,
                votes: {} // Para guardar quién vota a quién
            };
        }
        
        const room = rooms[roomCode];
        const existingPlayer = room.players.find(p => p.id === socket.id);
        
        if (!existingPlayer) {
            room.players.push({ id: socket.id, name: username });
        }
        
        io.to(roomCode).emit('updatePlayerList', { players: room.players, category: room.category });
    });

    socket.on('startGame', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.players.length < 3 || room.gameActive) return;

        room.gameActive = true;
        room.votes = {}; // Reiniciar votos
        
        // 1. Elegir Impostor
        const impostorIndex = Math.floor(Math.random() * room.players.length);
        room.impostorId = room.players[impostorIndex].id;

        // 2. Elegir Palabra (Sin repetir hasta agotar mazo)
        if (room.deck.length === 0) room.deck = [...wordPacks[room.category]];
        const cardIndex = Math.floor(Math.random() * room.deck.length);
        const secretWord = room.deck[cardIndex];
        room.deck.splice(cardIndex, 1);

        // 3. Orden de hablar
        let speakingOrder = [...room.players];
        for (let i = speakingOrder.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [speakingOrder[i], speakingOrder[j]] = [speakingOrder[j], speakingOrder[i]];
        }
        const orderNames = speakingOrder.map(p => p.name);

        // 4. Enviar Roles
        room.players.forEach((player) => {
            const isImpostor = (player.id === room.impostorId);
            io.to(player.id).emit('gameStarted', {
                role: isImpostor ? 'impostor' : 'crew',
                word: isImpostor ? '???' : secretWord,
                order: orderNames,
                category: room.category
            });
        });

        // 5. Iniciar Timer (300 segundos = 5 minutos)
        let timeLeft = 300; 
        io.to(roomCode).emit('timerUpdate', timeLeft);
        
        if(room.timerInterval) clearInterval(room.timerInterval);
        
        room.timerInterval = setInterval(() => {
            timeLeft--;
            if(timeLeft >= 0) {
                io.to(roomCode).emit('timerUpdate', timeLeft);
            } else {
                startVotingPhase(roomCode);
            }
        }, 1000);
    });

    // Forzar votación antes de tiempo
    socket.on('forceVote', (roomCode) => {
        startVotingPhase(roomCode);
    });

    // Recibir voto
    socket.on('submitVote', ({ roomCode, targetId }) => {
        const room = rooms[roomCode];
        if(!room || !room.votingOpen) return;

        // Guardar voto
        room.votes[socket.id] = targetId;

        // Comprobar si todos votaron
        if(Object.keys(room.votes).length === room.players.length) {
            calculateWinner(roomCode);
        }
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
                    io.to(roomCode).emit('updatePlayerList', { players: room.players, category: room.category });
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
    
    // Enviar lista de jugadores para votar (id y nombre)
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

    // Lógica de victoria
    let winner = '';
    let message = '';
    
    if (mostVotedId === room.impostorId) {
        winner = 'crew';
        message = '¡El Impostor fue descubierto!';
    } else {
        winner = 'impostor';
        message = '¡Se equivocaron! El Impostor ganó.';
    }

    // Revelar quién era
    const impostorName = room.players.find(p => p.id === room.impostorId)?.name || 'Desconocido';

    io.to(roomCode).emit('gameEnded', {
        winner,
        message,
        impostorName
    });
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server v2.0 corriendo en puerto ${PORT}`);
});
